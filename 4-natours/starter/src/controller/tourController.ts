import { NextFunction, Request, Response } from 'express';
import { Tour, TourDocument } from '../model/tourModel';

export class TourController {
  static async getAllTours(req: Request, res: Response, next: NextFunction) {
    try {
      const allTours = await Tour.getAllTours();
      if (allTours.length === 0) {
        return res.status(404).json({ status: 404, message: 'No tours found' });
      }
      return res.status(200).json({ status: 'success', results: allTours.length, data: allTours });
    } catch (error) {
      return next(error);
    }
  }

  async getAllToursWithFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const allTours = await Tour.getAllToursWithFilter(req.query);
      if (allTours.length === 0) {
        return res.status(404).json({ status: 404, message: 'No tours found' });
      }
      return res.status(200).json({ status: 'success', results: allTours.length, data: allTours });
    } catch (error) {
      return next(error);
    }
  }

  static async createTour(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newTourData: Partial<TourDocument> = req.body;
      const createdTour = await Tour.createTour(newTourData);
      res.status(201).json({ status: 'success', data: createdTour });
    } catch (error) {
      next(error);
    }
  }

  static async getTourById(req: Request, res: Response, next: NextFunction) {
    const tourId = req.params.id;
    try {
      const foundTour = await Tour.getTourById(tourId);
      if (!foundTour) {
        return res.status(404).json({ status: 404, message: 'No tour found' });
      }
      return res.status(200).json({ data: foundTour });
    } catch (error) {
      return next(error);
    }
  }

  async updateTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const createdTour = await Tour.updateTourById(req.params.id, req.body);
      return createdTour === null
        ? res.status(404).json({ status: 'fail', message: 'No tour found' })
        : res.status(200).json({ status: 'success', data: createdTour });
    } catch (error) {
      return next(error);
    }
  }

  async deleteTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const tour: Tour = new Tour();
      const deletedTour = await tour.deleteTourById(req.params.id);
      return deletedTour === null
        ? res.status(404).json({ status: 'fail', message: 'No tour found' })
        : res.status(204).json({ status: 'success', data: null });
    } catch (error) {
      return next(error);
    }
  }

  async addTourDataFromJson(req: Request, res: Response, next: NextFunction) {
    try {
      const savedData = await Tour.addTourDataFromJson();

      return savedData === null
        ? res.status(404).json({ status: 'fail', message: 'No tour found' })
        : res.status(200).json({ status: 'success', data: savedData });
    } catch (error) {
      return next(error);
    }
  }

  aliasTopTours(req: Request, res: Response, next: NextFunction) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  }

  static async testTourStats(req: Request, res: Response, next: NextFunction) {
    try {
      const tourDocuments = await Tour.testAggregate();
      res.status(200).json({ status: 'success', data: tourDocuments });
    } catch (error) {
      next(error);
    }
  }

  static async showMonthlyPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const tourDocuments = await Tour.showMonthlyPlan(req.params.year);
      res.status(200).json({ status: 'success', data: { plan: tourDocuments } });
    } catch (error) {
      next(error);
    }
  }
}
