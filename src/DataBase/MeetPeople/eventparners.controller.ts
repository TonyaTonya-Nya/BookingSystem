import { Controller,Post,Body,Response,Delete } from '@nestjs/common';
import { EventparnersService } from './eventparners.service';
import { Eventparner } from './eventparners.entity';

@Controller('eventparner')
export class EventparnersController {
  constructor(private readonly eventparnersService: EventparnersService) { }

  /*
  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }*/

  @Post()
  async create(@Response() res, @Body() data) {
  
    let response = await this.eventparnersService.create(data);
    res.status(response[0]).json(response);

  }

  


  @Delete()
  async delete(@Response() res, @Body() data) {

    let response = await this.eventparnersService.delete(data);
    res.status(response[0]).json(response);

  }
}