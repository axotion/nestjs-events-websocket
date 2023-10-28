import { Body, Controller, Inject, Post } from '@nestjs/common';
import { EventEmitterInterface } from '../../../../../redis-event-pub-sub/event/emitter/contract/event-emitter.interface';
import { EVENT_EMITTER_TOKEN } from '../../../../../redis-event-pub-sub/event/emitter/redis.event-emitter';
import { NewMessageEvent } from '../../../../event/new-message.event';
import { SendMessageHttpRequest } from './request/send-message.http-request';

@Controller('messages')
export class SendMessageAction {
  constructor(
    @Inject(EVENT_EMITTER_TOKEN)
    private readonly eventEmitter: EventEmitterInterface,
  ) {}

  @Post()
  async handle(@Body() request: SendMessageHttpRequest) {
    await this.eventEmitter.emit(
      NewMessageEvent.name,
      new NewMessageEvent(request.content),
    );
  }
}
