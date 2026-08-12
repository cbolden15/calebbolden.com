import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import Reveal from './Reveal';

export type ServicePageContent = {
  serviceType: string;
  h1: string;
  intro: string;
  method: string;
  figure?: React.ReactNode;
  deliverables: {
    title: string;
    detail: string;
  }[];
  proof: string;
  cta: string;
};

const ctaLabel = "Let's talk";

export default function ServicePage({
  serviceType,
  h1,
  intro,
  method,
  figure,
  deliverables,
  proof,
  cta,
}: ServicePageContent) {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Caleb Bolden',
      legalName: 'Vora Technologies LLC',
      url: 'https://calebbolden.com',
    },
    areaServed: 'United States',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[18ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                {h1}
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                {intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno mb-5">how it fits the method</p>
              <p className="max-w-xl" style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                {method}
              </p>
              <Link
                href="/method"
                className="link-draw mt-5 inline-block"
                style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
              >
                See the method: Charted
              </Link>
              {figure && <div className="mt-10 max-w-2xl">{figure}</div>}
            </Reveal>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h2 className="type-display mb-8" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                What you get
              </h2>
            </Reveal>
            <div>
              {deliverables.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div
                    className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    style={{ borderTop: '1px solid var(--color-hairline)' }}
                  >
                    <h3
                      className="sm:col-span-4"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 650, color: 'var(--color-ink)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="sm:col-span-8" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                      {item.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink)' }}>
                {proof}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div
                className="max-w-2xl rounded-[2px] p-8 sm:p-10"
                style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
              >
                <h2 className="type-display mb-5" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                  Start with the audit
                </h2>
                <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                  {cta}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link href="/contact" className="btn-ink btn-roll">
                    <span className="roll-box">
                      <span className="roll-a">{ctaLabel}</span>
                      <span className="roll-b" aria-hidden="true">
                        {ctaLabel}
                      </span>
                    </span>
                  </Link>
                  <p style={{ fontSize: 14, color: 'var(--color-ink-faint)' }}>
                    Or open the assistant in the corner and describe your business.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
