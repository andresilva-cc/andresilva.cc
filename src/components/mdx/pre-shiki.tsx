import { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type DataLanguage = { 'data-language'?: string };

export type PreShikiProps = HTMLAttributes<HTMLPreElement> & DataLanguage & { children?: ReactNode };

/*
 * PreShiki — styled wrapper for the <pre> element emitted by rehype-pretty-code.
 *
 * rehype-pretty-code sets `data-language` on the <pre> when the fence carries a
 * language token (```ts, ```bash, etc.). This component renders the language as a
 * header strip above the code block per design spec §4.7.
 *
 * Container treatment:
 *   border border-rule                1px hairline all sides
 *   bg-surface                        one step lighter than canvas
 *   overflow-x-auto                   long lines scroll; no soft wrap
 *   py-4 px-5                         16px vertical, 20px horizontal
 *   my-6                              24px above and below
 *
 * Language label (when present):
 *   header strip above <pre>          border border-rule border-b-0
 *   bg-surface                        same surface as the code block
 *   text-micro font-semibold          eyebrow recipe (see §4.7)
 *   uppercase tracking-eyebrow text-fg-subtle
 *   -mt-px on <pre>                   collapses the doubled border
 *
 * Highlighted lines:
 *   rehype-pretty-code adds data-highlighted-line to the <span> wrapping
 *   each highlighted line. CSS handles the accent-tint bg and left rule.
 */
export function PreShiki(props: PreShikiProps) {
  const { className, children, ...rest } = props;

  const lang = props['data-language'];
  const hasLang = Boolean(lang);

  return (
    <div className="my-6 max-w-prose-wide">
      { hasLang && (
        <div className="border border-rule border-b-0 bg-surface px-5 py-1.5">
          <span className="text-micro font-mono font-semibold uppercase tracking-eyebrow text-fg-subtle">
            { lang }
          </span>
        </div>
      ) }
      <pre
        className={clsx(
          'border border-rule bg-surface overflow-x-auto py-4 px-5',
          hasLang && '-mt-px',
          className,
        )}
        {...rest}
      >
        { children }
      </pre>
    </div>
  );
}
