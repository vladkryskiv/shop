import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { name: string, email: string, password: string }) {
    const { name, email, password } = body;
    await this.userService.sendVerificationCode(email, name, password);
    return { message: 'Verification code sent to your email' };
  }

  @Post('verify')
  async verify(@Body() body: { email: string, code: string }) {
    const { email, code } = body;
    return await this.userService.verifyCode(email, code);
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    const { email, password } = body;
    return await this.userService.login(email, password);
  }
}
