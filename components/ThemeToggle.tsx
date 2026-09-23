'use client';

import { useEffect, useState } from 'react';

type Choice = 'system' | 'light' | 'dark';
const choices: Choice[] = ['system', 'light', 'dark'];

function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === 'system') delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === 'system') localStorage.removeItem('theme');
    else localStorage.setItem('theme', choice);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies for this visit.
  }
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>('system');

  // The pre-paint script in the root layout already applied any saved choice; mirror it here.
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with DOM state set before hydration
    if (t === 'light' || t === 'dark') setChoice(t);
  }, []);

  return (
    <div role="group" aria-label="Theme" className="flex rounded border border-line p-0.5 text-xs">
      {choices.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={choice === c}
          onClick={() => {
            setChoice(c);
            apply(c);
          }}
          className={`min-h-7 rounded-sm px-2.5 capitalize ${
            choice === c ? 'bg-ink text-bg' : 'text-muted hover:text-ink'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
