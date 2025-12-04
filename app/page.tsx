'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/features/toolbar/Header';
import { ViewToggle } from '@/components/features/toolbar/ViewToggle';
import { StatusBar } from '@/components/features/toolbar/StatusBar';
import { CodeEditor } from '@/components/features/editor/CodeEditor';
import { TreeView } from '@/components/features/tree-view/TreeView';
import { TableView } from '@/components/features/table-view/TableView';
import { ToastContainer } from '@/components/ui/Toast';
import { PrivacyBanner } from '@/components/ui/PrivacyBanner';
import { Tour } from '@/components/ui/Tour';
import { useJsonStore } from '@/store/useJsonStore';
import { clsx } from 'clsx';

export default function Home() {
  const { viewMode, setViewMode } = useJsonStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Establecer vista inicial basada en tamaño de pantalla
    if (window.innerWidth <= 768 && viewMode === 'split') {
      setViewMode('editor');
    }

    const handleResize = () => {
      if (window.innerWidth <= 768 && viewMode === 'split') {
        setViewMode('editor');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <ViewToggle />
          
          <main className="flex-1 overflow-hidden">
            <div className={clsx(
              'h-full',
              viewMode === 'split' && 'grid grid-cols-2 gap-0'
            )}>
              <div className={clsx(
                'h-full overflow-hidden border-r border-gray-200 dark:border-gray-700',
                viewMode !== 'editor' && viewMode !== 'split' && 'hidden'
              )}>
                <CodeEditor />
              </div>
              
              <div className={clsx(
                'h-full overflow-hidden',
                viewMode !== 'tree' && viewMode !== 'split' && 'hidden'
              )}>
                <TreeView />
              </div>

              <div className={clsx(
                'h-full overflow-hidden',
                viewMode !== 'table' && 'hidden'
              )}>
                <TableView />
              </div>
            </div>
          </main>
        </div>
        
        <StatusBar />
        <PrivacyBanner />
        <ToastContainer />
        <Tour />
      </div>
  );
}

