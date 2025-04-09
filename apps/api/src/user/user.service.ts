import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
  ) {}

  register() {
    return 'This action adds a new user';
  }

  confirmMail() {
    return 'This action confirm user mail';
  }

  findOne(id: string) {
    return 'This should find one user';
  }
}
