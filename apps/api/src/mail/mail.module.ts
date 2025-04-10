import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          port: configService.get<number>('EMAIL_PORT'),
        },
        defaults: {
          from: configService.get<string>('EMAIL_SENDER'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        // options: {
        //   partials: {
        //     dir: __dirname + '/templates',
        //     Options: {
        //       strict: true,
        //     },
        //   },
        // },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
