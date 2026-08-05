import Image, { type StaticImageData } from 'next/image';

// The taped-print mount from the visual audit: the only frame raster content
// gets on this site. 1px hairline, 2px radius, no shadow, mono caption above.
// Spec: consulting/brand/visual-audit-2026-08-04.md §6.

interface TapedPrintProps {
  src: StaticImageData | string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export default function TapedPrint({
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
  sizes,
  className = '',
}: TapedPrintProps) {
  return (
    <figure className={className}>
      {caption && <figcaption className="anno anno-blue mb-3">{caption}</figcaption>}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full rounded-[2px]"
        style={{ border: '1px solid var(--color-hairline)' }}
      />
    </figure>
  );
}

export function PrintStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
      {children}
    </div>
  );
}
