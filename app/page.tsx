import Nav from '@/components/marketing/Nav';
import Hero from '@/components/marketing/Hero';
import HowItWorks from '@/components/marketing/HowItWorks';
import Features from '@/components/marketing/Features';
import Pricing from '@/components/marketing/Pricing';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
