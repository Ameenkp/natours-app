import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { CommonMiddleware } from '../middlewear/baseMiddleware';
import {
  createUser,
  getAllUser,
  getAllUserWithFilter,
  testAggregate,
  User,
} from '../model/userModel';

export class UserController {
  private userDataPath: string = path.join(__dirname, '../../dev-data/data/users.json');

  private userData: User[];

  private commonMiddleware: CommonMiddleware;

  constructor() {
    this.userData = JSON.parse(fs.readFileSync(this.userDataPath, 'utf-8'));
    this.commonMiddleware = new CommonMiddleware();
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: Partial<User> = req.body;
      const createdUser = await createUser(userData);
      res.status(201).json({
        status: 'success',
        data: {
          user: createdUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allUsers = await getAllUser();
      res.status(200).json({
        status: 'success',
        results: allUsers.length,
        data: {
          users: allUsers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUserWithFilter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allUsers = await getAllUserWithFilter(req.query);
      res.status(200).json({
        status: 'success',
        results: allUsers.length,
        data: {
          users: allUsers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async testAggregateForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allUsers = await testAggregate();
      res.status(200).json({
        status: 'success',
        data: {
          users: allUsers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  checkId(req: Request, res: Response, next: NextFunction, val: string): void {
    this.commonMiddleware.checkId(req, res, next, this.userData, 'user', val);
  }

  getUserById(req: Request, res: Response, next: NextFunction): void {
    const user = this.userData.find((el) => el._id === req.params.id);
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
