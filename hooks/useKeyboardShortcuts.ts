import { useEffect } from 'react';

export const shortcuts = {
  format: { key: 'f', ctrl: true, shift: true, description: 'Format JSON' },
  minify: { key: 'm', ctrl: true, shift: true, description: 'Minify JSON' },
  clear: { key: 'k', ctrl: true, shift: true, description: 'Clear editor' },
  copy: { key: 'c', ctrl: true, shift: true, description: 'Copy JSON' },
  compare: { key: 'd', ctrl: true, shift: true, description: 'Compare JSON' },
};

export const getKeyDisplay = (shortcut: typeof shortcuts[keyof typeof shortcuts]) => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlKey = isMac ? '⌘' : 'Ctrl';
  
  let keys = [];
  if (shortcut.ctrl) keys.push(ctrlKey);
  if (shortcut.shift) keys.push('Shift');
  keys.push(shortcut.key.toUpperCase());
  
  return keys.join(' + ');
};

interface UseKeyboardShortcutsProps {
  onFormat?: () => void;
  onMinify?: () => void;
  onClear?: () => void;
  onCopy?: () => void;
  onCompare?: () => void;
}

export function useKeyboardShortcuts(handlers: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // All shortcuts require Ctrl/Cmd + Shift
      if (!ctrlKey || !e.shiftKey) return;

      const key = e.key.toLowerCase();

      // Format: Ctrl/Cmd + Shift + F
      if (key === 'f') {
        e.preventDefault();
        handlers.onFormat?.();
      }
      // Minify: Ctrl/Cmd + Shift + M
      else if (key === 'm') {
        e.preventDefault();
        handlers.onMinify?.();
      }
      // Clear: Ctrl/Cmd + Shift + K
      else if (key === 'k') {
        e.preventDefault();
        handlers.onClear?.();
      }
      // Copy: Ctrl/Cmd + Shift + C
      else if (key === 'c') {
        e.preventDefault();
        handlers.onCopy?.();
      }
      // Compare: Ctrl/Cmd + Shift + D
      else if (key === 'd') {
        e.preventDefault();
        handlers.onCompare?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
