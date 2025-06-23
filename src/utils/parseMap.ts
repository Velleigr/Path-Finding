import { Cell, GridState } from '../types/type';
import {createEmptyGrid } from './gridUtils';

export async function parseMapFile(url: string): Promise<{
  gridState: GridState;
  startCell: { row: number; col: number };
  endCells: { row: number; col: number }[];
  walls: [number, number, number, number][]}
> {
  
  const res = await fetch(url);
  const text = await res.text();
  console.log("Loaded map content:", text);

  // Split the text into lines and filter out empty lines
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');

  const [gridrows, gridcols] = JSON.parse(lines[0]); // [5,11]
  
  const [startCol, startRow ] = parseTuple(lines[1]) as [number, number]; // (0,1)
  
  const goals = lines[2].split('|').map(s => {
    const [col, row] = parseTuple(s.trim());  
    return [row, col] as [number, number];
  });

  const wallLines = lines.slice(3);
  const walls = wallLines.map(line => parseTuple(line.trim()) as [number, number, number, number]); // (x,y,w,h)

  // Create grid
  const grid = createEmptyGrid(gridrows, gridcols);
  
  // Initialize start cell
  const startCell = { row: startRow, col: startCol };
  // Set start and end cells
  grid[startRow][startCol].isStart = true;


  const endCells = goals.map(([row, col]) => ({ row, col }));

  for (const {row, col} of endCells) {
      grid[row][col].isEnd = true;
  }


  // Set walls
  for (const [x, y, w, h] of walls) {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        const wx = x + dx;
        const wy = y + dy;
        if (wx >= 0 && wy >= 0 && wy < gridrows && wx < gridcols) {
          grid[wy][wx].isWall = true;
        }
      }
    }
  }

  
  const gridState: GridState = {
    grid,
    startCell,
    endCells,
    isRunning: false,
    isFinished: false,
  };

  return {
    gridState,
    startCell,
    endCells, 
    walls
  };
}

function parseTuple(str: string): number[] {
  return str
    .replace(/[()\[\]]/g, '')
    .split(',')
    .map(s => parseInt(s.trim(), 10));
}
