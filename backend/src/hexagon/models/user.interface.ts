export default interface UserQuery {
  personid?: number | undefined;
  name: string;
  email: string;
  password: string;
  city?: string | null;
}
