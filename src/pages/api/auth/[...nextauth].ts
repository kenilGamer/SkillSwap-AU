import NextAuth from "next-auth";
import { authOptions } from "@/auth/[...nextauth]/options";

export default NextAuth(authOptions); 