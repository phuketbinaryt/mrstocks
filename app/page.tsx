import Nav from '@/components/marketing/Nav';
import TickerTape from '@/components/marketing/TickerTape';
import Hero from '@/components/marketing/Hero';
import BigStats from '@/components/marketing/BigStats';
import MethodViz from '@/components/marketing/MethodViz';
import HowItWorks from '@/components/marketing/HowItWorks';
import RuleSandbox from '@/components/marketing/RuleSandbox';
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
      <TickerTape />
      <Hero />
      <BigStats />
      <MethodViz />
      <HowItWorks />
      <RuleSandbox />
      <Features />
      <Pricing checkoutUrl={env.WHOP_CHECKOUT_URL} />
      <FAQ />
      <Footer />
    </main>
  );
}
