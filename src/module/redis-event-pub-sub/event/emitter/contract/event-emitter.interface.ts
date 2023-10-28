export interface EventEmitterInterface {
  emit(eventName: string, data: any): void;
}
