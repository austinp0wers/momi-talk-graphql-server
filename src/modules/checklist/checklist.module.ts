import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistService } from './checklist.service';
import { ChecklistResolver } from './checklist.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItem])],
  providers: [ChecklistService, ChecklistResolver],
  exports: [ChecklistService, ChecklistResolver],
})
export class CheckListModule {}
