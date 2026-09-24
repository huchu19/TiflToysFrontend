import { MatFrame, type DesignComponentProps } from './MatFrame';
import { MosqueSilhouette } from './MosqueSilhouette';
import { Region } from './Region';

export type DesignProps = DesignComponentProps;

const STONES = [
  { id: 'stone1', cx: 96, cy: 322 },
  { id: 'stone2', cx: 134, cy: 336 },
  { id: 'stone3', cx: 186, cy: 336 },
  { id: 'stone4', cx: 224, cy: 322 },
];

/** A winding path of stepping stones leads to the mosque. */
export function RoadToMosque({ fills, onSelect, overlay, svgRef, svgProps }: DesignProps) {
  const fill = (id: string) => fills[id] ?? '#FFFDF7';

  return (
    <MatFrame fills={fills} onSelect={onSelect} overlay={overlay} svgRef={svgRef} svgProps={svgProps}>
      <MosqueSilhouette fills={fills} onSelect={onSelect} />
      {STONES.map((s) => (
        <Region
          key={s.id}
          id={s.id}
          label="Stepping stone"
          tag="circle"
          cx={s.cx}
          cy={s.cy}
          r={11}
          fill={fill(s.id)}
          onSelect={onSelect}
        />
      ))}
    </MatFrame>
  );
}
