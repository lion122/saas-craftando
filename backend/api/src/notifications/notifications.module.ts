import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Handlebars from 'handlebars';

// Registrar helpers do Handlebars
Handlebars.registerHelper('multiply', function(a, b) {
  return a * b;
});

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST', 'smtp.gmail.com'),
          port: config.get('MAIL_PORT', 587),
          secure: config.get('MAIL_SECURE', false),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get('MAIL_FROM_NAME', 'E-commerce SaaS')}" <${config.get('MAIL_FROM_ADDRESS', 'noreply@saas.craftando.com.br')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {} 