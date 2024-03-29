import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {IsLength,IsInt,IsEmail} from "validator.ts/decorator/Validation";

@Entity()
export class Event {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsLength(1, 255)
  eventName: string;

  @Column()
  @IsInt()
  roomId: number;

  @Column()
  @IsLength(1, 255)
  description: string;

  @Column()
  @IsInt()
  start_t: number;

  @Column()
  @IsInt()
  end_t: number;

  @Column()
  @IsInt()
  date: number;

  @Column()
  @IsEmail()
  host: string;


  member:any;
}