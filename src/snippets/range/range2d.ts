/**
 * Creates a 2D array of coordinate pairs within specified ranges
 * @param xRange Range for x coordinates [start, end)
 * @param yRange Range for y coordinates [start, end)
 * @returns Array of [x, y] coordinate pairs
 */
export function range2D(
  xRange: [number, number],
  yRange: [number, number]
): [number, number][] {
  const [xStart, xEnd] = xRange;
  const [yStart, yEnd] = yRange;
  
  const result: [number, number][] = [];
  
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      result.push([x, y]);
    }
  }
  
  return result;
} 
