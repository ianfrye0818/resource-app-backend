import { Injectable } from '@nestjs/common';
import { env } from '../../env';
import { Resend } from 'resend';

interface EmailData {
  from?: string;
  to: string[];
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private RESEND_API_KEY = env.RESEND_API_KEY;
  private resend: Resend;

  constructor() {
    if (!this.RESEND_API_KEY) {
      throw new Error('API Key is not defined');
    }
    this.resend = new Resend(this.RESEND_API_KEY);
  }

  async sendEmail({
    from = 'Resource Support <support@email.ianfrye.dev>',
    ...rest
  }: EmailData) {
    const { data, error } = await this.resend.emails.send({ from, ...rest });
    if (error) {
      return console.error(error);
    }
    console.log('Email Sent. ID: ', data);
  }
}
