import express, { Router } from 'express';
import {
  createTour,
  deleteTourById,
  getAllTour,
  getTourById,
  updateTourById,
  checkId,
} from '../controller/tourController';

const tourRouter: Router = express.Router();

tourRouter.param('id', checkId);

tourRouter
  .route('/')
  .get(getAllTour)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

export default tourRouter;
