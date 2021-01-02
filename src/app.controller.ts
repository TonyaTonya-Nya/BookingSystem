import { Controller, Get, Post, Body, Response, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sendMail')
  async sendMail(@Response() res, @Body() data, @Request() req) {
    let response = await this.appService.sendMail(data, req);
    console.log('拿到回傳結果');
    res.status(response[0]).json(response);
  }

  @Post('sendCalendar')
  async sendCalendar(@Response() res, @Body() data) {
    let response = await this.appService.sendCalendar(data);
    res.status(response[0]).json(response);
  }

}

