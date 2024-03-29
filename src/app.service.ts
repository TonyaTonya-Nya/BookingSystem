import { Body, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleApis } from 'googleapis';
import { stringify } from 'querystring';
import { json } from 'sequelize';
import { AuthService } from './Auth/auth.service';
import { Event } from './DataBase/MeetingEvent/events.entity';
import { EventsService } from './DataBase/MeetingEvent/events.service';
import { Eventparner } from './DataBase/MeetPeople/eventparners.entity';
import { EventparnersService } from './DataBase/MeetPeople/eventparners.service';

@Injectable()
export class AppService {

  private user = 'as61002@gmail.com';
  private clientId = '585350057651-vbe2cckmlj50iub4cccanj0sh7ocfdl0.apps.googleusercontent.com';
  private clientSecret = 'pCRPShd-LVkT7Cb9OCDJURPQ';
  private refreshToken = '1//04mxhXs-W0XgdCgYIARAAGAQSNwF-L9Ir9JDxM77rd-8X59REKePeMWXPTgcSIXoFLF9VotXtxYnA70hGsVcdNS7PO0flWsc-Z4Q';

  private mailFromInfo = '"(不要回覆此郵件)" <virtualreservationassistant@gmail.com>'

  private nodemailer = require('nodemailer');
  private auth = {
    type: 'OAuth2',
    user: this.user,
    clientId: this.clientId,
    clientSecret: this.clientSecret,
    refreshToken: this.refreshToken,
  };
  private mailTransport = this.nodemailer.createTransport({
    service: 'Gmail',
    auth: this.auth
  });

  constructor(
    // @InjectRepository(Eventparner)
    private eventparnersService: EventparnersService,
    // @InjectRepository(Event)
    private eventService: EventsService,
    private authService: AuthService
  ) { }

  // 寄送郵件
  async sendMail(data: any, req: any): Promise<[number, string, any]> {
    //驗證資料存在性
    if (Object.keys(data).length === 0) {
      return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
    }


    let existData = await this.eventService.findOne(data.meetid);

    // 驗證是否為創始者
    const payload = await this.authService.decodeToken(req);
    if (existData.host !== undefined && existData.host !== payload.mail) {
      return [HttpStatus.UNAUTHORIZED, "不是會議創始者", null];
    }

    const parners = await this.eventparnersService.find(data.meetid.toString());

    const receivers = []
    for (let i = 0; i < parners.length; i++) {
      receivers.push(parners[i].peopleMail);
      console.log(receivers[i]);
    }
    receivers.push(existData.host);
    console.log(receivers[receivers.length - 1]);
    const date = new Date();
    date.setTime(existData.date);
    console.log(data);
    if (data.isCancel === 'false') {
      console.log("新增會議");
      const content = "Time: " + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() +
        " " + existData.start_t + ":00 ~ " + (existData.start_t + 1) + ":00\n" +
        "Location: TR" + existData.roomId + "\n" + existData.description;
      const mailOptions = {
        from: this.mailFromInfo,
        to: receivers,
        subject: "你已收到會議邀請: " + existData.eventName,
        text: content,
      }
      this.mailTransport.sendMail(mailOptions);
    } else {
      const mailOptions = {
        from: this.mailFromInfo,
        to: receivers,
        subject: "會議已取消: " + existData.eventName,
        text: "會議 " +  existData.eventName + " 已被" + existData.host + " 取消。",
      }
      this.mailTransport.sendMail(mailOptions);
    }
    return [HttpStatus.OK, "OK", null];
  }

  // 寄送日曆事件
  async sendCalendar(data: any): Promise<[number, string, any]> {

    //驗證資料存在性
    if (Object.keys(data).length === 0) {
      return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
    }

    const { google } = require('googleapis');
    const { OAuth2 } = google.auth;
    const oAuth2Client = new OAuth2(
      this.clientId,
      this.clientSecret
    )

    oAuth2Client.setCredentials({
      refresh_token: this.refreshToken
    })

    const meetingEvent = await this.eventService.findOne(data.meetid);
    const parners = await this.eventparnersService.find(data.meetid);
    const receivers = []
    for (let i = 0; i < parners.length; i++) {
      receivers.push(parners[i].peopleMail);
    }
    receivers.push(meetingEvent.host);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    const eventStartTime = new Date();
    eventStartTime.setTime(meetingEvent.date);
    eventStartTime.setHours(meetingEvent.start_t)
    // eventStartTime.setTime(meetingEvent.start_t);
    const eventEndTime = new Date();
    console.log(meetingEvent);
    eventEndTime.setTime(meetingEvent.date);
    eventEndTime.setHours(meetingEvent.end_t);
    const event = {
      summary: meetingEvent.eventName,
      location: meetingEvent.roomId,
      description: meetingEvent.description,
      start: {
        dateTime: eventStartTime.toISOString(),
        timeZone: 'Asia/Taipei'
      },
      end: {
        dateTime: eventEndTime.toISOString(),
        timeZone: 'Asia/Taipei'
      },
      colorId: 1,
      attendees: [
        {
          email: receivers,
          organizer: false,
          responseStatus: 'needsAction'
        }
      ],
    }

    calendar.freebusy.query({
      resource: {
        timeMin: eventStartTime.toISOString(),
        timeMax: eventEndTime.toISOString(),
        timeZone: 'Asia/Taipei',
        items: [{ id: 'primary' }],
      },
    }, (err, res) => {
      if (err) {
        console.error('Free Busy Query Error: ', err);
        return [HttpStatus.BAD_REQUEST, "Free Busy Query Error: ", err];
      }
      const eventsArray = res.data.calendars.primary.Busy
      if (eventsArray === undefined) {
        return calendar.events.insert({
          calendarId: 'primary',
          resource: event
        }, err => {
          if (err) {
            console.error('Calendar Event Creation Error:', err);
            return [HttpStatus.BAD_REQUEST, "Calendar Event Creation Error: ", err];
          }
          return [HttpStatus.OK, "OK", null];
        })
      }
      console.log('Sorry I\'m busy')
      return [HttpStatus.BAD_REQUEST, "Error.", undefined];
    })
    return [HttpStatus.OK, "OK", null];
  }

  getHello(): string {
    return 'Hello ?';
  }
}
