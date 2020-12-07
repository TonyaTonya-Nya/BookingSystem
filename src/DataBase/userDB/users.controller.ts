import { Controller, Get, Post, Body, Response, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }



  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  @Post('create')
  async create(@Response() res, @Body() data) {
    let response = await this.usersService.create(data);
    res.status(response[0]).json(response);
  }


  @Post('login')
  async login(@Response() res, @Body() data) {
    
    let response = await this.usersService.login(data);
    res.status(response[0]).json(response);
  }
}