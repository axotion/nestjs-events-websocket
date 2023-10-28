import { Module } from '@nestjs/common';
import { RedisEventPubSubModule } from '../redis-event-pub-sub/redis-event-pub-sub.module';
import { NewMessageEvent } from './event/new-message.event';
import { SendMessageAction } from './transport/http/action/send-message/send-message.action';
import { MessagesWebsocketGateway } from './transport/websocket/messages/messages.websocket-gateway';

@Module({
  imports: [
    RedisEventPubSubModule.registerEvents([
      NewMessageEvent.publishableEventName,
    ]),
  ],
  controllers: [SendMessageAction],
  providers: [MessagesWebsocketGateway],
})
export class UserChatModule {}
