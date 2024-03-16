export function promiseCatcher(err: any, req: any, res: any, next: any) {
    // If err has no specified error code, set error code to 'Internal Server Error (500)'
    if (!err.statusCode) {
        err.statusCode = 500;
    }
  
    res.status(err.statusCode).json({
        status: err.statusCode,
        error: err.message
    });
  
  }