import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { AES } from 'crypto-ts';
import { Controller, Get, Post, Patch, Delete, Param, Body, Response, HttpStatus } from '@nestjs/common';


@Injectable()
export class UsersService {

  private privatekey = "privatekey";

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(data: User): Promise<[number, string]> {

    let havedUser = await this.usersRepository.find({ account: data.account });

    if (havedUser.length == 0) {

      let user=new User();
      user.account=data.account;
      user.password=AES.encrypt(data.password, this.privatekey).toString()
      await this.usersRepository.save(user);

      return [HttpStatus.CREATED, "OK"];
    } else {
      
      return [HttpStatus.BAD_REQUEST, "帳號已存在"];
    }
  }
}