import express, { Request, Response, NextFunction } from 'express';
import errorHandler from './middlewear/errorMiddlewear';
import morgan from 'morgan';
import tourRouter from './routes/tourRouter';
import userRouter from './routes/userRouter';

const app = express();

////////////////////////////////
// 1. MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Custom middleware 🦕');
  next();
});

app.use((req, res, next) => {
  req.body.requestedAt = new Date().toISOString();
  console.log(req.body.requestedAt);
  next();
});

app.use(errorHandler);

////////////////////////////////
// 2. ROUTER MOUNTINGS

app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/user', userRouter);

export default app;
