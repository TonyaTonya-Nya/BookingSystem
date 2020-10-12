import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Event {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventName: string;

  @Column()
  roomId: number;

  @Column()
  description: string;

  @Column()
  start_t: string;

  @Column()
  end_t: string;

  @Column({ default: false })
  isCencel: boolean;
}