import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    return this.resend.emails.send({
      from: 'ARD Ziguinchor <noreply@ard-ziguinchor.com>',
      to: [to],
      subject: subject,
      html: html,
    });
  }

  async sendContactNotification(nom: string, email: string, message: string) {
    return this.sendEmail(
      'contact@ard-ziguinchor.com',
      `Nouveau message de contact - ${nom}`,
      `<h1>Nouveau message de contact</h1>
       <p><strong>Nom:</strong> ${nom}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong></p>
       <p>${message}</p>`,
    );
  }
}
