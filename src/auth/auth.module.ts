// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    
  ],
  providers: [AuthService, JwtStrategy,GoogleStrategy,],
  exports: [AuthService,JwtStrategy, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
