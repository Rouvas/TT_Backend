import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { EntitiesModule } from './entities/entities.module';
import { MailerService } from './common/services/mailer.service';
import { TgbotService } from './common/services/tgbot.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tehnotitan'),
    AdminModule,
    EntitiesModule,
  ],
  providers: [MailerService, TgbotService],
})
export class AppModule {}
