import { StippleArt } from '@/components/stipple-art';

/*
 * HeroArt — the home hero's stipple ASCII plasma, rendered in two
 * responsive forms. Stipple art is treated as site identity, not
 * decoration, so it appears at every breakpoint:
 *
 *  - >= lg: a 296x200 box in the hero's right column, animating
 *    (mode="always").
 *  - < lg: a full-width band below the pitch, rendered as a single
 *    static frame (mode="static") — no animation loop, so it costs a
 *    phone zero ongoing CPU/battery while still showing the identity.
 *
 * Both use the acid palette (black→lime→white, the site's lime accent)
 * and the `classic` plasma mode — a centerless interference field that
 * reads as texture, not a figure. Framed with a border-rule hairline,
 * matching the article thumbnails. The embed renders its own permalink
 * badge (link="badge") so visitors can open it in stipple.
 *
 * Rendered as two instances (one per breakpoint) rather than a single
 * media-query-driven one: it keeps the component SSR-safe with no
 * client-side measurement, and the embed's IntersectionObserver means
 * only the on-screen instance ever does any work.
 */
const PLASMA_CONFIG = 'p=plasma&palette=acid&mode=classic&density=0.4&freq=1.5';
const ART_CLASS = 'font-mono text-fg-muted m-0 p-0 select-none block overflow-hidden';

export function HeroArt() {
  return (
    <>
      {/* Desktop — fixed 296x200 box in the hero's right column; animates. */}
      <div className="hidden shrink-0 border border-rule overflow-hidden lg:block">
        <StippleArt
          mode="always"
          config={PLASMA_CONFIG}
          link="badge"
          fit="cover"
          cols={64}
          rows={26}
          className={ART_CLASS}
          style={{ width: 'var(--hero-art-w)', height: 'var(--hero-art-h)' }}
        />
      </div>
      {/* Mobile — full-width band below the pitch; one static frame. */}
      <div className="border border-rule overflow-hidden lg:hidden">
        <StippleArt
          mode="static"
          config={PLASMA_CONFIG}
          link="badge"
          fit="cover"
          cols={72}
          rows={14}
          className={ART_CLASS}
          style={{ width: '100%', height: 'var(--hero-art-h-mobile)' }}
        />
      </div>
    </>
  );
}
