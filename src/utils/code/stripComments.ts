type ScannerMode = 'code' | 'line-comment' | 'block-comment' | 'string';

/**
 * Strips both single-line and multi-line comments from JavaScript/TypeScript code
 * without removing comment-like text inside string literals.
 * @param code The JavaScript/TypeScript code string to process
 * @returns The code with all comments removed
 */
export function stripComments(code: string): string {
  let result = '';
  let mode: ScannerMode = 'code';
  let stringDelimiter = '';

  for (let index = 0; index < code.length; index++) {
    const char = code[index];
    const nextChar = code[index + 1];

    if (mode === 'line-comment') {
      if (char === '\n' || char === '\r') {
        mode = 'code';
        result += char;
      }
      continue;
    }

    if (mode === 'block-comment') {
      if (char === '*' && nextChar === '/') {
        mode = 'code';
        index++;
        continue;
      }

      if (char === '\n' || char === '\r') {
        result += char;
      }
      continue;
    }

    if (mode === 'string') {
      result += char;

      if (char === '\\') {
        index++;
        result += code[index] ?? '';
        continue;
      }

      if (char === stringDelimiter) {
        mode = 'code';
        stringDelimiter = '';
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      mode = 'line-comment';
      index++;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      mode = 'block-comment';
      index++;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      mode = 'string';
      stringDelimiter = char;
    }

    result += char;
  }

  return result.replace(/^\s*[\r\n]/gm, '').trim();
}
