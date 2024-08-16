import { Module } from '@nestjs/common';
import { ChatpadController } from './chatpad.controller';
import { ChatpadService } from './chatpad.service';

@Module({
  controllers: [ChatpadController],
  providers: [ChatpadService]
})
export class ChatpadModule {}
