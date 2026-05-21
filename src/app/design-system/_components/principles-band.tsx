import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

export function PrinciplesBand() {
  return (
    <section id="principles" aria-labelledby="principles-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 01 / what we won&#x2019;t compromise on" title="Design principles" id="principles-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Nineteen rules. Each one is load-bearing &mdash; removing it would compromise either consistency,
        accessibility, or affordance hygiene. They override local taste.
      </Text>
      <div className="mt-4">

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">01</Text>
            Accent lands on the
            {' '}
            <span className="text-accent">surface&#x2019;s primary noun</span>
            .
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Home hero is an identity statement, so the position carries
            {' '}
            <code className="text-accent">--color-accent</code>
            . Career list is a comparative timeline, so the company carries
            {' '}
            <code className="text-accent">--color-accent</code>
            . The rule is single and global; only the referent changes per surface.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">02</Text>
            Chip hover is
            {' '}
            <span className="text-accent">texture</span>
            , not affordance.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            <code className="text-accent">&lt;Tag&gt;</code>
            {' '}
            hover only nudges the border color &mdash; no background fill, no underline. Chips are categorical
            labels, not click targets, so the hover signals ambient texture rather than button-promise.
            Gated to
            {' '}
            <code className="text-accent">@media (hover: hover) and (prefers-reduced-motion: no-preference)</code>
            .
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">03</Text>
            Card lists are
            {' '}
            <span className="text-accent">&lt;ul&gt;/&lt;li&gt;</span>
            ; card titles are non-heading elements.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Every project, career role, article entry, and home-Latest row is a database row rendered
            visually &mdash; not a sub-section. The document outline is
            {' '}
            <code className="text-accent">page-h1 &rarr; list-of-items</code>
            , so card titles use
            {' '}
            <code className="text-accent">&lt;RoleCard&gt;</code>
            {' '}
            (title rendered as
            {' '}
            <code className="text-accent">&lt;p&gt;</code>
            ), not
            {' '}
            <code className="text-accent">&lt;h3&gt;</code>
            .
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">04</Text>
            Card components render as
            {' '}
            <span className="text-accent">&lt;li&gt;</span>
            {' '}
            directly &mdash; no inner &lt;article&gt;.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            The single-element pattern simplifies markup and CSS, and avoids screen readers announcing
            two landmarks for what the user reads as one card.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">05</Text>
            <span className="text-accent">Tabular figures</span>
            {' '}
            are unnecessary in monospace stacks.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            JetBrains Mono and VT323 are fixed-width by construction. The OpenType
            {' '}
            <code className="text-accent">tnum</code>
            {' '}
            feature and
            {' '}
            <code className="text-accent">font-variant-numeric: tabular-nums</code>
            {' '}
            are no-ops and create the false impression that the design depends on them.
            Don&#x2019;t reach for
            {' '}
            <code className="text-accent">tabular-nums</code>
            {' '}
            until the design ships a proportional face.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">06</Text>
            <span className="text-accent">:root</span>
            {' '}
            token blocks are canonical mirrors across all 5 pages.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            No shared stylesheet &mdash; each HTML preview carries its own
            {' '}
            <code className="text-accent">:root</code>
            . Tokens must stay byte-identical across all 5 files so future code generation against any single
            file produces the same token contract. Tokens not consumed on a given page are kept for parity,
            not pruned.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">07</Text>
            <span className="text-accent">flush</span>
            {' '}
            on SectionHead zeros both margin-bottom and border-bottom.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            When the next element provides its own top rule (a
            {' '}
            <code className="text-accent">&lt;GridFrame&gt;</code>
            {' '}
            or a list with a top border), the section head&#x2019;s bottom border would otherwise stack
            with it into a doubled 2px line at the seam. Zero both so the rule reads as a single 1px stroke.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">08</Text>
            <span className="text-accent">--photo-filter-soft</span>
            {' '}
            is mathematically derived from --photo-filter.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            The base portrait grade is
            {' '}
            <code className="text-accent">grayscale(1) contrast(0.95) brightness(1.02)</code>
            ; the soft variant eases contrast to
            {' '}
            <code className="text-accent">0.9</code>
            {' '}
            and lifts brightness to
            {' '}
            <code className="text-accent">1.04</code>
            . Touch devices are its only consumer &mdash; the hover/focus reveal that returns the photo to natural color is unreachable there, and the duotone tint plus scanline overlay never lift, so the photo needs a gentler grade to stay legible underneath them. When the base filter is re-tuned, the soft variant must be re-derived in parallel. The token is mirrored across all 5
            {' '}
            <code className="text-accent">:root</code>
            {' '}
            blocks for parity.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">09</Text>
            Prose uses
            {' '}
            <span className="text-accent">U+2019 / U+201C / U+201D</span>
            {' '}
            for apostrophes and quotes.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Straight
            {' '}
            <code className="text-accent">&apos;</code>
            {' '}
            and
            {' '}
            <code className="text-accent">&quot;</code>
            {' '}
            are reserved for HTML attributes, CSS strings, and script/comment internals.
            User-facing prose uses
            {' '}
            <code className="text-accent">&#x26;#x2019;</code>
            {' '}
            for apostrophes,
            {' '}
            <code className="text-accent">&#x26;#x201C; / &#x26;#x201D;</code>
            {' '}
            for double quotes.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">10</Text>
            <span className="text-accent">Grid</span>
            {' '}
            for identifier rows,
            {' '}
            <span className="text-accent">list</span>
            {' '}
            for content rows.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            A row earns a grid when its value is being one of many comparable items at a glance &mdash;
            career, projects, education cells, facts cells. A row earns a list when its value is its own
            internal content &mdash; articles, where shrinking an item to fit a peer damages the read.
            The article surface stays flush-to-shell intentionally; wrapping it to match career exposes
            asymmetric internal whitespace instead of aligning the two.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">11</Text>
            Inline connector glyphs in a heading &mdash;
            {' '}
            <span className="text-accent">@</span>
            ,
            {' '}
            <span className="text-accent">&#xB7;</span>
            ,
            {' '}
            <span className="text-accent">&mdash;</span>
            ,
            {' '}
            <span className="text-accent">/</span>
            ,
            {' '}
            <span className="text-accent">&#xD7;</span>
            {' '}
            &mdash; inherit the parent&#x2019;s size and line-height.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Differentiate them by color and weight only. Reserve size shifts for content that lives on its
            own line or in its own slot (metadata rows, eyebrows, captions), not for glyphs sharing a
            baseline with display text. This is why Home and Career both render the
            {' '}
            <code className="text-accent">@</code>
            {' '}
            at h3 scale despite the Career mock originally specifying meta-sized.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">12</Text>
            Brand mark &mdash; single source.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            The pixel-SVG &#x201C;A&#x201D; in
            {' '}
            <code className="text-accent">&lt;Wordmark&gt;</code>
            {' '}
            is the site&#x2019;s singular identity mark. It appears in three places only: the header
            wordmark, the favicon (and platform icon variants), and OG/social cards. Everywhere else
            &mdash; including PageHead titles like
            {' '}
            <code className="text-accent">&lt;ARTICLES /&gt;</code>
            {' '}
            &mdash; uses VT323 typeset text, which is type, not the mark. If a new surface needs identity,
            it inherits
            {' '}
            <code className="text-accent">&lt;Wordmark&gt;</code>
            ; it does not redraw an A in another font.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">13</Text>
            System chrome inherits
            {' '}
            <span className="text-accent">canvas tokens</span>
            {' '}
            &mdash; never OS defaults.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Scrollbars, selection highlight, focus rings, caret, and autofill backgrounds must each be
            explicitly themed to the dark canvas palette. A pale-grey native scrollbar or a Chrome-blue
            selection band on
            {' '}
            <code className="text-accent">--color-canvas</code>
            {' '}
            reads as a leak from the host OS and breaks the brutalist mono register; treat every
            UA-painted surface as in-scope for tokenisation.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">14</Text>
            Inline prose links default to
            {' '}
            <span className="text-accent">body color</span>
            {' '}
            and lift to
            {' '}
            <span className="text-accent">text-accent</span>
            {' '}
            on hover/focus.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Accent-at-rest is reserved for identity affordances (
            <code className="text-accent">&lt;ArrowLink&gt;</code>
            ,
            {' '}
            <code className="text-accent">&lt;Wordmark&gt;</code>
            , page-title accents) &mdash; links embedded in running prose are not identity moments and
            must not compete with them. Use
            {' '}
            <code className="text-accent">&lt;InlineLink&gt;</code>
            {' '}
            for any hyperlink that sits inside a sentence or paragraph; never apply
            {' '}
            <code className="text-accent">text-accent</code>
            {' '}
            directly to prose anchors at rest.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">15</Text>
            Prose measure follows the
            {' '}
            <span className="text-accent">text&#x2019;s role</span>
            , not its font size.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            A short terminal identity line meant to land as a single unit takes
            {' '}
            <code className="text-accent">max-w-prose-narrow</code>
            {' '}
            (56ch); multi-sentence narrative takes
            {' '}
            <code className="text-accent">max-w-prose-wide</code>
            {' '}
            (68ch); the About biography takes
            {' '}
            <code className="text-accent">max-w-prose-bio</code>
            {' '}
            (60ch); a card description takes
            {' '}
            <code className="text-accent">max-w-prose-card</code>
            {' '}
            (38ch) because the card column caps it; a figure caps at
            {' '}
            <code className="text-accent">max-w-prose-figure</code>
            {' '}
            (80ch). Two body-text blocks at different widths is a considered signal that they have different jobs, not drift.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">16</Text>
            Section heads delimit
            {' '}
            <span className="text-accent">subdivisions</span>
            , not pages.
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            A
            {' '}
            <code className="text-accent">&lt;SectionHead&gt;</code>
            {' '}
            (eyebrow + h2) is used only on pages with two or more content sections. A single-section page
            (Career, Projects, Articles) goes straight from the
            {' '}
            <code className="text-accent">PageHead</code>
            {' '}
            h1 into its content &mdash; a lone h2 that duplicates the h1 is a WCAG 2.4.6 regression.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">17</Text>
            <code className="text-accent">display</code>
            {' '}
            variant is
            {' '}
            <span className="text-accent">reserved for the home hero</span>
            {' '}
            &mdash; one instance on
            {' '}
            <code className="text-accent">/</code>
            .
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Single-page hero titles (articles, about, projects) use the
            {' '}
            <code className="text-accent">h1</code>
            {' '}
            variant instead.
            {' '}
            <code className="text-accent">display</code>
            {' '}
            carries the identity gesture (the blinking cursor); applying it elsewhere makes every page compete with Home for the &#x201C;this is Andr&#xe9;&#x201D; moment.
          </Text>
        </div>

        <div className="py-5 border-b border-rule">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">18</Text>
            Captioned-figure surfaces
            {' '}
            <span className="text-accent">never carry a hairline frame</span>
            .
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            Applies to
            {' '}
            <code className="text-accent">&lt;Figure&gt;</code>
            ,
            {' '}
            <code className="text-accent">&lt;YouTube&gt;</code>
            , and any future captioned-figure component. The
            {' '}
            <code className="text-accent">FigureCaption</code>
            {' '}
            row is the only thing that distinguishes them from prose; a hairline around the figure doubles the boundary and demotes it to &#x201C;content card&#x201D; &mdash; the editorial-magazine register this system rejects.
          </Text>
        </div>

        <div className="py-5 border-b border-rule last:border-b-0">
          <Text variant="body" as="p" className="font-semibold text-fg m-0">
            <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle mr-2">19</Text>
            Image-container framing is determined by whether
            {' '}
            <span className="text-accent">prose introduces the surface</span>
            .
          </Text>
          <Text variant="body" as="p" className="text-fg-muted max-w-prose-wide m-0 mt-2">
            <em>Identity surfaces</em>
            {' '}
            (hero art, stipple article cover, stipple card thumbnails, About portrait) carry
            {' '}
            <code className="text-accent">border border-rule</code>
            {' '}
            &mdash; no surrounding prose explains them; the hairline says &#x201C;deliberate object, not stray asset.&#x201D;
            {' '}
            <em>Referential surfaces</em>
            {' '}
            (
            <code className="text-accent">&lt;Figure&gt;</code>
            ,
            {' '}
            <code className="text-accent">&lt;YouTube&gt;</code>
            ,
            {' '}
            <code className="text-accent">&lt;ImageMdx&gt;</code>
            {' '}
            inside MDX prose) are frameless &mdash; the paragraph before and the caption row already supply the boundary. The test: does running prose introduce this image? Yes &rarr; frameless. No &rarr; hairline.
          </Text>
        </div>

      </div>
    </section>
  );
}
