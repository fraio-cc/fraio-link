import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
    hasPassword?: boolean;
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    discord_id?: string | null;
    discord_username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    hasPassword?: boolean;
  }
}
