'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="btn btn-soft  btn-circle"
      aria-label="切换主题"
    >
      {theme === 'light' ? (
        <RiMoonLine className="w-5 h-5" />
      ) : (
        <RiSunLine className="w-5 h-5" />
      )}
    </button>
  );
}