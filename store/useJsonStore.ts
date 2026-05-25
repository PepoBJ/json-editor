import { create } from 'zustand';
import { ViewMode, ValidationResult, JsonStats, ToastMessage } from '@/types';
import { validateJson, formatJson, minifyJson, calculateStats } from '@/lib/core/json-utils';

interface JsonStore {
  // Content
  jsonContent: string;
  parsedData: any;
  validationResult: ValidationResult;
  
  // UI State
  viewMode: ViewMode;
  selectedPath: string | null;
  
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
  setViewMode: (mode: ViewMode) => void;
  selectPath: (path: string | null) => void;
  
  // Toast Actions
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

export const useJsonStore = create<JsonStore>((set, get) => ({
  // Initial State
  jsonContent: '',
  parsedData: null,
  validationResult: { isValid: false, error: null, data: null },
  viewMode: 'split',
  selectedPath: null,
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
      selectedPath: null,
    });
  },

  // UI Actions
  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  selectPath: (path: string | null) => {
    set({ selectedPath: path });
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
