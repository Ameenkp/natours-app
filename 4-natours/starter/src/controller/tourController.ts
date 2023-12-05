import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { Tour } from '../model/Tour';
import fs from 'fs';
import { promisify } from 'util';
import { CommonMiddleware } from '../middlewear/baseMiddleware';
import { ValidationError } from '../error/validationError';

const dataFilePath = path.join(__dirname, '../../dev-data/data/tours.json');
const writeFilAsync = promisify(fs.writeFile);

export class TourController {
  private tours: Tour[];
  private commonMiddleware: CommonMiddleware;

  constructor() {
    console.log('TourController constructor executed');
    this.tours = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    this.commonMiddleware = new CommonMiddleware();
  }

  private async writeFileAsync() {
    try {
      await writeFilAsync(dataFilePath, JSON.stringify(this.tours));
      console.log('success 🚀');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // Middleware to check ID param
  checkId(req: Request, res: Response, next: NextFunction, val: string) {
    this.commonMiddleware.checkId(req, res, next, this.tours, 'tour', val);
  }

  getAllTour(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        status: 'success',
        results: this.tours.length,
        requestedAt: req.body.requestedAt,
        data: {
          tours: this.tours,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createTour(req: Request, res: Response, next: NextFunction) {
    try {
      const newId = this.tours[this.tours.length - 1]._id + 1;
      const newTour = Object.assign({ _id: newId }, req.body);
      this.tours.push(newTour);

      await this.writeFileAsync();

       res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  getTourById(req: Request, res: Response, next: NextFunction) {
    const tourById = this.tours.find((tour) => tour._id === req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour: tourById },
    });
  }

  async updateTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const tourIndex = this.tours.findIndex((tour) => tour._id === req.params.id);
      this.tours[tourIndex] = Object.assign(this.tours[tourIndex], req.body);
      await this.writeFileAsync();
      res.status(200).json({
        status: 'success',
        data: {
          tour: this.tours[tourIndex],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const tourIndex = this.tours.findIndex((tour) => tour._id === req.params.id);
      if (tourIndex !== -1) {
        this.tours.splice(tourIndex, 1);
        await this.writeFileAsync();
        res.status(204).json({
          status: 'success',
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  validateTour(req: Request, res: Response, next: NextFunction) {
    const tourData: Tour = req.body;
    console.log(tourData.name, tourData.difficulty, tourData.duration);
    if (!tourData.name || !tourData.difficulty || !tourData.duration) {
      throw new ValidationError('All fields are required ! 🦕');
    }
  }
}
