export function toYAML(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') return obj.includes(':') ? `"${obj}"` : obj;
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return '\n' + obj.map(item => `${spaces}- ${toYAML(item, indent + 1).trim()}`).join('\n');
  }
  
  const keys = Object.keys(obj);
  if (keys.length === 0) return '{}';
  
  return '\n' + keys.map(key => {
    const value = toYAML(obj[key], indent + 1);
    return value.startsWith('\n') ? `${spaces}${key}:${value}` : `${spaces}${key}: ${value}`;
  }).join('\n');
}
