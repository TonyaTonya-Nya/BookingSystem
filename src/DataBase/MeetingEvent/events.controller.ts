import { Controller, Get, Param, Post, Response, HttpStatus, Body,Delete,Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }



  @Get('date/:date')
  async find(@Response() res, @Param() params) {


    res.status(HttpStatus.OK).json(await this.eventsService.findByDate(params.date));

  }

  @Post('create')
  async create(@Response() res, @Body() data) {

    let response = await this.eventsService.create(data);
    res.status(response[0]).json(response);

  }


  @Delete('delete')
  async delete(@Response() res, @Body() data) {

    let response = await this.eventsService.delete(data);
    res.status(response[0]).json(response);

  }


  @Put('update')
  async update(@Response() res, @Body() data) {

    let response = await this.eventsService.update(data);
    console.log(response);
    res.status(response[0]).json(response);

  }
}