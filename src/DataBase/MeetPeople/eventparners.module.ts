import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventparnersService } from './eventparners.service';
import { EventparnersController } from './eventparners.controller';
import { Eventparner } from './eventparners.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Eventparner])],
  providers: [EventparnersService],
  controllers: [EventparnersController],
  exports: [TypeOrmModule,EventparnersService]
})
export class EventparnersModule {}