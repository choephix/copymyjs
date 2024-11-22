/**
 * Strips TypeScript type annotations and generics from code, effectively converting it to JavaScript
 * @param code The TypeScript code string to process
 * @returns The code with all type annotations removed
 */
export function stripTypes(code: string): string {
  return code
    // Remove type annotations after colons
    .replace(/:\s*([^=>;,}\)\]\n]+)/g, '')
    
    // Remove generic type parameters
    .replace(/<[^<>]+>/g, '')
    
    // Remove interface declarations
    .replace(/\binterface\s+\w+\s*{[\s\S]*?}/g, '')
    
    // Remove type declarations
    .replace(/\btype\s+\w+\s*=\s*[^;]+;/g, '')
    
    // Remove 'as' type assertions
    .replace(/\bas\s+[^;,)\]}]+/g, '')
    
    // Clean up any double semicolons that might have been left
    .replace(/;;/g, ';')
    
    // Clean up extra whitespace and empty lines
    .replace(/^\s*[\r\n]/gm, '')
    .trim();
} 
