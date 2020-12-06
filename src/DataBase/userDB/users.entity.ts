import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {IsLength, IsEmail} from "validator.ts/decorator/Validation";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

 
  @Column()
  @IsLength(1, 255)
  account: string;

 
  @Column()
  @IsLength(1, 255)
  password: string;

 
  @Column()
  @IsEmail()
  mail: string;
}