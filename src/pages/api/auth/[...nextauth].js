import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/db/mongodb";

import Account from "@/src/lib/db/models/Account";

async function getUserIdFromDatabase(providerAccountId) {
  await dbConnect();
  const account = await Account.findOne({ providerAccountId });
  return account ? account.userId : null;
}

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
  session: {
    // jwt: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    // async jwt({ token, user, account }) {
    //   console.log("JWT Callback triggered");
    //   console.log("User in JWT callback:", user);
    //   console.log("Account in JWT callback:", account);

    //   if (user) {
    //     console.log("New user detected, setting userId");
    //     token.userId = user.id || user._id;
    //   } else if (account?.providerAccountId) {
    //     console.log(
    //       "Fetching userId from database for providerAccountId:",
    //       account.providerAccountId
    //     );
    //     token.userId = await getUserIdFromDatabase(account.providerAccountId);
    //   }

    //   console.log("Token after modification in JWT callback:", token);
    //   return token;
    // },
    async session({ session, user }) {
      // console.log("Token in session callback:", token);

      // if (token?.userId) {
      session.user.userId = user.id;
      // } else {
      //   console.warn("User ID not found in token.");
      // }

      return session;
    },
  },
};
export default NextAuth(authOptions);
