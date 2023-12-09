import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChecklistService } from './checklist.service';
import { ChecklistItem } from './checklist-item.entity';
import {
  ChecklistItemInput,
  PaginationInput,
  ChecklistItemResponse,
} from './dtos';

@Resolver(() => ChecklistItem)
export class ChecklistResolver {
  constructor(private checklistService: ChecklistService) {}

  @Query(() => [ChecklistItem], { nullable: true })
  async getChecklistByWeek(
    @Args('weekNumber', { type: () => Int }) weekNumber: number,
  ) {
    return this.checklistService.findByWeekNumber(weekNumber);
  }

  @Query(() => ChecklistItemResponse, { nullable: true })
  async getChecklists(
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.checklistService.findAll(paginationInput);
  }

  @Mutation(() => ChecklistItem)
  async addChecklistItem(@Args('itemInput') itemInput: ChecklistItemInput) {
    return this.checklistService.create(itemInput);
  }

  @Mutation(() => ChecklistItem)
  async updateChecklistItem(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateInput') updateInput: ChecklistItemInput,
  ) {
    return this.checklistService.update(id, updateInput);
  }

  @Mutation(() => Boolean)
  async deleteChecklistItem(@Args('id', { type: () => Int }) id: number) {
    return this.checklistService.delete(id);
  }

  @Mutation(() => ChecklistItem)
  async restoreChecklistItem(@Args('id', { type: () => Int }) id: number) {
    return this.checklistService.restore(id);
  }
}
