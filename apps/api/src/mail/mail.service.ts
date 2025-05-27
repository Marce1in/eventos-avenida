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
      subject: 'Verificação de conta',
      template: './accountVerification',

      context: {
        otp: accountVerificationDto.otp,
      },
    });
  }

  async sendPasswordChange(
    passwordResetDto: AccountVerificationDto,
  ) {
    await this.mailerService.sendMail({
      to: passwordResetDto.mail,
      subject: 'Requisição de troca de senha',
      template: './changePassReq',

      context: {
        otp: passwordResetDto.otp,
      },
    });
  }

  async sendEmailChangeConfirmation(
    emailChangeConfDto: AccountVerificationDto
  ){
    await this.mailerService.sendMail({
      to: emailChangeConfDto.mail,
      subject: 'Confirmar mudança de E-mail',
      template: './emailChangeVerification',

      context: {
        token: emailChangeConfDto.otp,
      },
    });
  }
}
