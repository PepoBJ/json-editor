'use client';

import { useState, useMemo } from 'react';
import { useJsonStore } from '@/store/useJsonStore';
import { useTheme } from '@/components/ui/ThemeProvider';
import JSONGrid from '@redheadphone/react-json-grid';

export function TableView() {
  const { parsedData, validationResult } = useJsonStore();
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState('');

  // Custom theme que cambia según light/dark
  const customTheme = useMemo(() => {
    if (theme === 'dark') {
      return {
        bgColor: '#111827',
        borderColor: '#374151',
        cellBorderColor: '#374151',
        keyColor: '#34d399',
        indexColor: '#9ca3af',
        numberColor: '#10b981',
        booleanColor: '#10b981',
        stringColor: '#6ee7b7',
        objectColor: '#34d399',
        tableHeaderBgColor: '#1f2937',
        tableIconColor: '#10b981',
        selectHighlightBgColor: '#1f2937',
        searchHighlightBgColor: '#065f46'
      };
    } else {
      return {
        bgColor: '#ffffff',
        borderColor: '#e5e7eb',
        cellBorderColor: '#e5e7eb',
        keyColor: '#059669',
        indexColor: '#6b7280',
        numberColor: '#10b981',
        booleanColor: '#10b981',
        stringColor: '#047857',
        objectColor: '#059669',
        tableHeaderBgColor: '#f9fafb',
        tableIconColor: '#10b981',
        selectHighlightBgColor: '#f3f4f6',
        searchHighlightBgColor: '#d1fae5'
      };
    }
  }, [theme]);

  if (!validationResult.isValid) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Invalid JSON
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No JSON data to display
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <style jsx global>{`
        .json-grid-container,
        .json-grid-container * {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          font-size: 0.75rem !important;
          line-height: 1.25rem !important;
        }
      `}</style>

      <div className="flex items-center justify-between gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="🔍 Search..."
            className="px-3 py-1 text-[0.7rem] bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <JSONGrid
          key={theme}
          data={parsedData}
          customTheme={customTheme}
          searchText={searchText || undefined}
          defaultExpandDepth={0}
          highlightSelected={true}
        />
      </div>
    </div>
  );
}
