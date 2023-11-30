import express, { Router } from 'express';
import {
  createUser,
  deleteUserById,
  getAllUser,
  getUserById,
  updateUserById,
} from '../controller/userController';

const userRouter: Router = express.Router();

userRouter.route('/').get(getAllUser).post(createUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

export default userRouter;
