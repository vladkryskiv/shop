import { Controller, Post, Get, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { BasketService } from './basket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';

@Controller('basket')
@UseGuards(JwtAuthGuard)
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post('add')
  async addToBasket(
    @GetUser() user: User,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.basketService.addToBasket(user.id, productId, quantity);
  }
  
  @Delete('remove/:productId')
  async removeFromBasket(
    @GetUser() user: User,
    @Param('productId') productId: number,
  ) {
    return this.basketService.removeFromBasket(user.id, productId);
  }

  @Get()
  async getBasket(@GetUser() user: User) {
    return this.basketService.getBasket(user.id);
  }

  @Patch('update')
  async updateBasketItemQuantity(
    @GetUser() user: User,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.basketService.updateBasketItemQuantity(user.id, productId, quantity);
  }

  @Delete('clear')
  async clearBasket(@GetUser() user: User) {
    return this.basketService.clearBasket(user.id);
  }
}