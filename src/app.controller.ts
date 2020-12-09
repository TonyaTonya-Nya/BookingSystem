import { Controller, Get, Post, Body, Response, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('sendMail')
  async sendMail(@Response() res, @Body() data) {
    let response = await this.appService.sendMail(data);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Post('sendCalendar')
  async sendCalendar(@Response() res, @Body() data) {
    let response = await this.appService.sendCalendar(data);
    res.status(HttpStatus.CREATED).json(response);
  }

}

