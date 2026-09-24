import type { KeyboardEvent } from 'react';

export type RegionShape =
  | { tag: 'path'; d: string }
  | { tag: 'circle'; cx: number; cy: number; r: number }
  | { tag: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

export type RegionProps = {
  id: string;
  label: string;
  /** Current fill — the studio passes the colour the kid has picked for this
   *  region, or the paper-white default when untouched. */
  fill: string;
  onSelect?: (id: string) => void;
  /** Optional SVG transform, e.g. to place a repeated motif (a star, a tile)
   *  at a specific spot without hand-computing its path coordinates. */
  transform?: string;
} & RegionShape;

/**
 * One fillable, focusable region of a colouring-page design. Every design in
 * this folder is built entirely out of <Region> shapes so the studio can
 * treat "tap to fill" and "tab through with a keyboard" identically no matter
 * which mat is on screen.
 */
export function Region(props: RegionProps) {
  const { id, label, fill, onSelect, transform, ...shape } = props;

  function select() {
    onSelect?.(id);
  }

  const common = {
    'data-region': id,
    fill,
    ...(transform ? { transform } : {}),
    stroke: '#3A2E4D',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    tabIndex: 0,
    role: 'button',
    'aria-label': label,
    className:
      'cursor-pointer outline-none transition-[fill] duration-150 focus-visible:stroke-[3] focus-visible:stroke-brand-purple',
    onClick: () => select(),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select();
      }
    },
  };

  if (shape.tag === 'path') return <path {...common} d={shape.d} />;
  if (shape.tag === 'circle') return <circle {...common} cx={shape.cx} cy={shape.cy} r={shape.r} />;
  return <rect {...common} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />;
}
