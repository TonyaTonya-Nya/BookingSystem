import { Injectable } from '@nestjs/common';
import { UsersService } from '../DataBase/userDB/users.service';
import { JwtService } from '@nestjs/jwt';
import { AES } from 'crypto-ts';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, 
                private readonly jwtService: JwtService) {}

  async validateUser(account: string, password: string): Promise<any> {
    console.log('JWT驗證step2: 校驗用戶訊息');
    const user = await this.usersService.findOneByAccount(account);
    if (user) {
      console.log('有用戶');
      const hashedPassword = user.password;
      const hashPassword = AES.encrypt(password, 'privatekey').toString()
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 1,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null,
        };
      }
    }
    console.log('無用戶');
    // 查无此人
    return {
      code: 3,
      user: null,
    };
  }

  async certificate(user: any) {
    const payload = { account: user.account, id: user.id};
    console.log('JWT驗證step3: 處理 jwt 簽證');
    try {
      const token = this.jwtService.sign(payload);
      console.log('token generate successfully.');
      return {
        code: 200,
        data: {
          token,
        },
        msg: '登錄成功',
      };
    } catch (error) {
      return {
        code: 600,
        msg: '帳號或密碼錯誤',
      };
    }
  }
}
