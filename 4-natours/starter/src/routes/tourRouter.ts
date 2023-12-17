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
    this.router
      .route('/')
      .get((req, res, next) => {
        TourController.getAllTours(req, res, next);
      })
      .post(async (req, res, next) => {
        try {
          await TourController.createTour(req, res, next);
        } catch (error) {
          next(error);
        }
      });

    this.router.route('/get-all-with-filter').get(async (req, res, next) => {
      try {
        await this.tourController.getAllToursWithFilter(req, res, next);
      } catch (error) {
        next(error);
      }
    });
    this.router.route('/add-data').get(async (req, res, next) => {
      await this.tourController.addTourDataFromJson(req, res, next);
    });

    this.router
      .route('/:id')
      .get((req, res, next) => TourController.getTourById(req, res, next))
      .patch(async (req, res, next) => {
        await this.tourController.updateTourById(req, res, next);
      })
      .delete(async (req, res, next) => {
        await this.tourController.deleteTourById(req, res, next);
      });
  }

  public getRouter(): Router {
    return this.router;
  }
}
