import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async session({ session }) {
            if (session?.user?.email) {
                session.user.username = session.user.email.split("@")[0];
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };