import { Controller, Get, Post, Body, Response, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthService } from '../../Auth/auth.service'
import { AuthGuard } from '@nestjs/passport';

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
    let result = [];
    switch (authResult.code) {
      case 1:
        result = await this.authService.certificate(authResult.user);
        break;
      case 2:
        result = [HttpStatus.BAD_REQUEST, "帳號或密碼錯誤", null];
        break;
      default:
        result = [HttpStatus.BAD_REQUEST, "帳號未註冊", null];
        break;
    }
    res.status(result[0]).json(result);
    // let response = await this.usersService.login(data);
    // res.status(response[0]).json(response);
  }
}