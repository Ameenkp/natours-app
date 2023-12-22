import { Request, Response, NextFunction } from 'express';
import { Tour } from '../model/Tour';
import { User } from '../model/userModel';

export class CommonMiddleware {
  checkId(
    req: Request,
    res: Response,
    next: NextFunction,
    data: Tour[] | User[],
    paramName: string,
    val: string
  ) {
    console.log(`${paramName} id : `, val);

    if (!data.find((el) => el._id === val)) {
      return res.status(404).json({
        status: 'failed',
        message: `Invalid ${paramName} ID`,
      });
    }
    return next();
  }
}
