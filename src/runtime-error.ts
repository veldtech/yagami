export class RuntimeError extends Error {
  /**
   * @hidden
   */
  statusCode: number;

  /**
   * @hidden
   */
  publicMessage: string;

  constructor(msg: string, publicMessage?: string, statusCode?: number) {
    super(msg);
    Object.setPrototypeOf(this, RuntimeError.prototype);

    this.publicMessage = publicMessage || "internal server error";
    this.statusCode = statusCode || 500;
  }

  getPublicMessage() {
    return this.publicMessage;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
