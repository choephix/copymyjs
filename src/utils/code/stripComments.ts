/**
 * Strips both single-line and multi-line comments from JavaScript/TypeScript code
 * @param code The JavaScript/TypeScript code string to process
 * @returns The code with all comments removed
 */
export function stripComments(code: string): string {
  // Remove single-line comments
  let result = code.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove empty lines that may have been left by removed comments
  result = result.replace(/^\s*[\r\n]/gm, '');
  
  return result.trim();
} 
