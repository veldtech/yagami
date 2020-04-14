type Error = {
  statusCode: number;
  message: string;
};

export function notFound(noun: string): Error {
  return {
    statusCode: 404,
    message: `${noun} was not found`,
  };
}

export function internalServerError(message: string): Error {
  return {
    statusCode: 500,
    message: message,
  };
}
