import { NextFunction, Request, Response } from 'express';
import { Tour, TourDocument } from '../model/tourModel';

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

  async updateTourById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createdTour = await Tour.updateTourById(req.params.id, req.body);
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
}
