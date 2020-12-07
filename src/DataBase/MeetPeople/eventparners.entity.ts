import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {IsInt, IsEmail} from "validator.ts/decorator/Validation";

@Entity()
export class Eventparner {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsInt()
  meetid: number;

  @Column()
  @IsEmail()
  peopleMail: string;

}