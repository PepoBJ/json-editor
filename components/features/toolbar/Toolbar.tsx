'use client';

import { useJsonStore } from '@/store/useJsonStore';
import { downloadFile, copyToClipboard } from '@/lib/core/json-utils';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';
import { CompareModal } from '@/components/features/compare/CompareModal';
import { ConvertModal } from '@/components/features/convert/ConvertModal';
import { HelpButton } from '@/components/ui/WelcomePopup';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { convertToYAML, convertToXML, convertToCSV, convertToSparkPython, convertToSparkScala } from '@/lib/converters';

const btnClass = "inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm";
const btnPrimaryClass = "inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-emerald-600 dark:bg-emerald-500 text-white border-0 hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm";

export function Toolbar() {
  const { 
    jsonContent, 
    formatContent, 
    minifyContent, 
    clearContent, 
    addToast,
    setJsonContent,
    parsedData
  } = useJsonStore();
  
  const { theme, toggleTheme } = useTheme();
  const [showConvert, setShowConvert] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertOutput, setConvertOutput] = useState('');
  const [convertMode, setConvertMode] = useState('text');
  const [mounted, setMounted] = useState(false);
  const convertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (convertRef.current && !convertRef.current.contains(e.target as Node)) {
        setShowConvert(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(jsonContent);
    addToast(success ? 'Copied to clipboard' : 'Failed to copy', success ? 'success' : 'error');
  };

  const handleDownload = () => {
    if (!jsonContent) {
      addToast('No content to download', 'error');
      return;
    }
    downloadFile(jsonContent, 'data.json');
    addToast('Downloaded', 'success');
  };

  useKeyboardShortcuts({
    onFormat: formatContent,
    onMinify: minifyContent,
    onClear: clearContent,
    onCopy: handleCopy,
    onCompare: () => setShowCompare(true),
  });

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      addToast('File loaded', 'success');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConvert = (type: string) => {
    if (!parsedData) {
      addToast('Invalid JSON', 'error');
      return;
    }
    
    let output = '';
    let mode = 'text';
    try {
      switch (type) {
        case 'yaml': 
          output = convertToYAML(parsedData);
          mode = 'yaml';
          break;
        case 'xml': 
          output = convertToXML(parsedData);
          mode = 'xml';
          break;
        case 'csv': 
          output = convertToCSV(parsedData);
          mode = 'text';
          break;
        case 'spark-python': 
          output = convertToSparkPython(parsedData);
          mode = 'python';
          break;
        case 'spark-scala': 
          output = convertToSparkScala(parsedData);
          mode = 'scala';
          break;
      }
      setConvertOutput(output);
      setConvertMode(mode);
      setShowConvertModal(true);
      setShowConvert(false);
    } catch (error) {
      addToast('Conversion failed', 'error');
    }
  };

  return (
    <>
      <div className="flex md:flex-row flex-col md:items-center items-stretch gap-1.5 flex-1 md:justify-end">
        <button onClick={formatContent} className={btnPrimaryClass} data-tour="format">
          ✨ Format
        </button>
        <button onClick={minifyContent} className={btnClass}>
          📦 Minify
        </button>
        <button onClick={() => useJsonStore.getState().validateAndParse()} className={btnClass}>
          ✓ Validate
        </button>
        <button onClick={clearContent} className={btnClass}>
          🗑️ Clear
        </button>
        <button onClick={handleCopy} className={btnClass}>
          📋 Copy
        </button>
        <label className={`${btnClass} cursor-pointer`}>
          📁 Load
          <input type="file" accept=".json" onChange={handleLoad} className="hidden" />
        </label>
        <button onClick={handleDownload} className={btnClass}>
          💾 Save
        </button>
        <button onClick={() => setShowCompare(true)} className={btnClass} data-tour="compare">
          ⚖️ Compare
        </button>
        
        <div className="relative" ref={convertRef} data-tour="convert">
          <select 
            value="" 
            onChange={(e) => e.target.value && handleConvert(e.target.value)}
            className="px-2 py-1 text-[0.7rem] font-medium rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 cursor-pointer shadow-sm hover:shadow-md transition-all duration-150"
          >
            <option value="">Convert...</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
            <option value="csv">CSV</option>
            <option value="spark-python">Spark (Python)</option>
            <option value="spark-scala">Spark (Scala)</option>
          </select>
        </div>
        
        <HelpButton />
        
        <button onClick={toggleTheme} className={btnClass}>
          <span className="text-[0.7rem]">{!mounted ? '🌙' : theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>

      <CompareModal isOpen={showCompare} onClose={() => setShowCompare(false)} />
      <ConvertModal isOpen={showConvertModal} onClose={() => setShowConvertModal(false)} output={convertOutput} mode={convertMode} />
    </>
  );
}
