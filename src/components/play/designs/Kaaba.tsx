import { MatFrame, type DesignComponentProps } from './MatFrame';
import { Region } from './Region';

export type DesignProps = DesignComponentProps;

/** The Kaaba design — a cube draped with its gold band, standing on the ground panel. */
export function Kaaba({ fills, onSelect, overlay, svgRef, svgProps }: DesignProps) {
  const fill = (id: string) => fills[id] ?? '#FFFDF7';

  return (
    <MatFrame fills={fills} onSelect={onSelect} overlay={overlay} svgRef={svgRef} svgProps={svgProps}>
      <Region
        id="cubeBody"
        label="Kaaba body"
        tag="rect"
        x={116}
        y={188}
        width={88}
        height={100}
        fill={fill('cubeBody')}
        onSelect={onSelect}
      />
      <Region
        id="cubeBand"
        label="Gold band"
        tag="rect"
        x={116}
        y={224}
        width={88}
        height={16}
        fill={fill('cubeBand')}
        onSelect={onSelect}
      />
      <Region
        id="cubeDoor"
        label="Kaaba door"
        tag="rect"
        x={148}
        y={246}
        width={24}
        height={42}
        rx={2}
        fill={fill('cubeDoor')}
        onSelect={onSelect}
      />
    </MatFrame>
  );
}
