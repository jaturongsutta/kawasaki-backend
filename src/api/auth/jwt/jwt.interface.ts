export interface JwtPayload {
  userId: number;
  username: string;
  roles: number[];
  iat: number;
  exp: number;
}
