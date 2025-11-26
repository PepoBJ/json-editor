function inferType(value: any): string {
  if (value === null) return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'long' : 'double';
  if (typeof value === 'string') return 'string';
  if (Array.isArray(value)) return 'array';
  return 'struct';
}

function generatePythonSchema(obj: any, indent = 1): string {
  const spaces = '    '.repeat(indent);
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'ArrayType(StringType())';
    const itemType = generatePythonSchema(obj[0], indent);
    return `ArrayType(${itemType})`;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const fields = Object.entries(obj).map(([key, value]) => {
      const type = inferType(value);
      if (type === 'struct') {
        return `${spaces}StructField("${key}", ${generatePythonSchema(value, indent + 1)}, True)`;
      } else if (type === 'array') {
        return `${spaces}StructField("${key}", ${generatePythonSchema(value, indent)}, True)`;
      } else {
        const sparkType = type === 'long' ? 'LongType' : type === 'double' ? 'DoubleType' : type === 'boolean' ? 'BooleanType' : 'StringType';
        return `${spaces}StructField("${key}", ${sparkType}(), True)`;
      }
    });
    return `StructType([\n${fields.join(',\n')}\n${spaces.slice(4)}])`;
  }
  
  const type = inferType(obj);
  return type === 'long' ? 'LongType()' : type === 'double' ? 'DoubleType()' : type === 'boolean' ? 'BooleanType()' : 'StringType()';
}

function generateScalaSchema(obj: any, indent = 1): string {
  const spaces = '  '.repeat(indent);
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'ArrayType(StringType)';
    const itemType = generateScalaSchema(obj[0], indent);
    return `ArrayType(${itemType})`;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const fields = Object.entries(obj).map(([key, value]) => {
      const type = inferType(value);
      if (type === 'struct') {
        return `${spaces}StructField("${key}", ${generateScalaSchema(value, indent + 1)}, nullable = true)`;
      } else if (type === 'array') {
        return `${spaces}StructField("${key}", ${generateScalaSchema(value, indent)}, nullable = true)`;
      } else {
        const sparkType = type === 'long' ? 'LongType' : type === 'double' ? 'DoubleType' : type === 'boolean' ? 'BooleanType' : 'StringType';
        return `${spaces}StructField("${key}", ${sparkType}, nullable = true)`;
      }
    });
    return `StructType(Array(\n${fields.join(',\n')}\n${spaces.slice(2)}))`;
  }
  
  const type = inferType(obj);
  return type === 'long' ? 'LongType' : type === 'double' ? 'DoubleType' : type === 'boolean' ? 'BooleanType' : 'StringType';
}

export function toSparkSchema(data: any): string {
  const schema = generatePythonSchema(data);
  return `from pyspark.sql.types import *\n\nschema = ${schema}`;
}

export function toSparkScalaSchema(data: any): string {
  const schema = generateScalaSchema(data);
  return `import org.apache.spark.sql.types._\n\nval schema = ${schema}`;
}

