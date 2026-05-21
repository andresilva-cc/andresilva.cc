'use client';

/*
 * CopyButton — client island for the code-block copy affordance.
 *
 * Server/client split: PreShiki (server) extracts the plain-text code string
 * from the React node tree at render time and passes it as a prop, so this
 * component never touches the DOM to read text. All clipboard logic is local
 * to this island; no context or global state is involved.
 *
 * Behavior:
 *   - Writes `code` to the clipboard via navigator.clipboard.writeText.
 *   - Swaps the button label from "copy" → "copied" for 1500ms, then reverts.
 *   - A sr-only <span role="status"> announces the change to screen readers
 *     without polluting the visible label timing.
 *   - If navigator.clipboard is unavailable (insecure context, permission
 *     denied, focus lost) the click handler returns silently — no throw,
 *     no visible error state. Degradation is invisible to the user.
 */

import { useEffect, useRef, useState } from 'react';

export interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = async () => {
    if (!navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    }
    catch {
      // clipboard denied (permission, focus lost, etc.) — silent fail
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Copy code to clipboard"
        className="absolute top-2 right-3 font-mono text-meta text-fg-subtle hover:text-accent opacity-0 motion-safe:transition-opacity motion-safe:duration-fast group-hover/pre:opacity-100 cursor-pointer bg-transparent border-0 p-0"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
    </>
  );
}
