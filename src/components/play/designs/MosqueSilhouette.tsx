import { Region } from './Region';
import type { Fills } from './MatFrame';

/**
 * Shared mosque-with-minaret motif used by three of the five designs (Road to
 * Mosque, Walkway to Mosque, Mosque Under Stars) — only the ground beneath it
 * and the sky above it differ between those designs, matching how the real
 * product line prints one mosque silhouette across several mat variants.
 */
export function MosqueSilhouette({
  fills,
  onSelect,
}: {
  fills: Fills;
  onSelect?: (id: string) => void;
}) {
  const fill = (id: string) => fills[id] ?? '#FFFDF7';

  return (
    <>
      <Region
        id="minaret"
        label="Minaret tower"
        tag="rect"
        x={195}
        y={188}
        width={12}
        height={92}
        rx={3}
        fill={fill('minaret')}
        onSelect={onSelect}
      />
      <Region
        id="minaretCap"
        label="Minaret cap"
        tag="path"
        d="M195,188 L201,172 L207,188 Z"
        fill={fill('minaretCap')}
        onSelect={onSelect}
      />
      <Region
        id="mosqueBody"
        label="Mosque wall"
        tag="rect"
        x={122}
        y={232}
        width={64}
        height={48}
        fill={fill('mosqueBody')}
        onSelect={onSelect}
      />
      <Region
        id="dome"
        label="Mosque dome"
        tag="path"
        d="M122,232 A32,32 0 0 1 186,232 Z"
        fill={fill('dome')}
        onSelect={onSelect}
      />
      <Region
        id="domeSpire"
        label="Dome spire"
        tag="path"
        d="M151,200 L157,186 L163,200 Z"
        fill={fill('domeSpire')}
        onSelect={onSelect}
      />
      <Region
        id="doorway"
        label="Mosque doorway"
        tag="path"
        d="M142,280 L142,258 A12,12 0 0 1 166,258 L166,280 Z"
        fill={fill('doorway')}
        onSelect={onSelect}
      />
    </>
  );
}
