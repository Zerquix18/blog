import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else {
        setTheme('system');
      }
    } catch {
      setTheme('system');
    }
  }, []);

  const toggle = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const current = (root.getAttribute('data-theme') as 'light' | 'dark' | null);
    let next: 'light' | 'dark';
    if (current === 'dark') next = 'light';
    else if (current === 'light') next = 'dark';
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      next = prefersDark ? 'light' : 'dark';
    }
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
  };

  const label = theme === 'dark' ? 'Light mode' : theme === 'light' ? 'Dark mode' : 'Toggle theme';

  return (
    <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={toggle} title={label}>
      {theme === 'dark' ? '☀️' : theme === 'light' ? '🌙' : '🌓'}
    </button>
  );
}

