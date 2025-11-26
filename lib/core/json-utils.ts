import { ValidationResult, JsonStats } from '@/types';

/**
 * Validate JSON string
 */
export function validateJson(jsonString: string): ValidationResult {
  if (!jsonString || !jsonString.trim()) {
    return { isValid: false, error: 'Empty input', data: null };
  }
  
  try {
    const data = JSON.parse(jsonString);
    return { isValid: true, error: null, data };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON', 
      data: null 
    };
  }
}

/**
 * Format JSON with 2-space indentation
 */
export function formatJson(data: any): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Minify JSON (remove whitespace)
 */
export function minifyJson(data: any): string {
  return JSON.stringify(data);
}

/**
 * Calculate JSON statistics
 */
export function calculateStats(content: string): JsonStats {
  const lines = content.split('\n').length;
  const chars = content.length;
  const size = new Blob([content]).size;
  
  return { lines, chars, size };
}

/**
 * Escape HTML for safe rendering
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Download content as file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}
