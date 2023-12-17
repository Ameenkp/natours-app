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
  private static tourSchema: Schema<TourDocument> = new Schema<TourDocument>({
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
    createdAt: { type: Date, default: Date.now() },
    startDates: [Date],
  });

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
      const queryObj = { ...queryParameters };
      console.log(queryObj);
      const { page, pageSize, sort, fields, ...nestedParams } = queryParameters;

      // Validate and parse query parameters
      const parsedPage = parseInt(page as string, 10) || 1;
      const parsedPageSize = parseInt(pageSize as string, 10) || 10;

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
        .skip((parsedPage - 1) * parsedPageSize)
        .limit(parsedPageSize)
        .sort(sortOrder)
        .select(selectedFields);

      return await query.exec();
    } catch (error) {
      throw new Error(`Error getting all tours: ${(error as Error).message}`);
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
}
