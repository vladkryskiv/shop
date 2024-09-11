import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module'; 
import { ProductModule } from './product/product.module'; 
import { UserController } from './user/user.controller';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { MailerService } from './mailer/mailer.service';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { BasketModule } from './basket/basket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductModule,
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    BasketModule,
  ],
  providers: [PrismaService, MailerService, UserService],
  controllers: [UserController],
  exports: [],
})
export class AppModule {}
