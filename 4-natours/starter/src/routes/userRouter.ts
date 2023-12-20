import express, { Router } from 'express';
import { UserController } from '../controller/userController';

export class UserRouter {
  private readonly router: Router;

  private userController: UserController;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.config();
  }

  private config(): void {
    this.router.route('/test-aggregate').get(async (req, res, next) => {
      await this.userController.testAggregateForUser(req, res, next);
    });
    this.router
      .route('/')
      .get(async (req, res, next) => {
        try {
          await this.userController.getAllUserWithFilter(req, res, next);
        } catch (error) {
          next(error);
        }
      })
      .post(async (req, res, next) => {
        await this.userController.createUser(req, res, next);
      });

    this.router
      .route('/:id')
      .get((req, res, next) => this.userController.getUserById(req, res, next))
      .patch((req, res, next) => this.userController.updateUserById(req, res, next))
      .delete((req, res, next) => this.userController.deleteUserById(req, res, next));
  }

  public getRouter(): Router {
    return this.router;
  }
}
