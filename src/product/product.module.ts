import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET }), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, RolesGuard],
  exports: [ProductService],
})
export class ProductModule {}
