import { Controller, Post, Get, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';  // Import the Role enum

@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.Admin)  // Use the Role enum
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get('search')
  @Roles(Role.User, Role.Admin)  // Use the Role enum
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
  @Roles(Role.User, Role.Admin)  // Use the Role enum
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }
}
