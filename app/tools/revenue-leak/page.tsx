import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import RevenueLeakCalculator from '@/components/tools/RevenueLeakCalculator';

export const metadata: Metadata = {
  title: 'The revenue leak calculator for local businesses | Caleb Bolden',
  description: 'Five numbers most owners never calculate. Fill in yours and see what missed calls, slow quotes, no-shows, and unused software cost per month.',
};

export default function RevenueLeakPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-5">calculator · 5 leaks · 15 minutes with your phone log</p>
              <h1 className="type-display max-w-[14ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                What are the leaks costing you?
              </h1>
              <p className="mt-6 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                None of these leaks show up in your books, because money you never collected never gets recorded. That is why they survive for years. Grab last month's numbers where you have them and estimate honestly where you don't.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <RevenueLeakCalculator />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
