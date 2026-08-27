import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private emailService: EmailService) {}

  async sendContactMessage(contactDto: ContactDto) {
    const { nom, email, sujet, message } = contactDto;

    // Notification par email au service contact de l'ARD
    await this.emailService.sendContactNotification(nom, email, message);

    // Accusé de réception au visiteur
    if (email) {
      await this.emailService
        .sendEmail(
          email,
          sujet ? `Re: ${sujet}` : 'Accusé de réception - ARD Ziguinchor',
          `<h1>Merci pour votre message</h1>
           <p>Bonjour <strong>${nom}</strong>,</p>
           <p>Nous avons bien reçu votre message et vous en remercions.</p>
           ${sujet ? `<p><strong>Sujet:</strong> ${sujet}</p>` : ''}
           <p><strong>Votre message:</strong></p>
           <p>${message}</p>
           <p>Notre équipe vous répondra dans les plus brefs délais.</p>
           <br/>
           <p>Cordialement,<br/>L'équipe ARD Ziguinchor</p>`,
        )
        .catch(() => {
          // Ne pas bloquer la requête si l'email de confirmation échoue
          // La notification principale a déjà été envoyée
        });
    }

    return {
      success: true,
      message: 'Message envoyé avec succès',
    };
  }
}
