import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { clearConfigCache } from 'prettier';
import { Repository, Between } from 'typeorm';
import { Event } from './events.entity';
import { Validator } from "validator.ts/Validator";
import { EventparnersService } from '../MeetPeople/eventparners.service';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/Auth/auth.service';
import { streetviewpublish } from 'googleapis/build/src/apis/streetviewpublish';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
        private readonly eventparnersService: EventparnersService,
        private readonly authService: AuthService,
        // private readonly appService: AppService
    ) { }

    findAll(): Promise<Event[]> {
        return this.eventsRepository.find();
    }

    findOne(id: string): Promise<Event> {
        return this.eventsRepository.findOne(id);
    }

    async find(meetid: string): Promise<any> {


        let res = await this.eventsRepository.findOne(meetid);
        console.log(res);


        res.member = await this.eventparnersService.find(res.id.toString());


        return [HttpStatus.OK, "OK", res];
    }


    async findByDate(date: string): Promise<any> {
        //驗證資料存在性
        if (Object.keys(date).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }
        let day = new Date();
        day.setTime(Date.parse(date));
        let dayEnd = new Date();
        dayEnd.setTime(Date.parse(date));
        dayEnd.setSeconds(day.getSeconds() + 86400 - 1);
        console.log(+day.valueOf());
        console.log(+dayEnd.valueOf());
        let res = await this.eventsRepository.find({ date: Between(+day.valueOf(), +dayEnd.valueOf()) })
        console.log(res.length);
        for (let i = 0; i < res.length; i++) {

            res[i].member = await this.eventparnersService.find(res[i].id.toString());
        }

        return [HttpStatus.OK, "OK", res];
    }

    async findByMail(mail: string): Promise<any> {
        //驗證資料存在性
        if (Object.keys(mail).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }
        let datas = [];
        let hostData = await this.eventsRepository.find({ host: mail });
        for (let i = 0; i < hostData.length; i++) {
            // 若日期已過則不回傳
            if (hostData[i].date < Date.now()) {
                continue;
            }
            let parners = await this.eventparnersService.find(hostData[i].id.toString());
            let parnersMails = [];
            for (let p = 0; p < parners.length; p++) {
                parnersMails.push(parners[p].peopleMail);
            }
            datas.push({
                "id": hostData[i].id,
                "roomid": hostData[i].roomId,
                "eventName": hostData[i].eventName,
                "description": hostData[i].description,
                "start_t": hostData[i].start_t,
                "end_t": hostData[i].end_t,
                "date": hostData[i].date,
                "members": parnersMails
            })
        }
        let joinData = await this.eventparnersService.findByMail(mail);
        for (let i = 0; i < joinData.length; i++) {
            const event = await this.eventsRepository.findOne(joinData[i].meetid);
            if (event === undefined) {
                continue;
            }
            // 若日期已過則不回傳
            if (event.date < Date.now()) {
                continue;
            }
            let parners = await this.eventparnersService.find(event.id.toString());
            let parnersMails = [];
            for (let p = 0; p < parners.length; p++) {
                parnersMails.push(parners[p].peopleMail);
            }
            datas.push({
                "id": event.id,
                "roomid": event.roomId,
                "eventName": event.eventName,
                "description": event.description,
                "start_t": event.start_t,
                "end_t": event.end_t,
                "date": event.date,
                "members": parnersMails
            })
        }
        return [HttpStatus.OK, "OK", datas];
        // let module:EventparnersModule ;
        // module.
        // EventparnersModule.
        //  return await this.eventsRepository.find({ host: mail })
    }

    async remove(id: string): Promise<void> {
        await this.eventsRepository.delete(id);
    }

    async update(data: any, req: any): Promise<[number, string, any]> {
        //驗證資料存在性
        if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }

        let existData = await this.eventsRepository.findOne({ id: data.meetid });

        // 驗證是否為創始者
        const payload = await this.authService.decodeToken(req);
        if (existData.host !== undefined && existData.host !== payload.mail) {
            return [HttpStatus.UNAUTHORIZED, "不是會議創始者", null];
        }

        existData.description = data.description;


        await this.eventsRepository.save(existData).then(() => {

            return [HttpStatus.OK, "OK", existData];
        }).catch(() => {

            return [HttpStatus.BAD_REQUEST, "加入資料庫失敗", null];
        });

        return [HttpStatus.OK, "OK", existData];
    }

    async create(data: any, req: any): Promise<[number, string, any]> {


        //驗證資料存在性
        if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }

        let event = new Event();
        event.eventName = data.eventName;
        event.roomId = +data.roomId;
        event.start_t = +data.start_t;
        event.end_t = +data.end_t;
        event.description = data.description;
        const payload = await this.authService.decodeToken(req);
        event.host = payload.mail;
        let date = new Date(Date.parse(data.date));
        event.date = date.valueOf();
        // event.isCencel = false;

        // event.start_t = s_time.valueOf();
        // let e_time = new Date(Date.parse(data.end_t));
        // event.end_t = e_time.valueOf();




        try {
            //驗證資料正確性
            let validator = new Validator();
            let errors = validator.validate(event);

            if (errors.length != 0) {
                return [HttpStatus.BAD_REQUEST, "輸入資料有誤", errors];
            }
        } catch {

            return [HttpStatus.BAD_REQUEST, "輸入資料缺少", null];
        }

        //驗證是否已有會議
        /* let existUser = await this.eventsRepository.find({ account: data.account });
     
         if (existUser.length != 0) {
           return [HttpStatus.BAD_REQUEST, "帳號已存在", null];
         }*/



        await this.eventsRepository.save(event).then(() => {

            return [HttpStatus.OK, "OK", null];
        }).catch(() => {

            return [HttpStatus.BAD_REQUEST, "加入資料庫失敗", null];
        });


        let eventData = await this.eventsRepository.findOne(event)



        return [HttpStatus.OK, "OK", eventData];
    }

    async delete(data: any, req: any): Promise<[number, string, any]> {

        //驗證資料存在性
        if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }

        let existData = await this.eventsRepository.findOne({ id: data.id });

        // 驗證是否為創始者
        const payload = await this.authService.decodeToken(req);
        if (existData.host !== undefined && existData.host !== payload.mail) {
            return [HttpStatus.UNAUTHORIZED, "不是會議創始者", null];
        }

        let parners = await this.eventparnersService.find(data.id.toString());
        await this.eventsRepository.delete({ id: data.id }).then(() => {
            console.log('刪除會議');
            return [HttpStatus.OK, "OK", null];
        }).catch(() => {
            return [HttpStatus.BAD_REQUEST, "取消會議失敗", null];
        });
        
        for (let i = 0; i < parners.length; i++) {
            await this.eventparnersService.delete(data, req);
        }

        return [HttpStatus.OK, "OK", null];
    }

}
