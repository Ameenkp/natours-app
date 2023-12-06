import { Response, NextFunction } from 'express';
import { ValidationError } from '../error/validationError';

export class ErrorHandler {
  handleGenericError(err: Error, res: Response, next: NextFunction) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
    next();
  }

  handleValidationError(err: ValidationError, res: Response, next: NextFunction) {
    console.log(err.stack);
    res.status(err.status).json({
      error: err.name,
      message: err.message,
    });
    next();
  }
}
