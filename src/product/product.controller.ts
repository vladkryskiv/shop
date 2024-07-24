import { Controller, Post, Get, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('ADMIN')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get('search')
  @Roles('USER')
  async searchProducts(
    @Query('name') name?: string,
    @Query('category') category?: string
  ) {
    if (name) {
      return this.productService.findByName(name);
    } else if (category) {
      return this.productService.findByCategory(category);
    } else {
      return this.productService.getAllProducts();
    }
  }

  @Get(':id')
  @Roles('USER')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }
}
