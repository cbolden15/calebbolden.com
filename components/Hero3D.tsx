'use client';

// White-mat framed video-card hero (derived from build-with-us-framed-video-card-hero
// + bionova headline system). The light page is the "mat"; a dark rounded media card
// holds the hero video and a white headline. Headline uses the signature sans + single
// Instrument-Serif-italic accent. No purple. Name kept as Hero3D for the page import.

function openChat() {
  window.dispatchEvent(new Event('open-chat'));
}

export default function Hero3D() {
  return (
    <section className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
      <div
        className="relative flex min-h-[78vh] flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          // Ambient scene: warm sunrise (top-left) meeting cool sky (bottom-right) over
          // a deep neutral. Shows through if the hero video asset is absent.
          background:
            'radial-gradient(120% 120% at 12% 8%, rgba(245,158,11,0.22), transparent 46%),' +
            'radial-gradient(120% 120% at 88% 92%, rgba(37,99,235,0.28), transparent 52%),' +
            'linear-gradient(155deg, #0B1220 0%, #131A2B 100%)',
        }}
      >
        {/* Hero video — drop /public/video/hero-loop.mp4 (Higgsfield) to go live.
            Until then the gradient above shows through. */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>

        {/* Soft lower-left vignette keeps the white headline legible over any frame */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top right, rgba(8,12,24,0.55), transparent 55%)' }}
        />

        {/* Content layer */}
        <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-8 md:p-10">
          {/* Status badge — frosted pill */}
          <div
            className="fade-up inline-flex w-fit items-center gap-2 rounded-full"
            style={{
              animationDelay: '0ms',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              padding: '5px 5px 5px 14px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
              AI Solutions Consultant
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full"
              style={{ background: 'rgba(21,128,61,0.9)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#86EFAC', display: 'inline-block' }} />
              Available
            </span>
          </div>

          {/* spacer */}
          <div className="min-h-8 flex-1" />

          {/* Bottom row: headline left, CTA cluster right on a shared baseline */}
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1
                className="fade-up font-medium tracking-tight text-white"
                style={{
                  animationDelay: '100ms',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 5.2vw, 3.75rem)',
                  lineHeight: 1.08,
                  textShadow: '0 2px 24px rgba(0,0,0,0.35)',
                }}
              >
                I automate the work{' '}
                <span className="accent-serif" style={{ color: '#FBD38D' }}>
                  you shouldn&apos;t
                </span>{' '}
                be doing
              </h1>

              <p
                className="fade-up mt-5 max-w-md"
                style={{
                  animationDelay: '200ms',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.82)',
                }}
              >
                Small businesses lose hours every day to tasks AI can handle. I build the
                systems that give that time back.
              </p>
            </div>

            {/* CTA cluster */}
            <div
              className="fade-up flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '300ms' }}
            >
              <button
                onClick={openChat}
                className="rounded-full transition-transform hover:-translate-y-0.5"
                style={{
                  background: '#fff',
                  color: '#0B1220',
                  fontWeight: 600,
                  fontSize: '15px',
                  padding: '13px 24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                }}
              >
                Analyze my business
              </button>
              <a
                href="#services"
                className="rounded-full transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '15px',
                  padding: '12px 22px',
                }}
              >
                See what&apos;s possible
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
