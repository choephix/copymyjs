const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Extracts a specific region from TypeScript code using region markers
 * @param code The TypeScript code string to process
 * @param regionName The name of the region to extract (case-insensitive)
 * @returns The code within the specified region, or the entire code if region not found
 */
export function extractRegion(code: string, regionName?: string): string {
  if (!regionName) return code;

  const regionRegex = new RegExp(
    `^[\\t ]*//\\s*#region\\s+${escapeRegExp(
      regionName
    )}\\s*\\r?\\n([\\s\\S]*?)\\r?\\n[\\t ]*//\\s*#endregion\\b.*$`,
    'im'
  );

  const match = code.match(regionRegex);
  if (!match) {
    console.warn(`⚠️ Region "${regionName}" not found in code`);
    return code;
  }

  return match[1].trim();
}
