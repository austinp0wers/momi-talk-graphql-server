import { CheckListModule } from './../checklist/checklist.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserResolver } from './user.resolver';
import { UserChecklistService } from './services/user-checklist.service';
import { UserChecklist } from './entities/user-checklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserChecklist]),
    CheckListModule,
  ],
  providers: [UserService, UserResolver, UserChecklistService],
  exports: [UserService, UserResolver, UserChecklistService],
})
export class UserModule {}
