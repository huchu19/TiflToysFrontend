'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Undo2, Redo2, Eraser, Paintbrush, MousePointerClick, Download, Printer, ShoppingBag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { StickerSpot } from '@/components/play/StickerSpot';
import { DESIGN_COMPONENTS, type Fills } from '@/components/play/designs';
import { MAT_DESIGNS, resolveMatVariant, type MatDesignId } from '@/lib/play';
import { formatPrice, type ShopifyVariant } from '@/lib/shopify';

const STORAGE_KEY = 'tifltoys.colouring.v1';

const PALETTE = [
  '#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0',
  '#F4DE7A', '#EFC2CB', '#BFE0C2', '#CBD9F1',
  '#3A2E4D', '#E24C4C', '#2E8B57', '#FFFFFF',
];

type Stroke = { color: string; width: number; points: string };
type DesignState = { fills: Fills; strokes: Stroke[] };
type AllState = Partial<Record<MatDesignId, DesignState>>;

const EMPTY_DESIGN: DesignState = { fills: {}, strokes: [] };

function readStorage(): AllState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AllState) : {};
  } catch {
    return {};
  }
}

function writeStorage(state: AllState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort only — private browsing / storage disabled.
  }
}

export function ColouringStudio({ variants }: { variants: ShopifyVariant[] | null }) {
  const { addItem, openDrawer } = useCart();
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);

  const [designId, setDesignId] = useState<MatDesignId>(MAT_DESIGNS[0].id);
  const [allState, setAllState] = useState<AllState>(() =>
    typeof window === 'undefined' ? {} : readStorage(),
  );
  const [past, setPast] = useState<DesignState[]>([]);
  const [future, setFuture] = useState<DesignState[]>([]);
  const [mode, setMode] = useState<'fill' | 'brush'>('fill');
  const [color, setColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(6);
  const [adding, setAdding] = useState(false);

  const current = allState[designId] ?? EMPTY_DESIGN;
  const Design = DESIGN_COMPONENTS[designId];

  const commit = useCallback(
    (next: DesignState) => {
      setPast((p) => [...p, current]);
      setFuture([]);
      setAllState((all) => {
        const merged = { ...all, [designId]: next };
        writeStorage(merged);
        return merged;
      });
    },
    [current, designId],
  );

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [current, ...f]);
    setAllState((all) => {
      const merged = { ...all, [designId]: prev };
      writeStorage(merged);
      return merged;
    });
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, current]);
    setAllState((all) => {
      const merged = { ...all, [designId]: next };
      writeStorage(merged);
      return merged;
    });
  };

  const clear = () => commit(EMPTY_DESIGN);

  const switchDesign = (id: MatDesignId) => {
    setDesignId(id);
    setPast([]);
    setFuture([]);
  };

  const handleFill = (regionId: string) => {
    if (mode !== 'fill') return;
    commit({ ...current, fills: { ...current.fills, [regionId]: color } });
  };

  function toSvgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const loc = pt.matrixTransform(ctm.inverse());
    return loc;
  }

  // The in-progress stroke lives in state (not a ref) specifically so it can
  // be read during render — `drawing` stays a ref since it's only ever read
  // inside event handlers, never in JSX.
  const [liveStroke, setLiveStroke] = useState<Stroke | null>(null);

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (mode !== 'brush') return;
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;
    drawing.current = true;
    setLiveStroke({ color, width: brushSize, points: `${p.x},${p.y}` });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!drawing.current) return;
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;
    setLiveStroke((prev) => (prev ? { ...prev, points: `${prev.points} ${p.x},${p.y}` } : prev));
  }

  function handlePointerUp() {
    if (!drawing.current) return;
    drawing.current = false;
    if (liveStroke) {
      commit({ ...current, strokes: [...current.strokes, liveStroke] });
    }
    setLiveStroke(null);
  }

  async function handleSavePng() {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 880;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement('a');
        a.download = `tifltoys-${designId}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const variant = useMemo(
    () => (variants ? resolveMatVariant(variants, designId) : null),
    [variants, designId],
  );

  async function buyThisDesign(e: React.MouseEvent<HTMLButtonElement>) {
    if (!variant) return;
    try {
      setAdding(true);
      await addItem(variant.id);
      if (!reduceMotion) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
          colors: ['#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0'],
        });
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Canvas */}
      <div>
        <div
          className="print-target relative overflow-hidden rounded-3xl bg-bg-cream p-4 sm:p-8"
          style={{ boxShadow: 'var(--shadow-sticker-lg)' }}
        >
          <Design
            fills={current.fills}
            onSelect={mode === 'fill' ? handleFill : undefined}
            svgRef={svgRef}
            svgProps={{
              className: 'mx-auto h-auto w-full max-w-sm touch-none select-none rounded-2xl bg-white',
              style: { boxShadow: '0 0 0 1px rgba(58,46,77,0.08)' },
              onPointerDown: handlePointerDown,
              onPointerMove: handlePointerMove,
              onPointerUp: handlePointerUp,
              onPointerLeave: handlePointerUp,
            }}
            overlay={
              <>
                {current.strokes.map((s, i) => (
                  <polyline
                    key={i}
                    points={s.points}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={s.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {liveStroke && (
                  <polyline
                    points={liveStroke.points}
                    fill="none"
                    stroke={liveStroke.color}
                    strokeWidth={liveStroke.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </>
            }
          />
        </div>

        {/* Design switcher */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {MAT_DESIGNS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => switchDesign(d.id)}
              className={`rounded-full border-2 px-4 py-2 font-fredoka text-sm font-semibold transition-colors ${
                d.id === designId
                  ? 'border-brand-purple bg-brand-purple text-white'
                  : 'border-gray-200 text-gray-600 hover:border-brand-purple hover:text-brand-purple'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-5" style={{ boxShadow: 'var(--shadow-sticker)' }}>
          <div className="flex items-center gap-2">
            <StickerSpot id="brush" className="mr-1" />
            <h2 className="font-fredoka text-lg font-bold text-brand-purple">Colouring tools</h2>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setMode('fill')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 font-fredoka text-sm font-semibold transition-colors ${
                mode === 'fill' ? 'bg-brand-purple text-white' : 'bg-bg-cream text-gray-600'
              }`}
            >
              <MousePointerClick className="h-4 w-4" /> Fill
            </button>
            <button
              type="button"
              onClick={() => setMode('brush')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 font-fredoka text-sm font-semibold transition-colors ${
                mode === 'brush' ? 'bg-brand-purple text-white' : 'bg-bg-cream text-gray-600'
              }`}
            >
              <Paintbrush className="h-4 w-4" /> Brush
            </button>
          </div>

          {mode === 'brush' && (
            <label className="mt-4 flex items-center gap-3 text-sm text-gray-600">
              Brush size
              <input
                type="range"
                min={2}
                max={16}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="flex-1 accent-brand-purple"
              />
            </label>
          )}

          <div className="mt-4 grid grid-cols-6 gap-2">
            {PALETTE.map((c) => (
              <motion.button
                key={c}
                type="button"
                whileHover={reduceMotion ? undefined : { scale: 1.15 }}
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                onClick={() => setColor(c)}
                aria-label={`Colour ${c}`}
                aria-pressed={color === c}
                className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-brand-purple' : 'border-white'}`}
                style={{ backgroundColor: c, boxShadow: '0 0 0 1px rgba(58,46,77,0.15)' }}
              />
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={!past.length}
              aria-label="Undo"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-cream py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
            >
              <Undo2 className="h-4 w-4" /> Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!future.length}
              aria-label="Redo"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-cream py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
            >
              <Redo2 className="h-4 w-4" /> Redo
            </button>
            <button
              type="button"
              onClick={clear}
              aria-label="Clear design"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-bg-cream py-2 text-sm font-semibold text-gray-600"
            >
              <Eraser className="h-4 w-4" /> Clear
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSavePng}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:border-brand-purple hover:text-brand-purple"
            >
              <Download className="h-4 w-4" /> Save
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:border-brand-purple hover:text-brand-purple"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>

        {/* Buy the real thing */}
        <div className="rounded-3xl bg-bg-mint p-5 text-on-mint" style={{ boxShadow: 'var(--shadow-sticker)' }}>
          <p className="font-fredoka text-sm font-bold uppercase tracking-wide">Love it that much?</p>
          <p className="mt-1 text-sm">Get the real, physical mat in this design, shipped to your door.</p>
          {variant ? (
            <button
              type="button"
              onClick={buyThisDesign}
              disabled={adding || !variant.available}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-fredoka text-sm font-semibold text-on-mint shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingBag className="h-4 w-4" />
              {!variant.available
                ? 'Sold out'
                : adding
                  ? 'Adding…'
                  : `Buy this mat — ${formatPrice(variant.amount)}`}
            </button>
          ) : (
            <Link
              href="/products"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-fredoka text-sm font-semibold text-on-mint shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop prayer mats
            </Link>
          )}
          <button
            type="button"
            onClick={openDrawer}
            className="mt-2 w-full text-center text-xs font-semibold underline underline-offset-2"
          >
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}
