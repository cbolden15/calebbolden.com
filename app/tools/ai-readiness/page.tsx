import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import ReadinessScorecard from '@/components/tools/ReadinessScorecard';

export const metadata: Metadata = {
  title: 'Is your business ready for AI? An 18-question scorecard | Caleb Bolden',
  description: 'Answer 18 plain-language questions and get a scored read on where AI would actually help your business, and what to do first.',
};

export default function AiReadinessPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-5">self-assessment · 18 questions · about 10 minutes</p>
              <h1 className="type-display max-w-[15ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Is your business ready for AI?
              </h1>
              <p className="mt-6 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                76% of small businesses now use AI in some form, but only 14% have it working inside their actual operations (Goldman Sachs 10,000 Small Businesses survey, 2026). The difference is not the tools. It is whether the business was ready before the tools showed up. Answer honestly and find out which side of that gap you are on.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <ReadinessScorecard />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
