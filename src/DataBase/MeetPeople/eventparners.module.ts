import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventparnersService } from './eventparners.service';
import { EventparnersController } from './eventparners.controller';
import { Eventparner } from './eventparners.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from '../MeetingEvent/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Eventparner]), AuthModule, forwardRef(() => EventsModule)],
  providers: [EventparnersService],
  controllers: [EventparnersController],
  exports: [TypeOrmModule,EventparnersService]
})
export class EventparnersModule {}