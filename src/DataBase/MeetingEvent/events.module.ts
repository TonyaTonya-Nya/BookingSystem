import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './events.entity';
import { EventparnersModule } from '../MeetPeople/eventparners.module';
import { AuthModule } from 'src/Auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),EventparnersModule, AuthModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [TypeOrmModule, EventsService],
})
export class EventsModule {}