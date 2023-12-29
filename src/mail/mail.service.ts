import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendResetPasswordConfirmation(email: string, token: string) {
    const url = `${this.config.get('CLIENT_URL')}/password-reset/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: 'reset-password-confirmation',
      context: {
        url,
      },
    });
  }

  async replyToSupportMessage(email: string, context: { content: string }) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Technical support',
      template: 'reply-to-support-message',
      context,
    });
  }
}
