import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, account, profile }) {
            // When user logs in first time
            if (account && profile) {
                token.googleId = profile.sub;  // Google’s stable user ID
                token.username = profile.name;
                token.email = profile.email;
            }
            return token;
        },

        async session({ session, token }) {
            // Expose IDs to frontend
            session.user.id = token.googleId as string | undefined;
            session.user.email = token.email as string | null | undefined;
            session.user.username = token.username as string | undefined; //google doesnt give email address, hence using token.name

            return session;
        },

        async signIn({ user, account, profile }) {
            // Always return true immediately to allow OAuth flow to complete
            // Track user in background without blocking the login process
            
            // Use Promise.resolve().then() to make it truly async and non-blocking
            Promise.resolve().then(async () => {
                try {
                    const auth_id = profile?.sub; // Google stable ID
                    const username = profile?.name;
                    const email = profile?.email;

                    // Construct baseUrl from environment variables
                    const baseUrl = process.env.NEXTAUTH_URL || 
                        (process.env.FLY_APP_NAME ? `https://${process.env.FLY_APP_NAME}.fly.dev` : null) ||
                        'http://localhost:3000';
                    
                    // Fire and forget - don't await
                    fetch(`${baseUrl}/api/track-user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ auth_id, username, email }),
                    }).catch(() => {
                        // Silently fail - don't block or log errors
                    });
                } catch (err) {
                    // Silently ignore any errors - don't block login
                }
            });

            return true;
        },

        async redirect({ url, baseUrl }) {
            // If a valid callbackUrl is provided, use it
            if (url && url !== baseUrl) {
                try {
                    const target = new URL(url, baseUrl);
                    const base = new URL(baseUrl);
                    // Only allow redirects to same origin
                    if (target.origin === base.origin) {
                        return url;
                    }
                } catch (_) {
                    // Invalid URL, fall through to default
                }
            }
            
            // Default to home page after login
            return baseUrl;
        },
    },
});

export { handler as GET, handler as POST };