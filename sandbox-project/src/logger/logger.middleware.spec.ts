import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next() function', () => {
    const mockRequest = {} as any;
    const mockResponse = {} as any;

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
  
});
