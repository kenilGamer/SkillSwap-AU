import "next-auth";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    username: string;
  }
  
  interface Session {
    user: User & {
      _id: string;
      username: string;
    };
  }
  
  interface JWT {
    _id: string;
    username: string;
  }
} 