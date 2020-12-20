import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eventparner } from './eventparners.entity';
import { Validator } from "validator.ts/Validator";

@Injectable()
export class EventparnersService {
    constructor(
        @InjectRepository(Eventparner)
        private eventparnersRepository: Repository<Eventparner>,
    ) { }

    findAll(): Promise<Eventparner[]> {
        return this.eventparnersRepository.find();
    }

    findOne(id: string): Promise<Eventparner> {
        return this.eventparnersRepository.findOne(id);
    }

    find(id: string): Promise<Eventparner[]> {
        return this.eventparnersRepository.find({ meetid: +id });
    }

    findByMail(mail: string): Promise<Eventparner[]> {
        return this.eventparnersRepository.find({ peopleMail: mail });
    }

    async remove(id: string): Promise<void> {
        await this.eventparnersRepository.delete(id);
    }

    async create(data: any): Promise<[number, string, any]> {


        //驗證資料存在性
        if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }

        let parner = new Eventparner();
        parner.meetid = data.meetid;
        parner.peopleMail = data.mail;

        try {
            //驗證資料正確性
            let validator = new Validator();
            let errors = validator.validate(parner);

            if (errors.length != 0) {
                return [HttpStatus.BAD_REQUEST, "輸入資料有誤", errors];
            }
        } catch {

            return [HttpStatus.BAD_REQUEST, "輸入資料缺少", null];
        }


        await this.eventparnersRepository.save(parner).then(() => {

            return [HttpStatus.OK, "OK", null];
        }).catch(() => {

            return [HttpStatus.BAD_REQUEST, "新增會議參與者失敗", parner];
        });



        return [HttpStatus.OK, "OK", null];
    }

    async delete(data: any): Promise<[number, string, any]> {

        //驗證資料存在性
        if (Object.keys(data).length === 0) {
            return [HttpStatus.BAD_REQUEST, "沒有輸入資料", null];
        }


        await this.eventparnersRepository.delete({ meetid: data.meetid, peopleMail: data.mail }).then(() => {

            return [HttpStatus.OK, "OK", null];
        }).catch(() => {

            return [HttpStatus.BAD_REQUEST, "取消會議失敗", null];
        });


        return [HttpStatus.OK, "OK", null];
    }
}
