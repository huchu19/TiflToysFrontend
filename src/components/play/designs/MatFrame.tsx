import type { ReactNode, Ref, SVGProps } from 'react';
import { Region } from './Region';

export type Fills = Record<string, string>;
const PAPER = '#FFFDF7';

/** Props shared by every design component (Kaaba, RoadToMosque, …) — each one
 *  just forwards these straight through to <MatFrame>. */
export type DesignComponentProps = {
  fills: Fills;
  onSelect?: (id: string) => void;
  overlay?: ReactNode;
  svgRef?: Ref<SVGSVGElement>;
  svgProps?: SVGProps<SVGSVGElement>;
};

/**
 * The shared prayer-mat frame every design is built on — border, header/
 * footer bands, side pillars and the central mihrab-arch niche. Each of the
 * five designs (see the sibling files) drops its own motif regions inside the
 * niche/ground area via `children`, so the frame's seven regions (border,
 * header, footer, pillarLeft, pillarRight, niche, ground) stay identical and
 * only the centrepiece changes — matching how the real product line varies
 * one printed motif across a shared mat shape.
 *
 * Every design renders exactly one <svg> — this one. Callers that need extra
 * layers on top (e.g. the Colouring Studio's freehand brush strokes) pass
 * them via `overlay` rather than wrapping the design in a second <svg>.
 */
export function MatFrame({
  fills,
  onSelect,
  children,
  overlay,
  svgRef,
  svgProps,
}: {
  fills: Fills;
  onSelect?: (id: string) => void;
  children?: ReactNode;
  /** Extra SVG content rendered after every region, e.g. brush strokes. */
  overlay?: ReactNode;
  /** Forwarded to the underlying <svg> — used when a caller needs direct DOM
   *  access (e.g. serializing it to a PNG export). */
  svgRef?: Ref<SVGSVGElement>;
  /** Extra props (className, pointer handlers, …) spread onto the <svg>. */
  svgProps?: SVGProps<SVGSVGElement>;
}) {
  const fill = (id: string) => fills[id] ?? PAPER;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 440"
      role="img"
      aria-label="Colourable prayer mat outline"
      {...svgProps}
    >
      <Region
        id="border"
        label="Outer border"
        tag="rect"
        x={12}
        y={12}
        width={296}
        height={416}
        rx={28}
        fill={fill('border')}
        onSelect={onSelect}
      />
      <Region
        id="header"
        label="Header band"
        tag="rect"
        x={32}
        y={32}
        width={256}
        height={36}
        rx={10}
        fill={fill('header')}
        onSelect={onSelect}
      />
      <Region
        id="pillarLeft"
        label="Left pillar"
        tag="rect"
        x={40}
        y={80}
        width={32}
        height={288}
        rx={6}
        fill={fill('pillarLeft')}
        onSelect={onSelect}
      />
      <Region
        id="pillarRight"
        label="Right pillar"
        tag="rect"
        x={248}
        y={80}
        width={32}
        height={288}
        rx={6}
        fill={fill('pillarRight')}
        onSelect={onSelect}
      />
      <Region
        id="niche"
        label="Arch niche"
        tag="path"
        d="M72,300 L72,180 A88,88 0 0 1 248,180 L248,300 Z"
        fill={fill('niche')}
        onSelect={onSelect}
      />
      <Region
        id="ground"
        label="Ground panel"
        tag="rect"
        x={72}
        y={300}
        width={176}
        height={56}
        fill={fill('ground')}
        onSelect={onSelect}
      />
      <Region
        id="footer"
        label="Footer band"
        tag="rect"
        x={32}
        y={372}
        width={256}
        height={36}
        rx={10}
        fill={fill('footer')}
        onSelect={onSelect}
      />
      {children}
      {overlay}
    </svg>
  );
}
