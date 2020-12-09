import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { json } from 'sequelize';
import { Event } from './DataBase/MeetingEvent/events.entity';
import { EventsService } from './DataBase/MeetingEvent/events.service';
import { Eventparner } from './DataBase/MeetPeople/eventparners.entity';
import { EventparnersService } from './DataBase/MeetPeople/eventparners.service';

@Injectable()
export class AppService {

  private user: string = 'as61002@gmail.com';
  private clientId: string = '585350057651-vbe2cckmlj50iub4cccanj0sh7ocfdl0.apps.googleusercontent.com';
  private clientSecret: string = 'pCRPShd-LVkT7Cb9OCDJURPQ';
  private refreshToken: string = '1//04NIOlkXUzsb2CgYIARAAGAQSNwF-L9IrdE5kdv_C5W6BHwrU62w8Kh9sc0Nfks5jX6GZp8XMBkwdjnEUU7YIplujBOlB_jgJykA';

  private mailFromInfo: string = '"(不要回覆此郵件)" <virtualreservationassistant@gmail.com>'

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
    @InjectRepository(Eventparner)
    private eventparnersService: EventparnersService,
    @InjectRepository(Event)
    private eventService: EventsService,
  ) { }

  // 寄送郵件
  async sendMail(data: any): Promise<[number, string, any]> {
    //驗證資料存在性
    if (Object.keys(data).length === 0) {
      return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
    }

    const parners = await this.eventparnersService.find(data.meetid);
    const receivers = []
    for (let i = 0; i < parners.length; i++) {
      receivers.push(parners[i].peopleMail);
    }

    const mailOptions = {
      from: this.mailFromInfo,
      to: receivers,
      subject: data.subject,
      text: data.text,
    }

    this.mailTransport.sendMail(mailOptions);
    return [HttpStatus.CREATED, "OK", null];
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

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    const eventStartTime = new Date();
    eventStartTime.setTime(meetingEvent.start_t);
    const eventEndTime = new Date();
    eventEndTime.setTime(meetingEvent.end_t);
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
          return [HttpStatus.CREATED, "OK", null];
        })
      }
      console.log('Sorry I\'m busy')
      return [HttpStatus.BAD_REQUEST, "Error.", undefined];
    })
    return [HttpStatus.CREATED, "OK", null];
  }

  getHello(): string {
    return 'Hello ';
  }
}
