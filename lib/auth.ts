import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db/client';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';
import { env } from '@/lib/env';
import { sendMagicLinkEmail } from '@/lib/email/send-magic-link';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'database' },
  secret: env.AUTH_SECRET,
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify-request',
  },
  providers: [
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      maxAge: 60 * 30, // 30 min link lifetime
      // Required by EmailConfig type; we don't use nodemailer transport,
      // sendVerificationRequest below handles delivery via Resend.
      server: {},
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendMagicLinkEmail({ to: identifier, url });
      },
    },
    // Whop OAuth — custom provider (no off-the-shelf @auth/whop adapter).
    // OAuth endpoints sourced from https://docs.whop.com (Q2 2026):
    //   authorize: https://whop.com/oauth
    //   token:     https://api.whop.com/api/v5/oauth/token
    //   userinfo:  https://api.whop.com/api/v5/me
    // If any of these 404 at execution time, check docs.whop.com — the
    // network-tab error from Auth.js will surface the offending URL.
    {
      id: 'whop',
      name: 'Whop',
      type: 'oauth',
      clientId: env.WHOP_CLIENT_ID,
      clientSecret: env.WHOP_CLIENT_SECRET,
      authorization: {
        url: 'https://whop.com/oauth',
        params: {
          scope: 'openid profile email',
          response_type: 'code',
        },
      },
      token: 'https://api.whop.com/api/v5/oauth/token',
      userinfo: 'https://api.whop.com/api/v5/me',
      profile(profile: {
        id: string;
        username?: string;
        email: string;
        profile_pic_url?: string | null;
      }) {
        return {
          id: profile.id,
          name: profile.username ?? profile.email,
          email: profile.email,
          image: profile.profile_pic_url ?? null,
        };
      },
      // Merge by email with an existing email-magic-link account.
      allowDangerousEmailAccountLinking: true,
    },
  ],
  events: {
    async signIn({ user, account }) {
      // Whop JIT membership lookup — only runs for the Whop OAuth provider.
      if (account?.provider === 'whop') {
        const whopUserId = account.providerAccountId;
        if (user.id && whopUserId) {
          try {
            const { getActiveMembershipForUser } = await import(
              '@/lib/whop/client'
            );
            const { upsertMembershipFromWhop } = await import(
              '@/lib/membership/upsert'
            );
            const m = await getActiveMembershipForUser(whopUserId);
            if (m) {
              await upsertMembershipFromWhop({
                userId: user.id,
                whopMembership: m,
              });
            }
          } catch (err) {
            console.error(
              '[auth.signIn] whop membership lookup failed:',
              err,
            );
            // non-fatal — webhook will catch them up
          }
        }
      }

      // Bootstrap a default watchlist for new users (idempotent — no-op if
      // they already have one). Runs for every provider so magic-link
      // users also get an "All signals" list on first sign-in.
      if (user.id) {
        try {
          const { ensureDefaultWatchlistForUser } = await import(
            '@/lib/watchlists/actions'
          );
          await ensureDefaultWatchlistForUser(user.id);
        } catch (err) {
          console.error(
            '[auth.signIn] ensureDefaultWatchlist failed:',
            err,
          );
          // Non-fatal — user can create one manually from /watchlists/new.
        }
      }
    },
  },
});
