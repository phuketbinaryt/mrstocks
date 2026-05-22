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
  ],
});
