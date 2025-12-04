'use client';

import { useJsonStore } from '@/store/useJsonStore';
import { clsx } from 'clsx';
import { ViewMode } from '@/types';

export function ViewToggle() {
  const { viewMode, setViewMode } = useJsonStore();

  const views: { mode: ViewMode; label: string }[] = [
    { mode: 'editor', label: 'Editor' },
    { mode: 'tree', label: 'Tree' },
    { mode: 'table', label: 'Table' },
    { mode: 'split', label: 'Split' },
  ];

  return (
    <div className="flex flex-col gap-1 p-1 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-8" data-tour="view-toggle">
      {views.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={clsx(
            'py-6 px-1 text-[0.7rem] font-medium transition-all rounded border-l-2',
            '[writing-mode:vertical-rl] rotate-180',
            'font-sans',
            mode === 'split' && 'hidden md:block',
            viewMode === mode
              ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 border-l-emerald-600 dark:border-l-emerald-400 font-semibold'
              : 'bg-transparent text-gray-600 dark:text-gray-400 border-l-transparent hover:bg-white/50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-gray-100'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
