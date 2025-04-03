import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  register() {
    return 'This action adds a new user';
  }

  confirmMail() {
    return 'This action confirm user mail'
  }

  findOne(id: string) {
    return 'This should find one user';
  }
}
