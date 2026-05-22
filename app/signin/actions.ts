'use server';
import { signIn } from '@/lib/auth';

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) throw new Error('Email is required');
  await signIn('email', { email, redirectTo: '/dashboard' });
}
