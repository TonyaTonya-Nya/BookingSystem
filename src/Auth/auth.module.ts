import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../DataBase/userDB/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../DataBase/userDB/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from 'src/DataBase/userDB/users.controller';

@Module({
    imports: [
      PassportModule.register({ defaultStrategy: 'hostChecker' }),
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '8h' }, // token 过期时效
      }),
      UsersModule,
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
  })
export class AuthModule {}
