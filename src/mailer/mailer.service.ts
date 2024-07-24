import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'spanchak228@gmail.com',
        pass: 'zwne hugo slfv dacq',
      },
    });
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    return await this.transporter.sendMail(mailOptions);
  }
}