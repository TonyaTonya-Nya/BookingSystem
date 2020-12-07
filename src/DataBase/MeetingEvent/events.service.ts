import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { clearConfigCache } from 'prettier';
import { Repository, Between } from 'typeorm';
import { Event } from './events.entity';
import { Validator } from "validator.ts/Validator";


@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) { }

    findAll(): Promise<Event[]> {
        return this.eventsRepository.find();
    }

    findOne(id: string): Promise<Event> {
        return this.eventsRepository.findOne(id);
    }

    async findByDate(date: string): Promise<Event[]> {

        let day = new Date(Date.parse(date));
        console.log(await this.eventsRepository.find({ start_t: Between(+day.valueOf(), +(day.valueOf() + 86400000)) }))
        return await this.eventsRepository.find({ start_t: Between(+day.valueOf(), +(day.valueOf() + 86400000)) })
    }

    async remove(id: string): Promise<void> {
        await this.eventsRepository.delete(id);
    }

    async create(data: any): Promise<[number, string, any]> {


        //驗證資料存在性
        if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }

        let event = new Event();
        event.eventName = data.eventName;
        event.roomId = +data.roomId;
        let s_time = new Date(Date.parse(data.start_t));
        event.start_t = s_time.valueOf();
        let e_time = new Date(Date.parse(data.end_t));
        event.end_t = e_time.valueOf();
        
        event.description = data.description;
        event.isCencel=false;


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


       let eventData=await this.eventsRepository.findOne(event)
     


        return [HttpStatus.OK, "OK", eventData];
    }





    async delete(data: any): Promise<[number, string, any]> {

         //驗證資料存在性
         if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }


        await this.eventsRepository.delete({id:data.id}).then(() => {

            return [HttpStatus.OK, "OK", null];
        }).catch(() => {

            return [HttpStatus.BAD_REQUEST, "取消會議失敗", null];
        });


        return [HttpStatus.OK, "OK", null];
    }

}
export interface IUsers {
    readonly ID: number;
    readonly Name: string;
    readonly Age: number;
}