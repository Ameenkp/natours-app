import express, { Router } from 'express';
import { TourController } from '../controller/tourController';

export class TourRouter {
  private readonly router: Router;

  private tourController: TourController;

  constructor() {
    this.router = express.Router();
    this.tourController = new TourController();
    this.config();
  }

  private config(): void {
    this.router.param('id', (req, res, next, val) => {
      this.tourController.checkId(req, res, next, val);
    });

    this.router
      .route('/')
      .get((req, res, next) => this.tourController.getAllTour(req, res, next))
      .post(async (req, res, next) => {
        try {
          this.tourController.validateTour(req, res, next);
          await this.tourController.createTour(req, res, next);
        } catch (error) {
          next(error);
        }
      });

    this.router
      .route('/:id')
      .get((req, res, next) => this.tourController.getTourById(req, res, next))
      .patch((req, res, next) => this.tourController.updateTourById(req, res, next))
      .delete((req, res, next) => this.tourController.deleteTourById(req, res, next));
  }

  public getRouter(): Router {
    return this.router;
  }
}
