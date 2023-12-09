import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChecklistItemInput {
  @Field(() => Int, { nullable: true })
  weekNumber?: number;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;
}
