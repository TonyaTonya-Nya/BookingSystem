import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}