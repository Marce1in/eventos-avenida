import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  sendAccountVerification(otp: string){
    this.mailService.sendAccountVerification(otp)
  }
}
