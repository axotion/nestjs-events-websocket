import { IsString } from 'class-validator';

export class SendMessageHttpRequest {
  @IsString()
  content: string;
}
