'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useJsonStore } from '@/store/useJsonStore';
import { useTheme } from '@/components/ui/ThemeProvider';
import dynamic from 'next/dynamic';

const AceEditor = dynamic(() => import('react-ace').then(mod => mod.default), { ssr: false });

const loadAceModes = async () => {
  await import('ace-builds/src-noconflict/ace');
  await import('ace-builds/src-noconflict/theme-monokai');
  await import('ace-builds/src-noconflict/theme-textmate');
  await import('ace-builds/src-noconflict/mode-json');
};

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LineDiff {
  lineNumber: number;
  line1: string;
  line2: string;
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const { jsonContent } = useJsonStore();
  const { theme } = useTheme();
  const [compareText, setCompareText] = useState('');
  const [diffs, setDiffs] = useState<LineDiff[]>([]);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);

  useEffect(() => {
    loadAceModes();
  }, []);

  const handleCompare = () => {
    setDiffs([]);
    setCurrentDiffIndex(0);
    
    try {
      const json1 = JSON.parse(jsonContent);
      const json2 = JSON.parse(compareText);
      
      const formatted1 = JSON.stringify(json1, null, 2);
      const formatted2 = JSON.stringify(json2, null, 2);
      
      const lines1 = formatted1.split('\n');
      const lines2 = formatted2.split('\n');
      
      const differences: LineDiff[] = [];
      const maxLines = Math.max(lines1.length, lines2.length);
      
      for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        
        if (line1 !== line2) {
          differences.push({
            lineNumber: i,
            line1: line1,
            line2: line2,
          });
        }
      }
      
      if (differences.length === 0) {
        alert('✓ No differences found');
      } else {
        differences.sort((a, b) => a.lineNumber - b.lineNumber);
        setDiffs(differences);
      }
    } catch (error) {
      alert('❌ Error: ' + (error instanceof Error ? error.message : 'Invalid JSON'));
    }
  };

  const navigateToDiff = (index: number) => {
    if (diffs.length === 0) return;
    
    let newIndex = index;
    if (index < 0) {
      newIndex = diffs.length - 1;
    } else if (index >= diffs.length) {
      newIndex = 0;
    }
    
    setCurrentDiffIndex(newIndex);
  };

  const currentDiff = diffs[currentDiffIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compare JSON"
      footer={
        <div className="flex items-center justify-between w-full">
          <button onClick={handleCompare} className="inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-emerald-600 dark:bg-emerald-500 text-white border-0 hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm">
            Compare
          </button>
          {diffs.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {diffs.length} line{diffs.length !== 1 ? 's' : ''} different
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateToDiff(currentDiffIndex - 1)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm"
                >
                  ← Prev
                </button>
                <span className="text-[0.7rem] font-mono text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                  {currentDiffIndex + 1} / {diffs.length}
                </span>
                <button
                  onClick={() => navigateToDiff(currentDiffIndex + 1)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-full gap-3">
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm">Original</h3>
            <div className="flex-1 min-h-0 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <AceEditor
                mode="json"
                theme={theme === 'light' ? 'textmate' : 'monokai'}
                value={jsonContent}
                readOnly
                width="100%"
                height="100%"
                fontSize={11}
                showPrintMargin={false}
                showGutter={true}
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 2,
                  useWorker: false,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm">Compare With</h3>
            <div className="flex-1 min-h-0 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <AceEditor
                mode="json"
                theme={theme === 'light' ? 'textmate' : 'monokai'}
                value={compareText}
                onChange={setCompareText}
                placeholder="Paste JSON to compare..."
                width="100%"
                height="100%"
                fontSize={11}
                showPrintMargin={false}
                showGutter={true}
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 2,
                  useWorker: false,
                }}
              />
            </div>
          </div>
        </div>
        {currentDiff && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600">
            <div className="font-mono text-xs space-y-2">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                Line {currentDiff.lineNumber + 1}
              </div>
              <div className="space-y-1">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  <span className="text-red-700 dark:text-red-300">- {currentDiff.line1 || '(empty)'}</span>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <span className="text-green-700 dark:text-green-300">+ {currentDiff.line2 || '(empty)'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
