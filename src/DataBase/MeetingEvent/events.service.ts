import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './events.entity';

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

    async remove(id: string): Promise<void> {
        await this.eventsRepository.delete(id);
    }

    async create(): Promise<Event> {
        let e=new Event;
        e.start_t='2000-01-02';
        e.end_t='2000-01-04';
        e.description='NO';
        e.eventName='event';
        e.isCencel=false;
        e.roomId=1;
        e.id=1;
        
        return await this.eventsRepository.create(e);
    }

   /* async create(): Promise<void> {


        await this.eventsRepository.create(

            { id:1,eventName: 'Meet', roomId: 1, description: "無", start_t: "2000-08-02", end_t: "2000-08-03", isCencel: false },

        );
    }*/

}
export interface IUsers {
    readonly ID: number;
    readonly Name: string;
    readonly Age: number;
}