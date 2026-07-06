"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** entrance delay in ms (use for staggers) */
  delay?: number;
  className?: string;
  /** visibility fraction that triggers the reveal */
  amount?: number;
};

/**
 * Plays the `.fade-up` (blur-fade-up) entrance once the element scrolls into
 * view. Dependency-free stand-in for framer-motion's whileInView.
 */
export default function Reveal({ children, delay = 0, className = "", amount = 0.2 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
