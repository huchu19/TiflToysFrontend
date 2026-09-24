'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Delay in seconds — used by <Stagger> to offset children; can also be set directly. */
  delay?: number;
  /** Pixels the element travels while fading in. */
  distance?: number;
  as?: 'div' | 'li';
};

const makeVariants = (distance: number): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0 },
});

/**
 * Fade + rise into view on scroll. Animates once (won't re-trigger on scroll
 * back up) and collapses to a plain fade under prefers-reduced-motion.
 */
export function Reveal({ children, className, style, delay = 0, distance = 24, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === 'li' ? motion.li : motion.div;

  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={reduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : makeVariants(distance)}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
