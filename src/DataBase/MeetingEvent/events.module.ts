import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './events.entity';
import { EventparnersModule } from '../MeetPeople/eventparners.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),EventparnersModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [TypeOrmModule],
})
export class EventsModule {}