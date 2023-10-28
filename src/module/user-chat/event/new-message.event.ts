import { PublishableEventInterface } from '../../redis-event-pub-sub/event/emitter/contract/publishable-event.interface';

export class NewMessageEvent implements PublishableEventInterface {
  static publishableEventName = 'events:new-message';

  publishableEventName = NewMessageEvent.publishableEventName;

  constructor(public readonly message: string) {}
}
