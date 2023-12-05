import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import User from '../model/User';
import { CommonMiddleware } from '../middlewear/baseMiddleware';

export class UserController {
  private userDataPath: string = path.join(__dirname, '../../dev-data/data/users.json');
  private userData: User[];
  private commonMiddleware: CommonMiddleware;

  constructor() {
    this.userData = JSON.parse(fs.readFileSync(this.userDataPath, 'utf-8'));
    this.commonMiddleware = new CommonMiddleware();
  }

  checkId(req: Request, res: Response, next: NextFunction, val: string): void {
    this.commonMiddleware.checkId(req, res, next, this.userData, 'user', val);
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
