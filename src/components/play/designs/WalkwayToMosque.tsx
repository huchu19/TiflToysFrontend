import { MatFrame, type DesignComponentProps } from './MatFrame';
import { MosqueSilhouette } from './MosqueSilhouette';
import { Region } from './Region';

export type DesignProps = DesignComponentProps;

const TILES = [
  { id: 'tile1', x: 86 },
  { id: 'tile2', x: 122 },
  { id: 'tile3', x: 158 },
  { id: 'tile4', x: 194 },
];

/** A paved walkway of rectangular tiles leads to the mosque. */
export function WalkwayToMosque({ fills, onSelect, overlay, svgRef, svgProps }: DesignProps) {
  const fill = (id: string) => fills[id] ?? '#FFFDF7';

  return (
    <MatFrame fills={fills} onSelect={onSelect} overlay={overlay} svgRef={svgRef} svgProps={svgProps}>
      <MosqueSilhouette fills={fills} onSelect={onSelect} />
      {TILES.map((t) => (
        <Region
          key={t.id}
          id={t.id}
          label="Walkway tile"
          tag="rect"
          x={t.x}
          y={314}
          width={32}
          height={24}
          rx={3}
          fill={fill(t.id)}
          onSelect={onSelect}
        />
      ))}
    </MatFrame>
  );
}
