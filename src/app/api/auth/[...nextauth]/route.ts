import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile",
                },
            },
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
            session.user.username = token.username as string | undefined;
            session.user.name = token.username as string | undefined || session.user.name;

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
                    const email = profile?.email || user?.email;

                    // Debug logging
                    if (!email) {
                        console.error('[Auth] No email found in profile or user:', {
                            profileEmail: profile?.email,
                            userEmail: user?.email,
                            profile: profile
                        });
                    }

                    // Construct baseUrl from environment variables
                    const baseUrl = process.env.NEXTAUTH_URL ||
                        (process.env.FLY_APP_NAME ? `https://${process.env.FLY_APP_NAME}.fly.dev` : null) ||
                        'http://localhost:3000';

                    if (!email) {
                        console.error('[Auth] Cannot track user without email');
                        return;
                    }

                    // Fire and forget - don't await
                    fetch(`${baseUrl}/api/track-user`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ auth_id, username, email }),
                    }).catch((error) => {
                        console.error('[Auth] Error tracking user:', error);
                    });
                } catch (err) {
                    console.error('[Auth] Error in signIn callback:', err);
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };