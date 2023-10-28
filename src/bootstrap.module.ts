import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisEventPubSubModule } from './module/redis-event-pub-sub/redis-event-pub-sub.module';
import { UserChatModule } from './module/user-chat/user-chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisEventPubSubModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST') || 'localhost',
        port: configService.get('REDIS_PORT') || '6379',
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    UserChatModule,
  ],
  controllers: [],
  providers: [],
})
export class BootstrapModule {}
