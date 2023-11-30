import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { Tour } from '../model/Tour';
import fs from 'fs';
import { promisify } from 'util';

const dataFilePath = path.join(__dirname, '../../dev-data/data/tours.json');
const tours: Tour[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const writeFilAsync = promisify(fs.writeFile);

/////////////////////////////////////////////
/// MIDDLEWARE TO CHECK ID PARAM
const checkId = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string,
) => {
  console.log('Tour id is : ', val);
  if (!tours.find((el) => el._id === val)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

const getAllTour = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.body.requestedAt,
      data: {
        tours,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createTour = (req: Request, res: Response, next: NextFunction) => {
  const newId = tours[tours.length - 1]._id + 1;
  const newTour = Object.assign({ _id: newId }, req.body);
  tours.push(newTour);

  writeFilAsync(dataFilePath, JSON.stringify(tours))
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
};

const getTourById = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.id);
  console.log(req.params);
  const tourById = tours.find((tour) => tour._id === req.params.id);
  res.status(200).json({
    status: 'success',
    data: { tour: tourById },
  });
};

const updateTourById = (req: Request, res: Response, next: NextFunction) => {
  const tourIndex = tours.findIndex((tour) => tour._id === req.params.id);

  if (tourIndex !== -1) {
    tours[tourIndex].name = req.body.name;

    writeFileASync()
      .then(() => {
        res.status(200).json({
          status: 'success',
          data: {
            tour: tours[tourIndex],
          },
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const deleteTourById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tourIndex = tours.findIndex((tour) => tour._id === req.params.id);
    if (tourIndex !== -1) {
      tours.splice(tourIndex, 1);
      await writeFileASync();
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

async function writeFileASync() {
  try {
    await writeFilAsync(dataFilePath, JSON.stringify(tours));
    console.log('success 🚀');
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export {
  getAllTour,
  createTour,
  getTourById,
  updateTourById,
  deleteTourById,
  checkId,
};
