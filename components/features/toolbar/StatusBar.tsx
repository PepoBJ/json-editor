'use client';

import { useJsonStore } from '@/store/useJsonStore';
import { clsx } from 'clsx';

export function StatusBar() {
  const { stats, validationResult } = useJsonStore();

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-[0.7rem]">
      <div className={clsx(
        validationResult.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}>
        {validationResult.isValid ? '✓ Valid JSON' : validationResult.error || 'Ready'}
      </div>
      
      <div className="flex gap-4 text-gray-600 dark:text-gray-400">
        <span>Lines: {stats.lines}</span>
        <span>Chars: {stats.chars}</span>
        <span>Size: {(stats.size / 1024).toFixed(2)} KB</span>
      </div>
    </div>
  );
}
