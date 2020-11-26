import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('api')
export class CatsController {

  @Post('event')
  createEvent(): string {
    return 'This action adds a new cat!';
  }

  @Get()
  findAll(@Res() res: Response){
    res.status(HttpStatus.OK).json([]);
  }
}