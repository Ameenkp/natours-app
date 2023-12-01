import express, { Application, Request, Response, NextFunction } from 'express';
import errorHandler from './middlewear/errorMiddlewear';
import morgan from 'morgan';
import tourRouter from './routes/tourRouter';
import userRouter from './routes/userRouter';

class App {
  private app: Application;

  constructor() {
    console.log('Express app has been created 🎊');
    this.app = express();
    this.config();
    this.middlewares();
    this.routeMountings();
  }

  private config(): void {
    this.app.use(morgan('dev'));
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

    this.app.use(errorHandler);
  }

  private routeMountings(): void {
    this.app.use('/api/v1/tour', tourRouter);
    this.app.use('/api/v1/user', userRouter);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default App;
