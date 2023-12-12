import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserInput } from '../types/update-user-input.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async findOne(seq: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({ where: { seq } });
    if (user) {
      user.pregnancyWeek = this.calculatePregnancyWeek(user.dueDate);
    }
    return user;
  }

  async updateUser(seq: number, updateData: UpdateUserInput) {
    await this.usersRepository.update({ seq }, updateData);
    return this.findOne(seq);
  }

  private calculatePregnancyWeek(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffInDays = Math.floor(
      (due.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );
    const weeks = Math.floor(diffInDays / 7);
    return 40 - weeks; // 가정: 임신 기간은 총 40주
  }
}
