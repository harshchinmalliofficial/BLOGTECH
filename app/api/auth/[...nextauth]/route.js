import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database.js";
import User from "@models/user.js";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });

        // Check if the user exists
        if (sessionUser) {
          session.user.id = sessionUser._id.toString(); // Use `_id` instead of `id`
        } else {
          console.error("User not found for email:", session.user.email);
        }

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session; // Return session even if there's an error for minimal disruption
      }
    },
    async signIn({ profile }) {
      console.log("Signing in user:", profile.email);
      try {
        await connectToDB();
        const userExist = await User.findOne({ email: profile.email });

        if (userExist) {
          console.log("User exists:", userExist);
          return true; // Ensure true is returned for existing users
        } else {
          console.log("Creating a new user for:", profile.email);
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
          return true;
        }
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // If an error occurs, return false to avoid blocking
      }
    },
  },
});
console.log("Google ID:", process.env.GOOGLE_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

export { handler as GET, handler as POST };
