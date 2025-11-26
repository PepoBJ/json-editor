'use client';

import { useEffect, useRef } from 'react';
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
  const editorRef = useRef<any>(null);
  const markerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (debouncedContent) {
      useJsonStore.getState().validateAndParse();
    }
  }, [debouncedContent]);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current.editor;
    
    // Clear previous marker
    if (markerIdRef.current !== null) {
      editor.session.removeMarker(markerIdRef.current);
      markerIdRef.current = null;
    }

    // Add error marker if invalid
    if (!validationResult.isValid && validationResult.error && jsonContent) {
      try {
        JSON.parse(jsonContent);
      } catch (e: any) {
        const errorMsg = e.message;
        const match = errorMsg.match(/position (\d+)/i);
        
        if (match) {
          const position = parseInt(match[1]);
          let currentPos = 0;
          let errorLine = 0;
          const lines = jsonContent.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            if (currentPos + lines[i].length >= position) {
              errorLine = i;
              break;
            }
            currentPos += lines[i].length + 1;
          }
          
          const Range = (window as any).ace.require('ace/range').Range;
          markerIdRef.current = editor.session.addMarker(
            new Range(errorLine, 0, errorLine, 1000),
            'bg-red-100 dark:bg-red-900/30',
            'fullLine',
            false
          );
        }
      }
    }
  }, [validationResult, jsonContent]);

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900">
      <AceEditor
        ref={editorRef}
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
