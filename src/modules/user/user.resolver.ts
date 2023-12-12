import { UserChecklistService } from './services/user-checklist.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  GqlExecutionContext,
  Int,
} from '@nestjs/graphql';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserInput } from './types/update-user-input.type';
import { UserChecklist } from './entities/user-checklist.entity';

@Resolver((of) => UserEntity)
export class UserResolver {
  constructor(
    private userService: UserService,
    private userChecklistService: UserChecklistService,
  ) {}

  @Query(() => UserEntity, { nullable: true })
  async getUser(@Context() context) {
    const request = context.req as Request & { userSeq: number };
    const userSeq = request.userSeq;

    return this.userService.findOne(userSeq);
  }

  @Mutation(() => UserEntity)
  async updateUser(
    @Context() context,
    @Args('updateData') updateData: UpdateUserInput,
  ): Promise<UserEntity> {
    const request = context.req as Request & { userSeq: number };
    const userSeq = request.userSeq;
    return this.userService.updateUser(userSeq, updateData);
  }

  @Mutation(() => UserChecklist)
  async toggleUserChecklistItemCompletion(
    @Context() context,
    @Args('checklistItemId', { type: () => Int }) checklistItemId: number,
  ): Promise<UserChecklist> {
    const request = context.req as Request & { userSeq: number };
    const userSeq = request.userSeq;

    return this.userChecklistService.toggleCompletion(userSeq, checklistItemId);
  }
}
