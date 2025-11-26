export function toCSV(data: any): string {
  if (!Array.isArray(data)) {
    throw new Error('CSV conversion requires an array of objects');
  }
  
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(h => {
      const val = obj[h];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n') 
        ? `"${str.replace(/"/g, '""')}"` 
        : str;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}
