// Core types for JSON Tool

export type Theme = 'light' | 'dark';

export type ViewMode = 'editor' | 'tree' | 'split';

export type ExportFormat = 'yaml' | 'xml' | 'csv' | 'spark-python' | 'spark-scala';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  data: any;
}

export interface JsonNode {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
  path: string;
  children?: JsonNode[];
  count?: number;
}

export interface SearchMatch {
  path: string;
  node: HTMLElement;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface JsonStats {
  lines: number;
  chars: number;
  size: number;
}

export interface CompareResult {
  added: string[];
  removed: string[];
  modified: Array<{ path: string; oldValue: any; newValue: any }>;
}
