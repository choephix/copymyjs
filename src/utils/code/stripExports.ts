export const stripExports = (code: string): string =>
  code
    // Handle default exports first so the declaration remains displayable.
    .replace(/\bexport\s+default\s+/g, '')
    // Handle exported declarations.
    .replace(
      /\bexport\s+(?=(?:async\s+)?(?:function|class)\b)/g,
      ''
    )
    .replace(
      /\bexport\s+(?=(?:interface|type|const|let|var|enum|namespace|module)\b)/g,
      ''
    )
    // Remove standalone export lists.
    .replace(/^\s*export\s+(?:type\s+)?\{[^}]*\}\s*;?\s*$/gm, '')
    .trim();
