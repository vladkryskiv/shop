import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Manually defined interfaces
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
}

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProductById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByName(name: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        category: {
          contains: category,
          mode: 'insensitive',
        },
      },
    });
  }
}
