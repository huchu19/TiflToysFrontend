import { Kaaba } from './Kaaba';
import { RoadToMosque } from './RoadToMosque';
import { WalkwayToMosque } from './WalkwayToMosque';
import { MosqueUnderStars } from './MosqueUnderStars';
import { MosqueAndFlowerets } from './MosqueAndFlowerets';
import type { Fills, DesignComponentProps } from './MatFrame';
import type { MatDesignId } from '@/lib/play';

export type { Fills, DesignComponentProps };
export type { DesignProps } from './Kaaba';

/** Registry mapping a design id (matches MAT_DESIGNS in lib/play.ts) to the
 *  SVG component that draws it. Keeping this separate from lib/play.ts keeps
 *  that file server-safe (no JSX) while this one stays the single place a
 *  new design needs to be wired in. Every entry renders exactly one <svg> —
 *  see DesignComponentProps in MatFrame.tsx for how to layer content (e.g.
 *  brush strokes) on top without nesting a second one. */
export const DESIGN_COMPONENTS: Record<
  MatDesignId,
  (props: DesignComponentProps) => React.JSX.Element
> = {
  kaaba: Kaaba,
  'road-to-mosque': RoadToMosque,
  'walkway-to-mosque': WalkwayToMosque,
  'mosque-under-stars': MosqueUnderStars,
  'mosque-and-flowerets': MosqueAndFlowerets,
};
