'use client';

import { useEffect, useMemo, useRef, useState, type TransitionEvent } from 'react';

const items = [
  'Running Vora, a CRM for service businesses',
  'Building an AI assistant for real estate agents',
  'Writing the process audit playbook',
  "Shipping this site's assistant",
  'Building ChapterHQ for clubs and nonprofits',
];

const itemHeightEm = 1.6;
const loopStart = items.length;
const loopEnd = items.length * 2;

function NowItem({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 whitespace-nowrap sm:justify-end"
      style={{ height: `${itemHeightEm}em`, fontSize: 15, color: 'var(--color-ink-muted)' }}
    >
      <span aria-hidden="true" className="shrink-0" style={{ width: 4, height: 4, background: 'var(--color-blue)' }} />
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
}

export default function NowStrip() {
  const loopItems = useMemo(() => [...items, ...items, ...items], []);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef<number | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [activeIndex, setActiveIndex] = useState(loopStart);
  const [withTransition, setWithTransition] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setShouldAnimate(true);

    const clearTicker = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const startTicker = () => {
      if (document.hidden || intervalRef.current !== null) {
        return;
      }

      intervalRef.current = setInterval(() => {
        setWithTransition(true);
        setActiveIndex((currentIndex) => currentIndex + 1);
      }, 4000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTicker();
      } else {
        startTicker();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startTicker();

    return () => {
      clearTicker();
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform' || activeIndex < loopEnd) {
      return;
    }

    setWithTransition(false);
    setActiveIndex(loopStart);

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(() => {
        setWithTransition(true);
        frameRef.current = null;
      });
    });
  };

  return (
    <section
      className="chat-offset py-4"
      style={{
        borderTop: '1px solid var(--color-hairline)',
        borderBottom: '1px solid var(--color-hairline)',
      }}
    >
      <div className="mx-auto flex w-[90%] max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <span className="anno shrink-0">On the board this week</span>

        <div className="min-w-0 sm:flex-1">
          {shouldAnimate ? (
            <>
              <span className="sr-only">{items[activeIndex % items.length]}</span>
              <div aria-hidden="true" className="overflow-hidden" style={{ height: `${itemHeightEm}em` }}>
                <div
                  onTransitionEnd={handleTransitionEnd}
                  style={{
                    transform: `translateY(-${activeIndex * itemHeightEm}em)`,
                    transition: withTransition
                      ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'none',
                  }}
                >
                  {loopItems.map((item, index) => (
                    <NowItem key={`${item}-${index}`} label={item} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <NowItem label={items[0]} />
          )}
        </div>
      </div>
    </section>
  );
}
