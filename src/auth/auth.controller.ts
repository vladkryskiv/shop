import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.login(req.user);
    res.redirect(`http://localhost:3000/auth/success?token=${jwt.access_token}`);
  }

  @Get('success')
  async authSuccess(@Req() req) {
    return req.user;
  }
}
