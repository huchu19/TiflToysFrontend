import { MatFrame, type DesignComponentProps } from './MatFrame';
import { MosqueSilhouette } from './MosqueSilhouette';
import { Region } from './Region';

export type DesignProps = DesignComponentProps;

const STAR_PATH =
  'M0,-9 L2.1,-2.8 L8.6,-2.8 L3.3,1.1 L5.3,7.3 L0,3.5 L-5.3,7.3 L-3.3,1.1 L-8.6,-2.8 L-2.1,-2.8 Z';

const STARS = [
  { id: 'star1', x: 150, y: 128 },
  { id: 'star2', x: 200, y: 150 },
  { id: 'star3', x: 180, y: 108 },
];

/** A crescent moon and scattered stars float above the mosque at night. */
export function MosqueUnderStars({ fills, onSelect, overlay, svgRef, svgProps }: DesignProps) {
  const fill = (id: string) => fills[id] ?? '#FFFDF7';

  return (
    <MatFrame fills={fills} onSelect={onSelect} overlay={overlay} svgRef={svgRef} svgProps={svgProps}>
      <MosqueSilhouette fills={fills} onSelect={onSelect} />
      <Region
        id="moon"
        label="Crescent moon"
        tag="circle"
        cx={112}
        cy={132}
        r={16}
        fill={fill('moon')}
        onSelect={onSelect}
      />
      {STARS.map((s) => (
        <Region
          key={s.id}
          id={s.id}
          label="Star"
          tag="path"
          d={STAR_PATH}
          transform={`translate(${s.x} ${s.y})`}
          fill={fill(s.id)}
          onSelect={onSelect}
        />
      ))}
    </MatFrame>
  );
}
