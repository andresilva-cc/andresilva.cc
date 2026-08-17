import QRCode from 'qrcode';

// Quiet zone in modules — spec requires ≥4 modules of the light value
// (accent) on all four sides. See docs/resume-print-theme.md §2.
const QUIET_ZONE = 4;

export interface ResumeQrProps {
  url: string;
}

/*
 * ResumeQr — renders the QR block as plain SVG rects, not a rasterized
 * image. `QRCode.create()` is synchronous (no network, no canvas), so
 * this stays a plain server component with no async data fetch.
 *
 * Modules render in `currentColor` (ink) with no fill for light
 * modules — the plate's own accent background shows through,
 * satisfying "accent is fill-only, ink sits on top" without
 * duplicating the light color here. 60pt plate, header top-right per
 * docs/resume-print-theme.md §6.6.
 */
export function ResumeQr({ url }: ResumeQrProps) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
  const { size, data } = qr.modules;
  const dimension = size + QUIET_ZONE * 2;

  // Reads the flat bitmatrix directly (row-major: index = row * size +
  // col), mirroring qrcode's own SVG renderer (lib/renderer/svg-tag.js)
  // rather than calling modules.get(), whose BitMatrix.prototype.get
  // relies on `this` and breaks once destructured off the instance.
  const cells = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (data[row * size + col]) {
        cells.push(
          <rect key={`${col}-${row}`} x={col + QUIET_ZONE} y={row + QUIET_ZONE} width={1} height={1} />,
        );
      }
    }
  }

  return (
    <div className="inline-block shrink-0 leading-none bg-resume-accent">
      <svg
        viewBox={`0 0 ${dimension} ${dimension}`}
        shapeRendering="crispEdges"
        fill="currentColor"
        role="img"
        aria-label={`QR code linking to ${url}`}
        className="block h-[60pt] w-[60pt] text-resume-ink"
      >
        { cells }
      </svg>
    </div>
  );
}
