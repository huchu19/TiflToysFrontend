'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type FloatProps = {
  children: ReactNode;
  className?: string;
  /** Vertical drift range in pixels. */
  range?: number;
  /** Full cycle duration in seconds. */
  duration?: number;
  /** Stagger multiple floating doodles so they don't move in lockstep. */
  delay?: number;
};

/**
 * Slow idle vertical drift for decorative doodles (Star/Curl/Arc/Sparkle).
 * Purely ambient — disabled entirely under prefers-reduced-motion since it
 * never carries information.
 */
export function Float({ children, className, range = 8, duration = 4, delay = 0 }: FloatProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -range, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
