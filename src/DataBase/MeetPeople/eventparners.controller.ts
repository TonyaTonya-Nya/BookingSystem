import { Controller,Post,Body,Response,Delete, Request, UseGuards } from '@nestjs/common';
import { EventparnersService } from './eventparners.service';
import { Eventparner } from './eventparners.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('eventparner')
export class EventparnersController {
  constructor(private readonly eventparnersService: EventparnersService) { }

  /*
  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }*/

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Response() res, @Body() data, @Request() req) {
  
    let response = await this.eventparnersService.create(data, req);
    res.status(response[0]).json(response);

  }

  

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async delete(@Response() res, @Body() data, @Request() req) {

    let response = await this.eventparnersService.delete(data, req);
    res.status(response[0]).json(response);

  }
}