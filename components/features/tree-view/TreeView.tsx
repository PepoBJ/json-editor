'use client';

import { useJsonStore } from '@/store/useJsonStore';
import { JsonNode } from './JsonNode';
import { useState, useEffect, useRef } from 'react';

export function TreeView() {
  const { parsedData, validationResult } = useJsonStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));
  const [searchMatches, setSearchMatches] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search logic - only finds matches, doesn't change expansion
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const matches: string[] = [];
    
    const searchInNode = (value: any, path: string, key: string) => {
      const matchesKey = key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesValue = String(value).toLowerCase().includes(searchQuery.toLowerCase());
      
      if (matchesKey || matchesValue) {
        matches.push(path);
      }
      
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            searchInNode(item, `${path}.${index}`, String(index));
          });
        } else {
          Object.entries(value).forEach(([k, v]) => {
            searchInNode(v, `${path}.${k}`, k);
          });
        }
      }
    };

    searchInNode(parsedData, 'root', 'root');
    setSearchMatches(matches);
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
  }, [searchQuery, parsedData]);

  const navigateMatch = (direction: number) => {
    if (searchMatches.length === 0) return;
    
    let newIndex = currentMatchIndex + direction;
    if (newIndex < 0) newIndex = searchMatches.length - 1;
    if (newIndex >= searchMatches.length) newIndex = 0;
    
    setCurrentMatchIndex(newIndex);
    
    // Expand all parent paths of the current match
    const matchPath = searchMatches[newIndex];
    const parts = matchPath.split('.');
    const newExpanded = new Set(expandedPaths);
    for (let i = 1; i <= parts.length; i++) {
      newExpanded.add(parts.slice(0, i).join('.'));
    }
    setExpandedPaths(newExpanded);
    
    // Scroll to match
    setTimeout(() => {
      const element = containerRef.current?.querySelector(`[data-path="${matchPath}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchMatches.length > 0) {
      navigateMatch(1); // Go to next match (or first if at end)
    }
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    const traverse = (obj: any, path: string) => {
      allPaths.add(path);
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          traverse(obj[key], `${path}.${key}`);
        });
      }
    };
    traverse(parsedData, 'root');
    setExpandedPaths(allPaths);
  };

  const collapseAll = () => {
    setExpandedPaths(new Set());
  };

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
      <div className="flex-shrink-0 flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="🔍 Search..."
          className="flex-1 px-2 py-1 text-[0.7rem] bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {searchQuery && (
          <>
            <button
              onClick={() => navigateMatch(-1)}
              disabled={searchMatches.length === 0}
              className="px-2 py-1 text-[0.7rem] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            >
              ↑
            </button>
            <button
              onClick={() => navigateMatch(1)}
              disabled={searchMatches.length === 0}
              className="px-2 py-1 text-[0.7rem] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            >
              ↓
            </button>
            <span className="text-[0.7rem] text-gray-600 dark:text-gray-400 min-w-[50px] text-center">
              {searchMatches.length > 0 ? `${currentMatchIndex + 1}/${searchMatches.length}` : '0/0'}
            </span>
          </>
        )}
        
        <button
          onClick={expandAll}
          className="px-2 py-1 text-[0.7rem] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-2 py-1 text-[0.7rem] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Collapse All
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900">
        <JsonNode
          nodeKey="root"
          value={parsedData}
          path="root"
          searchQuery={searchQuery}
          searchMatches={searchMatches}
          currentMatchPath={searchMatches[currentMatchIndex]}
          expandedPaths={expandedPaths}
          setExpandedPaths={setExpandedPaths}
        />
      </div>
    </div>
  );
}
