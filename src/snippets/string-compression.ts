/**
 * Compresses a string using DEFLATE algorithm and returns base64 encoded result
 * @param str String to compress
 * @returns Promise resolving to base64 encoded compressed string
 */
export async function compressWithStreams(str: string) {
  const compressed = await new Response(
    new Blob([str]).stream().pipeThrough(new CompressionStream('deflate'))
  ).blob();
  
  // Convert blob to base64 and remove the data URL prefix
  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove "data:application/octet-stream;base64," prefix
      resolve(base64.split(',')[1]);
    };
    reader.readAsDataURL(compressed);
  });
}

/**
 * Decompresses a base64 encoded compressed string
 * @param compressed Base64 encoded compressed string
 * @returns Promise resolving to original string
 */
export async function decompressWithStreams(compressed: string) {
  // Add the prefix back and convert to blob
  const binaryString = atob(compressed);
  const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
  const blob = new Blob([bytes]);
  
  const decompressed = await new Response(
    blob.stream().pipeThrough(new DecompressionStream('deflate'))
  ).blob();
  
  return await decompressed.text();
} 
