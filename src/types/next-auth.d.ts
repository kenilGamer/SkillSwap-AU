import "next-auth";
// eslint-disable-next-line no-unused-vars
import { DefaultUser as _DefaultUser } from "next-auth";
import { IUser } from '@/models/user.model'

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends IUser {}
  
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Session {
    user: User
  }
  
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface JWT extends IUser {}
} 