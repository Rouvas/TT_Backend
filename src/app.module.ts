import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { EntitiesModule } from './entities/entities.module';
import { MailerService } from './common/services/mailer.service';
import { TgbotService } from './common/services/tgbot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EntityStickerService } from './common/services/entity-sticker.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/storage',
      rootPath: join(__dirname, '..', '..', '..', '/storage'),
    }),
    MongooseModule.forRoot('mongodb://localhost/tehnotitan'),
    AdminModule,
    EntitiesModule,
    TelegrafModule.forRoot({
      token: '6841836949:AAFYzxczk5EveO0D9urMQz30dAe-8-c0aR8',
    }),
  ],
  providers: [MailerService, TgbotService, EntityStickerService],
})
export class AppModule {}
