'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type SquishProps = {
  children: ReactNode;
  className?: string;
  /** Scale on hover — keep small (1.02–1.05) so it reads as "alive", not jumpy. */
  hoverScale?: number;
  /** Scale on press — slightly below 1 for a tactile "squish". */
  tapScale?: number;
};

/**
 * Tactile press/hover spring for buttons and cards — the toy-like feel used
 * across product cards, primary CTAs and the studio's palette swatches.
 * A plain <div> wrapper; pass onClick/etc. through to children as needed, or
 * spread props onto this component since motion.div forwards them.
 */
export function Squish({ children, className, hoverScale = 1.03, tapScale = 0.97, ...rest }: SquishProps & Record<string, unknown>) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={reduceMotion ? undefined : { scale: hoverScale }}
      whileTap={reduceMotion ? undefined : { scale: tapScale }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
