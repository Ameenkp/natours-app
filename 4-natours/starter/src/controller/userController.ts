import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import User from '../model/User';

export class UserController {
  private readonly userDataPath: string = path.join(__dirname, '../../dev-data/data/users.json');
  private userData: User[];

  constructor() {
    console.log('UserController constructor executed');
    this.userData = JSON.parse(fs.readFileSync(this.userDataPath, 'utf-8'));
  }

  checkId(req: Request, res: Response, next: NextFunction, val: string): void {
    console.log('User id is: ', val);
    if (!this.userData.find((el) => el._id === val)) {
      res.status(404).json({
        status: 'failed',
        message: 'Invalid ID',
      });
    } else {
      next();
    }
  }

  getAllUser(req: Request, res: Response, next: NextFunction): void {
    try {
      res.status(200).json({
        status: 'success',
        results: this.userData.length,
        data: {
          users: this.userData,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  createUser(req: Request, res: Response, next: NextFunction): void {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    });
  }

  getUserById(req: Request, res: Response, next: NextFunction): void {
    const user = this.userData.find((user) => user._id === req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }

  updateUserById(req: Request, res: Response, next: NextFunction): void {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    });
  }

  deleteUserById(req: Request, res: Response, next: NextFunction): void {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!',
    });
  }
}
