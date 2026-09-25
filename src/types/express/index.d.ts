import { UserType } from "../../modules/user/user.type";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserType & { id?: number }; 
  }
}

export { };