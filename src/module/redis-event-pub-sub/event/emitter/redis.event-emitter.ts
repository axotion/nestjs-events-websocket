import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisClientType } from 'redis';
import { EventEmitterInterface } from './contract/event-emitter.interface';
import { PublishableEventInterface } from './contract/publishable-event.interface';

export const EVENT_EMITTER_TOKEN = 'EVENT_EMITTER_TOKEN';

export class RedisEventEmitter implements EventEmitterInterface {
  constructor(
    private redisPubClient: RedisClientType,
    private eventEmitter: EventEmitter2,
  ) {}

  async emit(eventName: string, payload: Record<any, any>): Promise<void> {
    this.eventEmitter.emit(eventName, payload);

    if (this.isPublishableEvent(payload)) {
      await this.redisPubClient.publish(
        payload.publishableEventName,
        JSON.stringify(payload),
      );
    }
  }

  private isPublishableEvent(event: any): event is PublishableEventInterface {
    return event.publishableEventName !== undefined;
  }
}
