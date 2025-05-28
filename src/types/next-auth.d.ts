import "next-auth";
import { DefaultUser } from "next-auth";
import { IUser } from '@/models/user.model'

declare module "next-auth" {
  interface User extends IUser {}
  
  interface Session {
    user: User
  }
  
  interface JWT extends IUser {}
} 