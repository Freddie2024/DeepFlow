import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/db/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async session({ session, user }) {
      session.user.userId = user.id;

      return session;
    },
  },
};
export default NextAuth(authOptions);
