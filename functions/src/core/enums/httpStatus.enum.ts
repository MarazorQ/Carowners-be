export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
export enum ErrorMessages {
  UNAUTHORIZED = 'Unauthorized',
  INTERNAL_SERVER_ERROR = 'Internal server error',
}
