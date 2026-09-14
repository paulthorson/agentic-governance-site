import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import {isAdminEmail} from "@/lib/admin-access";

/**
 * Auth.js v5 — Google SSO for /admin only.
 * Public marketing routes stay unauthenticated.
 */
export const {handlers, auth, signIn, signOut} = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({account, profile}) {
      if (account?.provider !== "google") return false;
      const email = profile?.email;
      const verified =
        typeof profile === "object" &&
        profile !== null &&
        "email_verified" in profile
          ? Boolean((profile as {email_verified?: boolean}).email_verified)
          : true;
      if (!email || !verified) return false;
      return isAdminEmail(email);
    },
    async authorized({auth: session, request}) {
      const {pathname} = request.nextUrl;
      // Middleware matcher is /admin/*; login stays public within admin chrome.
      if (pathname === "/admin/login") return true;
      if (!pathname.startsWith("/admin")) return true;
      const email = session?.user?.email;
      return Boolean(email && isAdminEmail(email));
    },
  },
});
