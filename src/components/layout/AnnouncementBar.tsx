import { PREORDER_ANNOUNCEMENT } from '@/lib/site';

// Slim, site-wide notice above the navbar. Static server component — the copy
// lives in one place (PREORDER_SHIP_LABEL / PREORDER_ANNOUNCEMENT in lib/site).
export default function AnnouncementBar() {
  return (
    <div className="w-full bg-brand-purple px-6 py-2 text-center lg:px-8">
      <p className="font-fredoka text-xs font-semibold tracking-wide text-white sm:text-sm">
        {PREORDER_ANNOUNCEMENT}
      </p>
    </div>
  );
}
