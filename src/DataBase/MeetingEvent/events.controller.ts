import { Controller, Get,Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  /*
  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }*/

  @Get()
  findAll(): string {
   // { id:1,eventName: 'Meet', roomId: 1, description: "無", start_t: null, end_t: null, isCencel: false }
    this.eventsService.create( );
    return "ASAA";
  }
}