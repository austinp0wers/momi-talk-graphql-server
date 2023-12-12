import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChecklistItem } from 'src/modules/checklist/checklist-item.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class UserChecklist {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.userChecklists)
  @Field((type) => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;

  @ManyToOne(
    () => ChecklistItem,
    (checklistItem) => checklistItem.userChecklists,
  )
  @Field((type) => ChecklistItem)
  @JoinColumn({ name: 'checklistItemId' })
  checklistItem: ChecklistItem;

  @Column()
  checklistItemId: number;
  @Column({ default: false })
  @Field()
  isCompleted: boolean;
}
