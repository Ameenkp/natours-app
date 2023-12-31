import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import { ErrorHandler } from './middlewear/errorMiddlewear';
import { ValidationError } from './error/validationError';
import { TourRouter } from './routes/tourRouter';
import { UserRouter } from './routes/userRouter';

export class App {
  private app: Application;

  private errorHandler: ErrorHandler;

  constructor() {
    this.app = express();
    this.errorHandler = new ErrorHandler();
    this.config();
    this.middlewares();
    this.routeMountings();
    this.serveStaticFiles();
    this.errorMiddleware();
  }

  private config(): void {
    if ((process.env.NODE_ENV as string) !== 'production') {
      this.app.use(morgan('dev'));
    }
    this.app.use(express.json());
  }

  private middlewares(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log('Custom middleware 🦕');
      next();
    });

    this.app.use((req, res, next) => {
      req.body.requestedAt = new Date().toISOString();
      console.log(req.body.requestedAt);
      next();
    });
  }

  private routeMountings(): void {
    this.app.use('/api/v1/tour', new TourRouter().getRouter());
    this.app.use('/api/v1/user', new UserRouter().getRouter());
  }

  private serveStaticFiles(): void {
    const staticFilesDir = path.join(__dirname, '../public');
    this.app.use(express.static(staticFilesDir));
  }

  private errorMiddleware(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ValidationError) {
        return this.errorHandler.handleValidationError(err, res, next);
      }
      return this.errorHandler.handleGenericError(err, res, next);
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
