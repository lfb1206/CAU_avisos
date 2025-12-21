import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    username: string;
    role: string;
  }

  interface User {
    username: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    role: string;
  }
}
