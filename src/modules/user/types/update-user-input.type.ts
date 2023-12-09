import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  dueDate?: string;
}
