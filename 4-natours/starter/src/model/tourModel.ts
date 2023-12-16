import mongoose, { Document, Error, Schema } from 'mongoose';
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

  static async getAllToursWithFilter(tourDocument: Partial<TourDocument>): Promise<TourDocument[]> {
    try {
      return await Tour.TourModel.find({
        difficulty: { $eq: tourDocument.difficulty },
        price: { $gt: tourDocument.price },
      });
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
