#!/usr/bin/env -S node --import tsx
// One-time: generate a VAPID keypair. Pipe stdout into .env.local on prod.
// Usage:
//   pnpm tsx scripts/generate-vapid.ts
// then SSH the 4 lines into /opt/mrstocks/.env.local on the server.
import webpush from 'web-push';

const k = webpush.generateVAPIDKeys();
console.log(`VAPID_PUBLIC_KEY=${k.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${k.privateKey}`);
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${k.publicKey}`);
console.log(`VAPID_SUBJECT=mailto:ops@mrstocks.cash`);
