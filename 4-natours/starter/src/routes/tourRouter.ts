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
    this.router.route('/top-5-cheap').get(
      (req, res, next) => {
        this.tourController.aliasTopTours(req, res, next);
      },
      async (req, res, next) => {
        try {
          await this.tourController.getAllToursWithFilter(req, res, next);
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.route('/test-stats').get(async (req, res, next) => {
      await TourController.testTourStats(req, res, next);
    });

    this.router.route('/monthly-plan/:year').get(async (req, res, next) => {
      await TourController.showMonthlyPlan(req, res, next);
    });

    this.router
      .route('/')
      .get(async (req, res, next) => {
        await TourController.getAllTours(req, res, next);
      })
      .post(async (req, res, next) => {
        try {
          await TourController.createTour(req, res, next);
        } catch (error) {
          next(error);
        }
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
