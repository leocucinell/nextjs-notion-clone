import { User } from "./types";

export {};

declare global {
  interface CustomJWTSessionClaims extends User {}
}
