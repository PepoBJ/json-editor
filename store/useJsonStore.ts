import { create } from 'zustand';
import { Theme, ViewMode, ValidationResult, JsonStats, ToastMessage } from '@/types';
import { validateJson, formatJson, minifyJson, calculateStats } from '@/lib/core/json-utils';

interface JsonStore {
  // Content
  jsonContent: string;
  parsedData: any;
  validationResult: ValidationResult;
  
  // UI State
  theme: Theme;
  viewMode: ViewMode;
  expandedPaths: string[];
  selectedPath: string | null;
  
  // Search
  searchQuery: string;
  searchMatches: string[];
  currentMatchIndex: number;
  
  // Stats
  stats: JsonStats;
  
  // Toasts
  toasts: ToastMessage[];
  
  // Actions
  setJsonContent: (content: string) => void;
  validateAndParse: () => void;
  formatContent: () => void;
  minifyContent: () => void;
  clearContent: () => void;
  
  // UI Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setViewMode: (mode: ViewMode) => void;
  togglePath: (path: string) => void;
  selectPath: (path: string | null) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Search Actions
  setSearchQuery: (query: string) => void;
  nextMatch: () => void;
  prevMatch: () => void;
  
  // Toast Actions
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

export const useJsonStore = create<JsonStore>((set, get) => ({
  // Initial State
  jsonContent: '',
  parsedData: null,
  validationResult: { isValid: false, error: null, data: null },
  theme: (typeof window !== 'undefined' && localStorage.getItem('json-tool-theme') as Theme) || 'light',
  viewMode: 'split',
  expandedPaths: [],
  selectedPath: null,
  searchQuery: '',
  searchMatches: [],
  currentMatchIndex: -1,
  stats: { lines: 0, chars: 0, size: 0 },
  toasts: [],

  // Content Actions
  setJsonContent: (content: string) => {
    set({ jsonContent: content, stats: calculateStats(content) });
    get().validateAndParse();
  },

  validateAndParse: () => {
    const { jsonContent } = get();
    const result = validateJson(jsonContent);
    set({ validationResult: result, parsedData: result.data });
  },

  formatContent: () => {
    const { parsedData } = get();
    if (parsedData) {
      const formatted = formatJson(parsedData);
      set({ jsonContent: formatted, stats: calculateStats(formatted) });
      get().addToast('JSON formatted', 'success');
    } else {
      get().addToast('Cannot format invalid JSON', 'error');
    }
  },

  minifyContent: () => {
    const { parsedData } = get();
    if (parsedData) {
      const minified = minifyJson(parsedData);
      set({ jsonContent: minified, stats: calculateStats(minified) });
      get().addToast('JSON minified', 'success');
    } else {
      get().addToast('Cannot minify invalid JSON', 'error');
    }
  },

  clearContent: () => {
    set({
      jsonContent: '',
      parsedData: null,
      validationResult: { isValid: false, error: null, data: null },
      stats: { lines: 0, chars: 0, size: 0 },
      expandedPaths: new Set(),
      selectedPath: null,
    });
  },

  // UI Actions
  setTheme: (theme: Theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('json-tool-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  togglePath: (path: string) => {
    const { expandedPaths } = get();
    const isExpanded = expandedPaths.includes(path);
    set({ 
      expandedPaths: isExpanded 
        ? expandedPaths.filter(p => p !== path)
        : [...expandedPaths, path]
    });
  },

  selectPath: (path: string | null) => {
    set({ selectedPath: path });
  },

  expandAll: () => {
    // Will be populated by tree component
    set({ expandedPaths: [] });
  },

  collapseAll: () => {
    set({ expandedPaths: [] });
  },

  // Search Actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentMatchIndex: query ? 0 : -1 });
  },

  nextMatch: () => {
    const { searchMatches, currentMatchIndex } = get();
    if (searchMatches.length > 0) {
      set({ currentMatchIndex: (currentMatchIndex + 1) % searchMatches.length });
    }
  },

  prevMatch: () => {
    const { searchMatches, currentMatchIndex } = get();
    if (searchMatches.length > 0) {
      set({ 
        currentMatchIndex: currentMatchIndex <= 0 
          ? searchMatches.length - 1 
          : currentMatchIndex - 1 
      });
    }
  },

  // Toast Actions
  addToast: (message: string, type: ToastMessage['type']) => {
    const { toasts } = get();
    const id = Date.now().toString();
    const newToast = { id, message, type };
    
    // Limit to 3 toasts
    const updatedToasts = [...toasts, newToast].slice(-3);
    set({ toasts: updatedToasts });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },
}));
