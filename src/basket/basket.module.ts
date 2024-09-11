import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust the import path as necessary

@Module({
  imports: [PrismaModule],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}