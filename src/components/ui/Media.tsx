import Image from 'next/image';
import { Placeholder } from './Placeholder';
import type { ShopifyImage } from '@/lib/shopify';

// Renders a Shopify image with next/image when available, otherwise falls back
// to the friendly emoji Placeholder. The `className` controls size / rounding /
// background and applies to both branches so layout stays identical either way.
type MediaProps = {
  image?: ShopifyImage;
  /** Caption + emoji shown only when no image is available. */
  label?: string;
  emoji?: string;
  className?: string;
  /** Responsive `sizes` hint for the optimizer. */
  sizes?: string;
  priority?: boolean;
  /** Extra classes on the <Image> itself — e.g. `object-bottom` to pick which
   *  edge survives the object-cover crop. */
  imageClassName?: string;
};

export function Media({
  image,
  label,
  emoji,
  className = '',
  sizes = '100vw',
  priority,
  imageClassName = '',
}: MediaProps) {
  if (!image?.src) {
    return <Placeholder className={className} label={label} emoji={emoji} />;
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={image.src}
        alt={image.alt || label || ''}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}
