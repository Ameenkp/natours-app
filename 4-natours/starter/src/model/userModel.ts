import mongoose, { Document, Error, FilterQuery, Schema } from 'mongoose';
import { Request } from 'express';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  photo: string;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A tour must have a email'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A tour must have a password'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'practitioner', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: false,
  },
  photo: { type: String, default: 'default.jpg' },
});

userSchema.pre('find', async function preSave(next) {
  console.log(this);
  next();
});
export const userModel = mongoose.model<User>('user', userSchema);

export async function createUser(user: Partial<User>): Promise<User> {
  try {
    return await userModel.create(user);
  } catch (error) {
    throw new Error(`Error creating tour: ${(error as Error).message}`);
  }
}

export async function getAllUser(): Promise<User[]> {
  try {
    return await userModel.find();
  } catch (error) {
    throw new Error(`Error getting the users: ${(error as Error).message}`);
  }
}

export async function getAllUserWithFilter(queryParameters: Request['query']) {
  try {
    const { page, limit, sort, fields, ...nestedParams } = queryParameters;

    const skip = (Number(page) - 1) * Number(limit) || 0;
    const sortOrder = sort ? (<string>sort).split(',').join(' ') : '-createdAt';
    const selectFields = fields ? (<string>fields).split(',').join(' ') : '-__v';

    const filterOptions: FilterQuery<User> = {};

    console.log(nestedParams);
    console.log(filterOptions);

    const query = userModel.find().skip(skip).limit(Number(limit)).sort(sortOrder).select(selectFields);

    return await query;
  } catch (error) {
    throw new Error(`Error getting the users: ${(error as Error).message}`);
  }
}
export async function testAggregate(): Promise<User[]> {
  try {
    return await userModel.aggregate([
      {
        $group: {
          _id: { $toUpper: '$role' },
          numUsers: { $sum: 1 },
          users: { $push: '$name' },
        },
      },
      {
        $project: {
          _id: 1,
          numUsers: 1,
          users: 1,
        },
      },
      {
        $sort: { numUsers: -1 },
      },
    ]);
  } catch (error) {
    throw new Error(`Error getting the users: ${(error as Error).message}`);
  }
}
