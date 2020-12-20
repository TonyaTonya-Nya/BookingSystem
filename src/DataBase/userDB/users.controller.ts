import { Controller, Get, Post, Body, Response, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import {AuthService} from '../../Auth/auth.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService) { }

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

    
    console.log('JWT驗證step1: 用戶請求登錄');
    const authResult = await this.authService.validateUser(data.account, data.password);
    console.log(authResult);
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }

    let response = await this.usersService.login(data);
    res.status(response[0]).json(response);
  }
}