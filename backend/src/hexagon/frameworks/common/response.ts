import ResponseError from './responseError';

export default class Response {
  public status;
  public msg;
  public error;
  public content;

  constructor({
    status = 200,
    msg = null,
    error = null,
    content = null,
  }: {
    status?: number;
    error?: ResponseError | null;
    msg?: string | null;
    content?: any;
  }) {
    this.status = status;
    this.msg = msg;
    this.error = error;
    this.content = content;
  }
}
