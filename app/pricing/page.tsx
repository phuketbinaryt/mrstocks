import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';
import Pricing from '@/components/marketing/Pricing';
import { env } from '@/lib/env';

export const metadata = {
  title: 'Pricing — MR/STOCKS',
};

interface PageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function PricingPage({ searchParams }: PageProps) {
  const { reason } = await searchParams;

  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <Nav />
      {reason === 'no-active-membership' && (
        <div className="border-b border-[oklch(0.82_0.16_75/0.3)] bg-[oklch(0.82_0.16_75/0.10)] px-4 py-3 text-center">
          <span className="text-[12px] uppercase tracking-[0.12em] text-[oklch(0.82_0.16_75)]">
            Active subscription required — choose your plan below
          </span>
        </div>
      )}
      <Pricing checkoutUrl={env.WHOP_CHECKOUT_URL} />
      <Footer />
    </main>
  );
}
