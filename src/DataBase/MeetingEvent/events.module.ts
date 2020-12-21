import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './events.entity';
import { EventparnersModule } from '../MeetPeople/eventparners.module';
import { AuthService } from 'src/Auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),EventparnersModule, AuthModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [TypeOrmModule, EventsService],
})
export class EventsModule {}