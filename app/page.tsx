import Nav from '@/components/marketing/Nav';
import Hero from '@/components/marketing/Hero';
import HowItWorks from '@/components/marketing/HowItWorks';
import Features from '@/components/marketing/Features';
import Pricing from '@/components/marketing/Pricing';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/marketing/Footer';
import { env } from '@/lib/env';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth();
  return (
    <main className="bg-black text-white min-h-screen">
      <Nav isSignedIn={Boolean(session?.user)} />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing checkoutUrl={env.WHOP_CHECKOUT_URL} />
      <FAQ />
      <Footer />
    </main>
  );
}
