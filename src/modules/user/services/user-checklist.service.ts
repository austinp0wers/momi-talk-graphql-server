import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserChecklist } from '../entities/user-checklist.entity';
import { UserEntity } from '../entities/user.entity';
import { ChecklistItem } from 'src/modules/checklist/checklist-item.entity';
import { ChecklistService } from 'src/modules/checklist/checklist.service';

@Injectable()
export class UserChecklistService {
  constructor(
    @InjectRepository(UserChecklist)
    private userChecklistRepository: Repository<UserChecklist>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private checkListService: ChecklistService,
  ) {}

  async toggleCompletion(
    userId: number,
    checklistItemId: number,
  ): Promise<UserChecklist> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const checklistItem =
      await this.checkListService.findCheckListItemById(checklistItemId);
    if (!user || !checklistItem) {
      throw new NotFoundException('User or Checklist Item not found');
    }

    let userChecklist = await this.userChecklistRepository.findOne({
      where: { user, checklistItem },
      relations: ['checklistItem'],
    });

    if (!userChecklist) {
      userChecklist = this.userChecklistRepository.create({
        user,
        checklistItem,
        isCompleted: false,
      });
    }

    userChecklist.isCompleted = !userChecklist.isCompleted;
    await this.userChecklistRepository.save(userChecklist);

    return userChecklist;
  }
}
