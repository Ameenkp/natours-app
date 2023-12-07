import mongoose, { Document, Error, Schema } from 'mongoose';

export interface TourDocument extends Document {
  name: string;
  rating: number;
  price: number;
}

export class Tour {
  private static tourSchema: Schema<TourDocument> = new Schema<TourDocument>({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    rating: { type: Number, required: true },
    price: { type: Number, required: [true, 'A tour must have a price'] },
  });

  private static TourModel = mongoose.model<TourDocument>('Tour', Tour.tourSchema);

  static async createTour(data: Partial<TourDocument>): Promise<TourDocument> {
    try {
      const tour = new Tour.TourModel(data);
      return await tour.save();
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

  async updateTourById(id: string, update: Partial<TourDocument>): Promise<TourDocument | null> {
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

  async deleteTourById(id: string) {
    try {
      return await Tour.TourModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting tour by ID: ${(error as Error).message}`);
    }
  }

  static async checkAndValidateTourId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id) || !(await Tour.getTourById(id)) === null) {
      throw new Error('Invalid Tour ID');
    }
  }
}
