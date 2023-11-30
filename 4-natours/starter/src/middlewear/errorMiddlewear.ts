// errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error handling middleware: ', err);

  // Customize the error response based on your requirements
  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
