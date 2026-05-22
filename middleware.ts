// Membership gating happens in `requireActiveMembership()` inside each
// protected server component — NOT here in middleware. Auth.js v5 +
// DrizzleAdapter on postgres-js needs the Node runtime, and Next 15
// middleware defaults to Edge. Per-page guard keeps the full Node
// toolchain (postgres-js, drizzle, server-only) available.
//
// This middleware file is intentionally a noop. We leave it in place so
// the framework picks up the empty matcher and Phase 4+ can grow into it
// (e.g. for rate-limiting public endpoints) without re-introducing the
// file.
import { NextResponse, type NextRequest } from 'next/server';

export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
