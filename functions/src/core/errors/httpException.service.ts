import { HttpStatus } from '../enums/httpStatus.enum';

interface AppErrorArgs {
  name?: string;
  httpCode: HttpStatus;
  description?: string;
  isOperational?: boolean;
}

export class HttpException extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatus;
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
