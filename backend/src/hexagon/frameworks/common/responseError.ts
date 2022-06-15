export default class ResponseError {
  public error;
  public msg;

  constructor({
    error = null,
    msg = null,
  }: {
    error: any;
    msg: string | null;
  }) {
    this.error = error;
    this.msg = msg;
  }
}
