'use client';

import { useState } from 'react';
import { X, Sparkles, Code2, FileJson, GitCompare, HelpCircle, Keyboard } from 'lucide-react';
import { shortcuts, getKeyDisplay } from '@/hooks/useKeyboardShortcuts';

export function HelpButton() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm"
        title="Help & Features"
      >
        <HelpCircle size={14} />
        Help
      </button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  JSON Tool Features
                </h2>
              </div>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Powerful JSON tools at your fingertips
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Features Column */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  Features
                </h3>
                <div className="space-y-3">
                  <Feature
                    icon={<Code2 size={18} />}
                    title="Format & Validate"
                    description="Beautify and validate JSON with syntax highlighting"
                  />
                  <Feature
                    icon={<FileJson size={18} />}
                    title="Convert to Multiple Formats"
                    description="Export to YAML, XML, CSV, Spark (Python/Scala)"
                  />
                  <Feature
                    icon={<GitCompare size={18} />}
                    title="Compare JSONs"
                    description="Side-by-side diff with line-by-line navigation"
                  />
                </div>
              </div>

              {/* Keyboard Shortcuts Column */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Keyboard size={16} className="text-emerald-500" />
                  Keyboard Shortcuts
                </h3>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {Object.entries(shortcuts).map(([key, shortcut]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-gray-900 dark:text-gray-100 text-[10px]">
                          {getKeyDisplay(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShow(false)}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors text-sm mt-6"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-500 mt-0.5">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
