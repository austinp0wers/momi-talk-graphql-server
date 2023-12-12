import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserChecklist } from '../user/entities/user-checklist.entity';

@ObjectType()
@Entity()
export class ChecklistItem {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  weekNumber: number;

  @Column()
  @Field()
  content: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isCompleted: boolean;

  @OneToMany(
    () => UserChecklist,
    (userChecklist) => userChecklist.checklistItem,
  )
  userChecklists: UserChecklist[];

  @Column({ default: false })
  @Field(() => Boolean)
  isDeleted: boolean;
}
