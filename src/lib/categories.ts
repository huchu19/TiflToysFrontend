// Curated category links shown in the footer's "All Collection" column. Each
// key is a Shopify collection handle; until a matching collection exists in
// Shopify, the collection page renders a friendly "coming soon" state so these
// links never 404. Create a collection with the same handle to light it up.
export const CATEGORY_LABELS: Record<string, string> = {
  educational: 'Educational Toys',
  infant: 'Infant Toys',
  diy: 'DIY Toys',
  other: 'Other Toys',
};

export function prettifyHandle(handle: string): string {
  return handle
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
