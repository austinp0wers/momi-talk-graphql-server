import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ChecklistItem } from '../checklist-item.entity';

@ObjectType()
export class ChecklistItemResponse {
  @Field(() => [ChecklistItem])
  checklistItem: ChecklistItem[];

  @Field(() => Int)
  total: number;
}
