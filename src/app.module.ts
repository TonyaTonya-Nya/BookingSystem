import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './DataBase/MeetingEvent/events.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    EventsModule,
  ],
    
  controllers: [AppController,CatsController],
  providers: [AppService],
})
export class AppModule {}
