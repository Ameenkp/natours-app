import express, { Router } from 'express';
import { UserController } from '../controller/userController';

class UserRouter {
  private readonly router: Router;
  private userController: UserController;

  constructor() {
    console.log('UserRouter constructor executed');
    this.router = express.Router();
    this.userController = new UserController();
    this.config();
  }

  private config(): void {
    this.router.param('id', (req, res, next, val) => {
      this.userController.checkId(req, res, next, val);
    });

    this.router
      .route('/')
      .get((req, res, next) => this.userController.getAllUser(req, res, next))
      .post((req, res, next) => this.userController.createUser(req, res, next));

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

export default new UserRouter().getRouter();
