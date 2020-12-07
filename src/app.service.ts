import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {

  private user: string = 'as61002@gmail.com';
  private clientId: string = '585350057651-vbe2cckmlj50iub4cccanj0sh7ocfdl0.apps.googleusercontent.com';
  private clientSecret: string = 'pCRPShd-LVkT7Cb9OCDJURPQ';
  private refreshToken: string = '1//04H-yy6ILnUSpCgYIARAAGAQSNwF-L9IrMvrdCCKtpzy9yCgp2-7Y2Jjt3RxqMvg3wocGefIoYnLvkLtGiVmA_dDYT8ru_DgYdxA';

  private mailFromInfo: string = '"(不要回覆此郵件)" <virtualreservationassistant@gmail.com>'

  private nodemailer = require('nodemailer');
  private mailTransport = this.nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: this.user,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      refreshToken: this.refreshToken,
    }
  });

  // 寄送郵件
  async sned(data: any): Promise<[number, string, any]> {
    //驗證資料存在性
    if (Object.keys(data).length === 0) {
      return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
    }
    
    const mailOptions = {
      from: this.mailFromInfo,
      to: data.receivers,
      subject: data.subject,
      text: data.text
    }
    this.mailTransport.sendMail(mailOptions);
    return [HttpStatus.CREATED, "OK", null];
  }

  getHello(): string {
    return 'Hello ';
  }
}
