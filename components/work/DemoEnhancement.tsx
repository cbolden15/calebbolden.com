'use client';

import { Component, createElement, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import styles from './Showcase.module.css';

class EnhancementBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p>Interactive controls are unavailable. The initial example and text walkthrough remain available.</p> : this.props.children; }
}

/** Load one project module on approach. The server frame and native recovery live outside this boundary. */
export default function DemoEnhancement<P extends object>({ load, componentProps }: {
  load: () => Promise<{ default: ComponentType<P> }>;
  componentProps: P;
}) {
  const host = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [Interactive, setInteractive] = useState<ComponentType<P> | null>(null);
  const [failed, setFailed] = useState(false);
  const begin = useCallback(() => {
    if (started.current) return;
    started.current = true;
    load().then(module => setInteractive(() => module.default)).catch(() => setFailed(true));
  }, [load]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { begin(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { begin(); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [begin]);
  return (
    <div ref={host} onPointerEnter={begin} onFocusCapture={begin} data-demo-enhancement>
      {failed ? <p role="status">Interactive controls could not load. Use the initial example and text walkthrough.</p> : Interactive ? (
        <EnhancementBoundary>
          <div className={styles.enhancementControls} data-ready="true">{createElement(Interactive, componentProps)}</div>
        </EnhancementBoundary>
      ) : <p>Interactive controls load when this example comes into view.</p>}
    </div>
  );
}
