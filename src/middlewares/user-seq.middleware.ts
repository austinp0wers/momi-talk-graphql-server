import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserSeqMiddleware implements NestMiddleware {
  use(req, res: Response, next: NextFunction) {
    const userSeq = req.headers['userseq'];

    if (!userSeq) {
      throw new BadRequestException('UserSeq header is missing');
    }

    if (isNaN(Number(userSeq))) {
      throw new BadRequestException('UserSeq is not a valid number');
    }

    req.userSeq = Number(userSeq);
    next();
  }
}
