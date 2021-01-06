import { Injectable, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../DataBase/userDB/users.service';
import { JwtService } from '@nestjs/jwt';
import { AES } from 'crypto-ts';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../Auth/constants';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService) { }

  async validateUser(account: string, password: string): Promise<any> {
    console.log('JWT驗證step2: 校驗用戶訊息');
    const user = await this.usersService.findOneByAccount(account);
    if (user) {
      if (AES.decrypt(AES.encrypt(password, "privatekey").toString(), "privatekey").toString() ===
        AES.decrypt(user.password, "privatekey").toString()) {
        // 密碼正確
        return {
          code: 1,
          user,
        };
      } else {
        // 密碼錯誤
        return {
          code: 2,
          user: null,
        };
      }
    }
    // 無註冊帳號
    return {
      code: 3,
      user: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  async certificate(user: any) {
    const payload = { id: user.id, account: user.account, mail: user.mail };
    console.log('JWT驗證step3: 處理 jwt 簽證');
    try {
      const token = this.jwtService.sign(payload);
      console.log('token generate successfully.');
      return [HttpStatus.OK, {
        token: token,
        msg: '登入成功',
      }, null];
    } catch (error) {
      return [HttpStatus.BAD_REQUEST, "登入失敗", null];
    }
  }

  async decodeToken(req: any): Promise<any> {
    req.header("Access-Control-Allow-Origin","*");
    req.header("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");  
    req.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtConstants.secret);
    return decoded;
  }

}
