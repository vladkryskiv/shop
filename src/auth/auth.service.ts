import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { username: user.email, sub: user.id, roles: user.role };  // Ensure roles are included
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateUserByGoogle(user: any): Promise<any> {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      return existingUser;
    }

    // If the user doesn't exist, create a new one
    const newUser = await this.userService.createGoogleUser(user);
    return newUser;
  }
}

