import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { AccountVerificationDto } from './dto/account-verification';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  sendAccountVerification(accountVerificationDto: AccountVerificationDto){
    this.mailService.sendAccountVerification(accountVerificationDto)
  }
}
