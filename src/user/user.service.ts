import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';

@Injectable()
export class UserService {
  private verificationCodes: Map<string, { name: string; email: string; password: string, code: string }> = new Map();

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async sendVerificationCode(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

    this.verificationCodes.set(email, { name, email, password: hashedPassword, code });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}`
    };

    await this.mailerService.sendMail(mailOptions);
  }

  async verifyCode(email: string, code: string) {
    const storedData = this.verificationCodes.get(email);
    if (!storedData || storedData.code !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const { name, password } = storedData;
    this.verificationCodes.delete(email);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role: Role.User,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, roles: user.role };  // Ensure roles are included
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
