import Link from 'next/link';
import Reveal from './Reveal';

// What-I-build band: four system categories, mono tags, linking into /work.

const systems = [
  { tag: 'voice', title: 'Voice agents', desc: 'Answer every call, book the job, route the emergency.' },
  { tag: 'knowledge', title: 'Knowledge assistants', desc: 'Answer from your own records instead of a generic guess.' },
  { tag: 'workflow', title: 'Workflow automation', desc: 'Invoices, scheduling, and data entry that run themselves.' },
  { tag: 'campaigns', title: 'Campaign systems', desc: 'Email and SMS that go out on schedule while you work.' },
];

export default function AISystems() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display mb-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
            What I actually build
          </h2>
          <p className="mb-10 max-w-lg" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            Four kinds of systems, built from the same working parts.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
          {systems.map((s, i) => (
            <Reveal key={s.tag} delay={i * 70}>
              <div>
                <span className="anno">{s.tag}</span>
                <h3
                  className="mt-2"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}
                >
                  {s.title}
                </h3>
                <p className="mt-2" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <p className="mt-10">
            <Link
              href="/work"
              className="link-draw transition-colors"
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-blue)' }}
            >
              See the systems I run
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
