import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import dbConnect from "@/src/lib/db/mongoose";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  adapter: MongoDBAdapter(dbConnect()),
  session: {
    jwt: true,
  },
  callbacks: {
    async session({ session, token }) {
      //   session.user.id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
