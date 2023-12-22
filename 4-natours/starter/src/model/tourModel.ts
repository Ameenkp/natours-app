import mongoose, { Document, Error, FilterQuery, Query, Schema, UpdateQuery } from "mongoose";
import { Request } from 'express';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';
import slugify from 'slugify';

// eslint-disable-next-line no-shadow
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface TourDocument extends Document {
  name: string;
  slug: string;
  secretTour: boolean;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
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

const tourSchema: Schema<TourDocument> = new Schema<TourDocument>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: { type: String },
    secretTour: { type: Boolean, default: false },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      enum: {
        values: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD],
        message: 'Difficulty is either: easy, medium or hard',
      },
      type: String,
      default: Difficulty.MEDIUM,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'Ratings quantity can not be less than 0'],
      max: [5, 'Ratings quantity can not be more than 5'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'], min: [0, 'Price can not be less than 0'] },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        validator(this: TourDocument, val: number) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below actual price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
      validate: {
        validator: (imageCover: string) => imageCover.includes('.jpg') || imageCover.includes('.png'),
      },
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

/// DOCUMENT MIDDLEWARE ///////////////////////
tourSchema.pre('save', function preSave(this: TourDocument, next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

/// QUERY MIDDLEWARE ///////////////////////
tourSchema.pre(/^find/, function preFind(this: Query<TourDocument | unknown, TourDocument>, next) {
  console.log(this);
  next();
});

/// AGGREGATE MIDDLEWARE ///////////////////////

tourSchema.pre('aggregate', function preAggregate(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// function priceTotalVirtualField() {
//   tourSchema.virtual('priceTotal').get(function calculatePriceTotal() {
//     return this.price - (this.price * this.priceDiscount) / 100;
//   });
// }
//
// function durationWeeksVirtualField(): void {
//   tourSchema.virtual('durationWeeks').get(function calculateDurationWeeks() {
//     return Math.round((this.duration / 7) * 100) / 100;
//   });
// }

const TourModel = mongoose.model<TourDocument>('Tour', tourSchema);

export async function createTour(data: Partial<TourDocument>): Promise<TourDocument> {
  try {
    return await TourModel.create(data);
  } catch (error) {
    throw new Error(`Error creating tour: ${(error as Error).message}`);
  }
}

export async function getTourById(id: string): Promise<TourDocument | null> {
  try {
    return await TourModel.findById(id);
  } catch (error) {
    throw new Error(`Error getting tour by ID: ${(error as Error).message}`);
  }
}

export async function updateTourById(id: string, update: Partial<TourDocument>): Promise<TourDocument | null> {
  try {
    return await TourModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  } catch (error) {
    throw new Error(`Error getting tour by ID: ${(error as Error).message}`);
  }
}

export async function getAllTour(): Promise<TourDocument[]> {
  try {
    return await TourModel.find();
  } catch (error) {
    throw new Error(`Error getting all tours: ${(error as Error).message}`);
  }
}

export async function getAllTourWithFilter(queryParameters: Request['query']): Promise<TourDocument[]> {
  try {
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
    const query = TourModel.find(filterOptions).skip(skip).limit(Number(limit)).sort(sortOrder).select(selectedFields);

    return await query.exec();
  } catch (error) {
    throw new Error(`Error getting all tours: ${(error as Error).message}`);
  }
}

export async function testAggregate(): Promise<TourDocument[]> {
  try {
    return await TourModel.aggregate([
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

export async function deleteTourById(id: string) {
  try {
    return await TourModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting tour by ID: ${(error as Error).message}`);
  }
}

export async function checkAndValidateTourId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id) || (await getTourById(id)) === null) {
    throw new Error('Invalid Tour ID');
  }
}

export async function addTourDataFromJson() {
  try {
    const s = path.join(__dirname, '../../dev-data/data/tours-simple.json');
    const data: TourDocument[] = JSON.parse(await promisify(fs.readFile)(s, 'utf-8'));
    await TourModel.deleteMany();
    const documents = await TourModel.create(data);
    console.log(documents);
  } catch (error) {
    throw new Error(`Error adding tour data from JSON: ${(error as Error).message}`);
  }
}

export async function showMonthlyPlan(year: string) {
  try {
    return await TourModel.aggregate([
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
