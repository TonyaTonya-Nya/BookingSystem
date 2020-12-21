import { Controller, Get, Param, Post, Response, HttpStatus, Body, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './events.entity';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }


  @Get()
  async findById(@Response() res, @Param() params) {


    res.status(HttpStatus.OK).json(await this.eventsService.find(params.id));

  }


  @Get('date/:date')
  async find(@Response() res, @Param() params) {


    res.status(HttpStatus.OK).json(await this.eventsService.findByDate(params.date));

  }

  @Get('mail/:mail')
  async findByMail(@Response() res, @Param() params) {
    res.status(HttpStatus.OK).json(await this.eventsService.findByMail(params.mail));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Response() res, @Body() data, @Request() req) {
    let response = await this.eventsService.create(data, req);
    res.status(response[0]).json(response);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async delete(@Response() res, @Body() data, @Request() req) {
    let response = await this.eventsService.delete(data, req);
    res.status(response[0]).json(response);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async update(@Response() res, @Body() data, @Request() req) {
    let response = await this.eventsService.update(data, req);
    res.status(response[0]).json(response);
  }

}