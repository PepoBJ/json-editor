'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useJsonStore } from '@/store/useJsonStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useTheme } from '@/components/ui/ThemeProvider';

const AceEditor = dynamic(
  async () => {
    await import('ace-builds/src-noconflict/ace');
    await import('ace-builds/src-noconflict/theme-textmate');
    await import('ace-builds/src-noconflict/theme-monokai');
    await import('ace-builds/src-noconflict/mode-json');
    const ace = await import('react-ace');
    return ace;
  },
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-gray-500">Loading editor...</div> }
);

export function CodeEditor() {
  const { jsonContent, setJsonContent, validationResult } = useJsonStore();
  const { theme } = useTheme();
  const debouncedContent = useDebounce(jsonContent, 300);

  useEffect(() => {
    if (debouncedContent) {
      useJsonStore.getState().validateAndParse();
    }
  }, [debouncedContent]);

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900">
      <AceEditor
        mode="json"
        theme={theme === 'light' ? 'textmate' : 'monokai'}
        value={jsonContent}
        onChange={setJsonContent}
        name="json-editor"
        width="100%"
        height="100%"
        fontSize={11}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
        editorProps={{ $blockScrolling: true }}
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        }}
      />
    </div>
  );
}
