import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserChecklist } from './user-checklist.entity';

@ObjectType()
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  seq: number;

  @Column()
  @Field()
  nickname: string;

  @Column()
  @Field()
  dueDate: string;

  @Field(() => Int, { nullable: true })
  pregnancyWeek?: number;

  @OneToMany(() => UserChecklist, (userChecklist) => userChecklist.user)
  userChecklists: UserChecklist[];
}
