function objectToXML(obj: any, indent: number): string {
  const spaces = '  '.repeat(indent);
  let xml = '';
  
  if (obj === null) return `${spaces}<null/>\n`;
  if (typeof obj !== 'object') return `${spaces}<value>${obj}</value>\n`;
  
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      xml += `${spaces}<item index="${i}">\n`;
      xml += objectToXML(item, indent + 1);
      xml += `${spaces}</item>\n`;
    });
    return xml;
  }
  
  Object.entries(obj).forEach(([key, value]) => {
    const tag = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    if (typeof value === 'object' && value !== null) {
      xml += `${spaces}<${tag}>\n`;
      xml += objectToXML(value, indent + 1);
      xml += `${spaces}</${tag}>\n`;
    } else {
      xml += `${spaces}<${tag}>${value}</${tag}>\n`;
    }
  });
  
  return xml;
}

export function toXML(data: any): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
  xml += objectToXML(data, 1);
  xml += '</root>';
  return xml;
}
