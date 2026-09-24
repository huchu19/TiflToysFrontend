import { MatFrame, type DesignComponentProps } from './MatFrame';
import { MosqueSilhouette } from './MosqueSilhouette';
import { Region } from './Region';

export type DesignProps = DesignComponentProps;

const FLOWER_PATH =
  'M0,-10 C4,-10 6,-6 4,-3 C8,-4 11,-1 9,3 C11,6 8,9 4,7 C6,10 3,13 0,10 C-3,13 -6,10 -4,7 C-8,9 -11,6 -9,3 C-11,-1 -8,-4 -4,-3 C-6,-6 -4,-10 0,-10 Z';

const FLOWERS = [
  { id: 'flower1', x: 98, y: 260 },
  { id: 'flower2', x: 222, y: 260 },
  { id: 'flower3', x: 98, y: 200 },
];

/** Little flowers bloom around the mosque's base. */
export function MosqueAndFlowerets({ fills, onSelect, overlay, svgRef, svgProps }: DesignProps) {
  const fill = (id: string) => fills[id] ?? '#FFFDF7';

  return (
    <MatFrame fills={fills} onSelect={onSelect} overlay={overlay} svgRef={svgRef} svgProps={svgProps}>
      <MosqueSilhouette fills={fills} onSelect={onSelect} />
      {FLOWERS.map((f) => (
        <Region
          key={f.id}
          id={f.id}
          label="Floweret"
          tag="path"
          d={FLOWER_PATH}
          transform={`translate(${f.x} ${f.y})`}
          fill={fill(f.id)}
          onSelect={onSelect}
        />
      ))}
    </MatFrame>
  );
}
