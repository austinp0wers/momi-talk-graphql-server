import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistItemInput, PaginationInput } from './dtos';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistItem)
    private checklistRepository: Repository<ChecklistItem>,
  ) {}

  async findCheckListItemById(checklistItemId: number) {
    return await this.checklistRepository.findOne({
      where: { id: checklistItemId },
    });
  }

  async findByWeekNumber(weekNumber: number): Promise<ChecklistItem[]> {
    return this.checklistRepository.find({ where: { weekNumber } });
  }

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<{ checklistItem: ChecklistItem[]; total: number }> {
    const { page, limit } = paginationInput;
    const [result, total] = await this.checklistRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { checklistItem: result, total };
  }

  async create(itemInput: ChecklistItemInput): Promise<ChecklistItem> {
    const newItem = this.checklistRepository.create(itemInput);
    await this.checklistRepository.save(newItem);
    return newItem;
  }

  async update(
    id: number,
    updateInput: ChecklistItemInput,
  ): Promise<ChecklistItem> {
    const item = await this.checklistRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Checklist item with ID ${id} not found`);
    }
    Object.assign(item, updateInput);
    await this.checklistRepository.save(item);
    return item;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.checklistRepository.update(
      { id },
      { isDeleted: true },
    );
    return result.affected > 0;
  }

  async restore(id: number): Promise<ChecklistItem> {
    const item = await this.checklistRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Checklist item with ID ${id} not found`);
    }

    item.isDeleted = false;
    await this.checklistRepository.save(item);
    return item;
  }
}
