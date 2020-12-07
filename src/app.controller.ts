import { Controller, Get, Post, Body, Response, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('Send')
  async send(@Response() res, @Body() data) {
    let response = await this.appService.sned(data);
    res.status(HttpStatus.CREATED).json(response);
  }

}

