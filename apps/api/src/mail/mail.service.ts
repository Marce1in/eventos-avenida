import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  sendAccountVerification(otp: string){
    return "This should send a mail"
  }
}
