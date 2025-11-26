'use client';

import { clsx } from 'clsx';

interface JsonNodeProps {
  nodeKey: string;
  value: any;
  path: string;
  searchQuery?: string;
  searchMatches?: string[];
  currentMatchIndex?: number;
  currentMatchPath?: string;
  expandedPaths: Set<string>;
  setExpandedPaths: (paths: Set<string>) => void;
}

export function JsonNode({ 
  nodeKey, 
  value, 
  path, 
  searchQuery = '', 
  searchMatches = [],
  currentMatchPath = '',
  expandedPaths, 
  setExpandedPaths 
}: JsonNodeProps) {
  const isExpanded = expandedPaths.has(path);
  const type = value === null ? 'null' : typeof value;
  const isObject = type === 'object' && value !== null;
  const isArray = Array.isArray(value);
  const isLeaf = !isObject;
  
  const count = isArray ? value.length : isObject ? Object.keys(value).length : 0;
  
  const isMatch = searchMatches.includes(path);
  const isCurrentMatch = path === currentMatchPath;

  const toggleExpand = () => {
    const newPaths = new Set(expandedPaths);
    if (isExpanded) {
      newPaths.delete(path);
    } else {
      newPaths.add(path);
    }
    setExpandedPaths(newPaths);
  };

  const renderValue = () => {
    if (isArray) return `Array[${count}]`;
    if (isObject) return `Object{${count}}`;
    if (type === 'string') return `"${value}"`;
    if (type === 'null') return 'null';
    return String(value);
  };

  return (
    <div className="text-[0.7rem]">
      <div
        data-path={path}
        onClick={isLeaf ? undefined : toggleExpand}
        className={clsx(
          'flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer',
          isCurrentMatch && 'bg-blue-200 dark:bg-blue-900',
          isMatch && !isCurrentMatch && 'bg-yellow-100 dark:bg-yellow-900/30',
          !isMatch && 'hover:bg-gray-100 dark:hover:bg-gray-800',
          isLeaf && 'cursor-default'
        )}
      >
        {!isLeaf && (
          <span className={clsx('transition-transform text-gray-500', isExpanded && 'rotate-90')}>
            ▶
          </span>
        )}
        {isLeaf && <span className="w-3" />}
        
        <span className="font-semibold text-blue-600 dark:text-blue-400">{nodeKey}:</span>
        <span className={clsx(
          type === 'string' && 'text-green-600 dark:text-green-400',
          type === 'number' && 'text-purple-600 dark:text-purple-400',
          type === 'boolean' && 'text-orange-600 dark:text-orange-400',
          type === 'null' && 'text-gray-500 dark:text-gray-400',
          (isArray || isObject) && 'text-gray-600 dark:text-gray-300'
        )}>
          {renderValue()}
        </span>
      </div>

      {isExpanded && !isLeaf && (
        <div className="ml-4 border-l border-gray-300 dark:border-gray-600 pl-2">
          {isArray
            ? value.map((item: any, index: number) => (
                <JsonNode
                  key={index}
                  nodeKey={String(index)}
                  value={item}
                  path={`${path}.${index}`}
                  searchQuery={searchQuery}
                  searchMatches={searchMatches}
                  currentMatchPath={currentMatchPath}
                  expandedPaths={expandedPaths}
                  setExpandedPaths={setExpandedPaths}
                />
              ))
            : Object.entries(value).map(([key, val]) => (
                <JsonNode
                  key={key}
                  nodeKey={key}
                  value={val}
                  path={`${path}.${key}`}
                  searchQuery={searchQuery}
                  searchMatches={searchMatches}
                  currentMatchPath={currentMatchPath}
                  expandedPaths={expandedPaths}
                  setExpandedPaths={setExpandedPaths}
                />
              ))}
        </div>
      )}
    </div>
  );
}
