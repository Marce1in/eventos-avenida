import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [MailModule, CacheModule.register()],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
