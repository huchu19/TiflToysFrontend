'use client';

import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Reveal } from './Reveal';

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's reveal. */
  step?: number;
  /** Element type for the wrapping Reveal of each child — 'li' for list grids. */
  as?: 'div' | 'li';
};

/**
 * Wraps each direct child in a <Reveal> with an incrementing delay, so a grid
 * or list animates in as a cascade instead of all at once. Pass plain
 * elements as children (e.g. a .map() of <ProductCard>); this only adds the
 * reveal behaviour, it does not otherwise alter layout.
 */
export function Stagger({ children, className, step = 0.08, as = 'div' }: StaggerProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];

  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal key={child.key ?? i} delay={i * step} as={as}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
