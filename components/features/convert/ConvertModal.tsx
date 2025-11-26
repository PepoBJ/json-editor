'use client';

import { Modal } from '@/components/ui/Modal';
import { useJsonStore } from '@/store/useJsonStore';
import { useTheme } from '@/components/ui/ThemeProvider';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const AceEditor = dynamic(() => import('react-ace').then(mod => mod.default), { ssr: false });

const loadAceModes = async () => {
  await import('ace-builds/src-noconflict/ace');
  await import('ace-builds/src-noconflict/theme-monokai');
  await import('ace-builds/src-noconflict/theme-textmate');
  await import('ace-builds/src-noconflict/mode-python');
  await import('ace-builds/src-noconflict/mode-scala');
  await import('ace-builds/src-noconflict/mode-xml');
  await import('ace-builds/src-noconflict/mode-yaml');
  await import('ace-builds/src-noconflict/mode-text');
};

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  output: string;
  mode: string;
}

export function ConvertModal({ isOpen, onClose, output, mode }: ConvertModalProps) {
  const { addToast } = useJsonStore();
  const { theme } = useTheme();

  useEffect(() => {
    loadAceModes();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      addToast('Copied to clipboard!', 'success');
    } catch (error) {
      addToast('Failed to copy', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Converted Output"
      footer={
        <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2 py-1 text-[0.7rem] font-medium rounded bg-emerald-600 dark:bg-emerald-500 text-white border-0 hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-md hover:-translate-y-px transition-all duration-150 shadow-sm">
          Copy
        </button>
      }
    >
      <div className="h-full border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
        <AceEditor
          mode={mode}
          theme={theme === 'light' ? 'textmate' : 'monokai'}
          value={output}
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
    </Modal>
  );
}
