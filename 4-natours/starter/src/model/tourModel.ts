import mongoose, { Document, Error, FilterQuery, Schema } from 'mongoose';
import { Request } from 'express';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

export interface TourDocument extends Document {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  rating: number;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
}

export class Tour {
  private static tourSchema: Schema<TourDocument> = new Schema<TourDocument>(
    {
      name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
      },
      duration: { type: Number, required: [true, 'A tour must have a duration'] },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
      },
      difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
      },
      ratingsAverage: { type: Number, default: 4.5 },
      ratingsQuantity: { type: Number, default: 0 },
      price: { type: Number, required: [true, 'A tour must have a price'] },
      priceDiscount: { type: Number, default: 0 },
      summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary'],
      },
      imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
      },
      images: [String],
      createdAt: { type: Date, default: Date.now(), select: false },
      startDates: [Date],
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  private static priceTotalVirtualField() {
    Tour.tourSchema.virtual('priceTotal').get(function calculatePriceTotal() {
      return this.price - (this.price * this.priceDiscount) / 100;
    });
  }

  private static durationWeeksVirtualField(): void {
    Tour.tourSchema.virtual('durationWeeks').get(function calculateDurationWeeks() {
      return Math.round((this.duration / 7) * 100) / 100;
    });
  }

  private static TourModel = mongoose.model<TourDocument>('Tour', Tour.tourSchema);

  static async createTour(data: Partial<TourDocument>): Promise<TourDocument> {
    try {
      return await this.TourModel.create(data);
    } catch (error) {
      throw new Error(`Error creating tour: ${(error as Error).message}`);
    }
  }

  static async getTourById(id: string): Promise<TourDocument | null> {
    try {
      return await Tour.TourModel.findById(id);
    } catch (error) {
      throw new Error(`Error getting tour by ID: ${(error as Error).message}`);
    }
  }

  static async updateTourById(id: string, update: Partial<TourDocument>): Promise<TourDocument | null> {
    try {
      return await Tour.TourModel.findByIdAndUpdate(id, update, { new: true });
    } catch (error) {
      throw new Error(`Error getting tour by ID: ${(error as Error).message}`);
    }
  }

  static async getAllTours(): Promise<TourDocument[]> {
    try {
      return await Tour.TourModel.find();
    } catch (error) {
      throw new Error(`Error getting all tours: ${(error as Error).message}`);
    }
  }

  static async getAllToursWithFilter(queryParameters: Request['query']): Promise<TourDocument[]> {
    try {
      Tour.durationWeeksVirtualField();
      const { page, limit, sort, fields, ...nestedParams } = queryParameters;

      // Validate and parse query parameters
      const skip = (Number(page) - 1) * Number(limit) || 0;

      // Price range filtering
      const filterOptions: FilterQuery<TourDocument> = {};
      Object.entries(nestedParams).forEach(([key, value]) => {
        if (typeof value === 'object') {
          filterOptions[key] = {};
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            filterOptions[key][`$${nestedKey}`] = nestedValue;
          });
        } else {
          filterOptions[key] = value;
        }
      });

      const selectedFields = fields ? (<string>fields).split(',').join(' ') : '-__v';

      const sortOrder = sort ? (<string>sort).split(',').join(' ') : '-createdAt';
      // MongoDB query
      const query = Tour.TourModel.find(filterOptions)
        .skip(skip)
        .limit(Number(limit))
        .sort(sortOrder)
        .select(selectedFields);

      return await query.exec();
    } catch (error) {
      throw new Error(`Error getting all tours: ${(error as Error).message}`);
    }
  }

  static async testAggregate(): Promise<TourDocument[]> {
    try {
      return await Tour.TourModel.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            totalPrice: { $sum: '$price' },
            averagePrice: { $avg: '$price' },
            averageRatings: { $avg: '$ratingsAverage' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
        {
          $project: {
            _id: 1,
            totalPrice: 1,
            numTours: 1,
            averagePrice: { $round: ['$averagePrice', 2] },
            minPrice: 1,
            maxPrice: 1,
            averageRatings: { $round: ['$averageRatings', 2] },
          },
        },
        { $sort: { totalPrice: 1 } },
      ]);
    } catch (error) {
      throw new Error(`Error getting tours using aggregate: ${(error as Error).message}`);
    }
  }

  async deleteTourById(id: string) {
    try {
      return await Tour.TourModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting tour by ID: ${(error as Error).message}`);
    }
  }

  static async checkAndValidateTourId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id) || (await Tour.getTourById(id)) === null) {
      throw new Error('Invalid Tour ID');
    }
  }

  static async addTourDataFromJson() {
    try {
      const s = path.join(__dirname, '../../dev-data/data/tours-simple.json');
      const data: TourDocument[] = JSON.parse(await promisify(fs.readFile)(s, 'utf-8'));
      await this.TourModel.deleteMany();
      const documents = await this.TourModel.create(data);
      console.log(documents);
    } catch (error) {
      throw new Error(`Error adding tour data from JSON: ${(error as Error).message}`);
    }
  }

  static async showMonthlyPlan(year: string) {
    try {
      return await Tour.TourModel.aggregate([
        {
          $unwind: '$startDates',
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numToursStarts: { $sum: 1 },
            tours: { $push: '$name' },
            averagePrice: { $avg: '$price' },
            averageRating: { $avg: '$ratingsAverage' },
          },
        },
        {
          $addFields: { month: '$_id' },
        },
        {
          $project: {
            _id: 0,
            averagePrice: { $round: ['$averagePrice', 2] },
            averageRating: { $round: ['$averageRating', 2] },
            numToursStarts: 1,
            tours: 1,
            month: 1,
          },
        },
        {
          $sort: { numToursStarts: -1 },
        },
      ]);
    } catch (error) {
      throw new Error(`Error getting monthly plan: ${(error as Error).message}`);
    }
  }
}
