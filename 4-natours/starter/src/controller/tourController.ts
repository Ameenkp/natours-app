import { NextFunction, Request, Response } from 'express';
import { Tour, TourDocument } from '../model/tourModel';
import { ValidationError } from '../error/validationError';

export class TourController {
  static async getAllTours(req: Request, res: Response, next: NextFunction) {
    try {
      const allTours = await Tour.getAllTours();
      if (allTours.length === 0) {
        return res.status(404).json({ status: 404, message: 'No tours found' });
      }
      return res.status(200).json({ data: allTours });
    } catch (error) {
      return next(error);
    }
  }

  static async createTour(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newTourData: Partial<TourDocument> = req.body;
      const createdTour = await Tour.createTour(newTourData);
      res.status(201).json({ data: createdTour });
    } catch (error) {
      next(error);
    }
  }

  static async getTourById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tourId = req.params.id;
    try {
      const foundTour = await Tour.getTourById(tourId);
      res.status(200).json({ data: foundTour });
    } catch (error) {
      next(error);
    }
  }

  async updateTourById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tour: Tour = new Tour();
      const createdTour = await tour.updateTourById(req.params.id, req.body);
      res.status(201).json({ data: createdTour });
    } catch (error) {
      next(error);
    }
  }

  async deleteTourById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tour: Tour = new Tour();
      await tour.deleteTourById(req.params.id);
      res.status(204).json({ status: 'success', data: null });
    } catch (error) {
      next(error);
    }
  }

  static validateTour(req: Request, res: Response, next: NextFunction) {
    const tourData: Partial<TourDocument> = req.body;
    if (!tourData.name || !tourData.rating || !tourData.price) {
      throw new ValidationError('All fields are required ! 🦕');
    }
  }

  static async validateTourParamId(req: Request, next: NextFunction, id: string) {
    try {
      await Tour.checkAndValidateTourId(id);
      next();
    } catch (error) {
      next(error);
    }
  }
}
