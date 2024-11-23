/**
 * Creates a 3D array of coordinate triplets within specified ranges
 * @param xRange Range for x coordinates [start, end)
 * @param yRange Range for y coordinates [start, end)
 * @param zRange Range for z coordinates [start, end)
 * @returns Array of [x, y, z] coordinate triplets
 */
export function range3D(
  xRange: [number, number],
  yRange: [number, number],
  zRange: [number, number]
): [number, number, number][] {
  const [xStart, xEnd] = xRange;
  const [yStart, yEnd] = yRange;
  const [zStart, zEnd] = zRange;
  
  const result: [number, number, number][] = [];
  
  for (let z = zStart; z < zEnd; z++) {
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        result.push([x, y, z]);
      }
    }
  }
  
  return result;
} 
