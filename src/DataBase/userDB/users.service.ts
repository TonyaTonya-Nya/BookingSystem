import { Injectable,HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { AES } from 'crypto-ts';
import { Validator } from "validator.ts/Validator";

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

  findOneByAccount(account: string): Promise<User> {
    return this.usersRepository.findOne({ account: account });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }


  //新增帳戶
  async create(data: any): Promise<[number, string, any]> {

    //驗證資料存在性
    if (Object.keys(data).length === 0) {
      return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
    }

    let user = new User();
    user.account = data.account;
    user.password = data.password;
    user.mail = data.mail;

    try {
      //驗證資料正確性
      let validator = new Validator();
      let errors = validator.validate(user);

      if (errors.length != 0) {
        return [HttpStatus.BAD_REQUEST, "輸入資料有誤", errors];
      }
    } catch {

      return [HttpStatus.BAD_REQUEST, "輸入資料缺少", null];
    }

    //驗證資料重複性
    let existUser = await this.usersRepository.find({ account: data.account });

    if (existUser.length != 0) {
      return [HttpStatus.BAD_REQUEST, "帳號已存在", null];
    }


    user.password = AES.encrypt(data.password, this.privatekey).toString()


    await this.usersRepository.save(user).then(() => {

      return [HttpStatus.OK, "OK", null];
    }).catch(() => {

      return [HttpStatus.BAD_REQUEST, "加入資料庫失敗", null];
    });
  }


  //登入帳戶
  async login(data: any): Promise<[number, string, any]> {
    //驗證資料重複性
    let existUser = await this.usersRepository.find({ account: data.account });

    if (existUser.length == 0) {
      return [HttpStatus.BAD_REQUEST, "帳號未註冊", null];
    }

  
    if (AES.decrypt(AES.encrypt(data.password, this.privatekey).toString(), this.privatekey).toString() ===
      AES.decrypt(existUser[0].password, this.privatekey).toString()) {
      return [HttpStatus.OK, "登入成功", null];
    } else {
      return [HttpStatus.BAD_REQUEST, "密碼錯誤", null];
    }

  }

}