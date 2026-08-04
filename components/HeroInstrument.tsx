'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { initHeroEngine } from './hero/heroEngine';

// The hero instrument: a scroll-driven canvas (Task 18's heroEngine) plus two
// copy clusters that crossfade as the canvas sweeps from the paper map to the
// live system. Every viewport gets the scroll choreography (desktop 280vh,
// mobile 200vh); only prefers-reduced-motion falls back to a single static
// viewport with the engine pinned to the midpoint split. The engine composes
// its map into a desktop or mobile band from the canvas box width. DOM shape
// ported from docs/design/hero-prototype-2026-07-14.html.

function ClusterCtas() {
  return (
    <div className="ctas">
      <Link href="/contact" className="btn primary">
        Let&apos;s talk
      </Link>
      <Link href="/work" className="btn ghost">
        See my work
      </Link>
    </div>
  );
}

function PaperCluster() {
  return (
    <div className="cluster paper-c" id="paperC">
      <div className="micro">Caleb Bolden · Vora Technologies · sheet 1 / the map</div>
      <h1>
        I automate <strong>the work you shouldn&apos;t be doing</strong>
      </h1>
      <p className="sub">
        I&apos;m Caleb Bolden. I find where your business loses time, then build AI to take that work
        over. Every engagement starts with this map: a fixed-scope audit of how your business actually
        runs.
      </p>
      <ClusterCtas />
    </div>
  );
}

function LiveCluster() {
  return (
    <div className="cluster live-c" id="liveC">
      <div className="micro">sheet 2 / live system · same map, same boxes</div>
      <h1>
        This is one of my systems, <strong>running right now</strong>
      </h1>
      <p className="sub">
        A voice agent answering, a docs agent filing, a campaign agent sending. I build and run these
        for my own companies first, then for yours.
      </p>
      <ClusterCtas />
    </div>
  );
}

function SpecBar() {
  return (
    <div className="specbar">
      <div className="pills">
        <span className="pill">
          <span className="dot" />
          Vora · live
        </span>
        <span className="pill">
          <span className="dot" />
          ChapterHQ · live
        </span>
        <span className="pill">
          <span className="dot amber" />
          Agents 05 · running
        </span>
      </div>
      <div className="readout">
        <span id="readoutLine">scroll · the audit becomes the build</span>
        <br />
        boxes routed · <span id="doneCount">0</span>
      </div>
    </div>
  );
}

export default function HeroInstrument() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isStatic, setIsStatic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Static (single-viewport) path is reduced-motion only now; mobile keeps the
  // scroll choreography. Re-check on change (the OS preference flipping).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsStatic(mq.matches);
    const onChange = () => setIsStatic(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Track height: shorten the pinned scroll section on phones so it doesn't
  // feel endless. Re-check on resize across the 768px breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Mount the canvas engine. Static path pins progress at the midpoint split
  // and skips the scroll listener entirely; the scroll-driven path computes
  // progress from the track's position each scroll tick.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isStatic) {
      const engine = initHeroEngine(canvas, () => 0.5);
      return () => engine.destroy();
    }

    const track = trackRef.current;
    if (!track) return;

    // Read progress from the track's live position every frame (the engine
    // calls this inside its rAF loop). Computing it here rather than from a
    // scroll event means it can never desync or miss an event, whatever the
    // page's scroll container is.
    const getProgress = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const engine = initHeroEngine(canvas, getProgress);
    return () => {
      engine.destroy();
    };
  }, [isStatic]);

  const instrument = (
    <div className="hero-sticky">
      <div id="stage">
        <canvas ref={canvasRef} id="cv" />
      </div>
      <section id="hero">
        <div className="viewport">
          <div className="cluster-wrap">
            <PaperCluster />
            <LiveCluster />
          </div>
          <SpecBar />
        </div>
      </section>
    </div>
  );

  if (isStatic) {
    return instrument;
  }

  return (
    <div ref={trackRef} className="hero-track" style={{ height: isMobile ? '200vh' : '280vh' }}>
      {instrument}
    </div>
  );
}
