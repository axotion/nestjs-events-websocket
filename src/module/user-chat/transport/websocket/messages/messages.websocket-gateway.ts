import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Observable, from, map } from 'rxjs';
import { PublishableEventInterface } from '../../../../redis-event-pub-sub/event/emitter/contract/publishable-event.interface';
import {
  EVENT_SUBSCRIBER_TOKEN,
  EventSubscriberInterface,
} from '../../../../redis-event-pub-sub/event/subscriber/event-subscriber.interface';
import { NewMessageEvent } from '../../../event/new-message.event';

export enum WebsocketEventSubscribeList {
  FETCH_EVENTS_MESSAGES = 'fetch-events-messages',
  EVENTS_MESSAGES_STREAM = 'events-messages-stream',
}

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class MessagesWebsocketGateway {
  constructor(
    @Inject(EVENT_SUBSCRIBER_TOKEN)
    private eventSubscriber: EventSubscriberInterface,
  ) {}

  @SubscribeMessage(WebsocketEventSubscribeList.FETCH_EVENTS_MESSAGES)
  async streamMessagesData(@ConnectedSocket() client: any) {
    const stream$ = this.createWebsocketStreamFromEventFactory(
      client,
      this.eventSubscriber,
      NewMessageEvent.publishableEventName,
    );

    const event = WebsocketEventSubscribeList.EVENTS_MESSAGES_STREAM;
    return from(stream$).pipe(map((data) => ({ event, data })));
  }

  private createWebsocketStreamFromEventFactory(
    client: any,
    eventSubscriber: EventSubscriberInterface,
    eventName: string,
  ): Observable<any> {
    return new Observable((observer) => {
     const dynamicListener = (message: PublishableEventInterface) => {
        observer.next(message);
      };

      eventSubscriber.on(eventName, dynamicListener);

      client.on('disconnect', () => {
        eventSubscriber.off(eventName, dynamicListener);
      });
    });
  }
}
