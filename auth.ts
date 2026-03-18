import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail, verifyPassword, createOrUpdateOAuthUser, linkDiscordToUser } from "./lib/db";
import { config } from "./lib/config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email"
        }
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
        };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email as string)) {
          return null;
        }

        const user = await findUserByEmail(credentials.email as string);
        
        if (!user) {
          return null;
        }

        if (!user.password_hash) {
          const providerNames: Record<string, string> = {
            google: 'Google',
            discord: 'Discord',
            credentials: 'email/password',
          };
          throw new Error(`This email is registered with ${providerNames[user.provider] || user.provider}. Please sign in with ${providerNames[user.provider] || user.provider}.`);
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password_hash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "discord") {
        try {
          if (!user.email) {
            return `/login?error=${encodeURIComponent('E-posta adresi bulunamadı')}`;
          }

          const existingUser = await findUserByEmail(user.email);
          
          if (!existingUser) {
            return `/login?error=${encodeURIComponent('Hesap bulunamadı. Lütfen önce fraio.cc üzerinden kayıt olun.')}`;
          }

          if (account.provider === "discord") {
            if (existingUser.provider === 'credentials' && !existingUser.discord_id) {
              const discordUsername = profile?.username 
                ? `${profile.username}${(profile as any).discriminator !== '0' ? `#${(profile as any).discriminator}` : ''}`
                : user.name || '';
              
              try {
                await linkDiscordToUser(existingUser.id, account.providerAccountId, discordUsername);
                user.id = existingUser.id;
                return '/?discord_linked=success';
              } catch (linkError: any) {
                console.error('Discord link error:', linkError);
                return `/?error=${encodeURIComponent(linkError.message)}`;
              }
            }
          }

          user.id = existingUser.id;
          
          return true;
        } catch (error: any) {
          console.error("OAuth error:", error.message);
          return `/login?error=${encodeURIComponent(error.message)}`;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        
        if (user.email) {
          const dbUser = await findUserByEmail(user.email);
          if (dbUser) {
            token.hasPassword = !!dbUser.password_hash;
          }
        }
      }
      
      if (trigger === 'update') {
        if (token.email) {
          const dbUser = await findUserByEmail(token.email as string);
          if (dbUser) {
            token.hasPassword = !!dbUser.password_hash;
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).hasPassword = token.hasPassword;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: config.nextAuth.secret,
  trustHost: true,
});
