import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BasketService {
  constructor(private prisma: PrismaService) {}

  async addToBasket(userId: number, productId: number, quantity: number) {
    const basket = await this.getOrCreateBasket(userId);

    const existingItem = basket.items.find(item => item.productId === productId);

    if (existingItem) {
      return this.prisma.basketItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      return this.prisma.basketItem.create({
        data: {
          basketId: basket.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }
  }

  async removeFromBasket(userId: number, productId: number) {
    const basket = await this.getBasket(userId);
    return this.prisma.basketItem.deleteMany({
      where: {
        basketId: basket.id,
        productId,
      },
    });
  }

  async getBasket(userId: number) {
    const basket = await this.prisma.basket.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!basket) {
      throw new NotFoundException('Basket not found');
    }

    return basket;
  }

  private async getOrCreateBasket(userId: number) {
    let basket = await this.prisma.basket.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!basket) {
      basket = await this.prisma.basket.create({
        data: { userId },
        include: { items: true },
      });
    }

    return basket;
  }

  async updateBasketItemQuantity(userId: number, productId: number, quantity: number) {
    const basket = await this.getBasket(userId);
    return this.prisma.basketItem.updateMany({
      where: {
        basketId: basket.id,
        productId,
      },
      data: { quantity },
    });
  }

  async clearBasket(userId: number) {
    const basket = await this.getBasket(userId);
    return this.prisma.basketItem.deleteMany({
      where: { basketId: basket.id },
    });
  }
}