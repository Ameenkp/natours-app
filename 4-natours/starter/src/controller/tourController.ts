import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { Tour } from '../model/Tour';
import fs from 'fs';
import { promisify } from 'util';

const dataFilePath = path.join(__dirname, '../../dev-data/data/tours.json');
const writeFilAsync = promisify(fs.writeFile);

export class TourController {
  private tours: Tour[];

  constructor() {
    console.log('TourController constructor executed');
    this.tours = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
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
    console.log('Tour id is : ', val);
    if (!this.tours.find((el) => el._id === val)) {
      return res.status(404).json({
        status: 'failed',
        message: 'Invalid ID',
      });
    }
    next();
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

  createTour(req: Request, res: Response, next: NextFunction) {
    const newId = this.tours[this.tours.length - 1]._id + 1;
    const newTour = Object.assign({ _id: newId }, req.body);
    this.tours.push(newTour);

    this.writeFileAsync()
      .then(() => {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  getTourById(req: Request, res: Response, next: NextFunction) {
    const tourById = this.tours.find((tour) => tour._id === req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour: tourById },
    });
  }

  updateTourById(req: Request, res: Response, next: NextFunction) {
    const tourIndex = this.tours.findIndex((tour) => tour._id === req.params.id);

    if (tourIndex !== -1) {
      this.tours[tourIndex].name = req.body.name;

      this.writeFileAsync()
        .then(() => {
          res.status(200).json({
            status: 'success',
            data: {
              tour: this.tours[tourIndex],
            },
          });
        })
        .catch((err) => {
          next(err);
        });
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
}
