// The sticker hunt's fixed roster. Each sticker lives at exactly one spot on
// the site (see <StickerSpot> usages) — this list is the single source of
// truth for how many exist and what they're called, so the nav pill and the
// /play/stickers keepsake page never drift out of sync.
export type StickerDef = {
  id: string;
  label: string;
  emoji: string;
  /** Where this sticker is hidden — shown on the keepsake page as a hint. */
  location: string;
};

export const STICKERS: StickerDef[] = [
  { id: 'star', label: 'Wandering Star', emoji: '⭐', location: 'Homepage' },
  { id: 'crescent', label: 'Curious Crescent', emoji: '🌙', location: 'About Us' },
  { id: 'kaaba', label: 'Tiny Kaaba', emoji: '🕋', location: 'Our Sectors' },
  { id: 'lantern', label: 'Little Lantern', emoji: '🏮', location: 'All Products' },
  { id: 'brush', label: 'Paint Splash', emoji: '🎨', location: 'Colouring Studio' },
  { id: 'compass', label: 'Journey Compass', emoji: '🧭', location: 'Hajj Journey' },
];
