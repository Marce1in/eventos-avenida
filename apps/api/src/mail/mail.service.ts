import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AccountVerificationDto } from './dto/account-verification';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendAccountVerification(
    accountVerificationDto: AccountVerificationDto,
  ) {
    await this.mailerService.sendMail({
      to: accountVerificationDto.mail,
      subject: 'Account Verification',
      template: './accountVerification',

      context: {
        otp: accountVerificationDto.otp,
      },
    });
  }
}
