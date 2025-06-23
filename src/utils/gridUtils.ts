import { Cell, GridState } from '../types/type';

export const createEmptyGrid = (grid_rows: number, grid_cols: number): Cell[][] => {
  return Array.from({ length: grid_rows }, (_, row) =>
    Array.from({ length: grid_cols }, (_, col) => ({
      row,
      col,
      isWall: false,
      isStart: false,
      isEnd: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      heuristic: 0,
      totalCost: 0,
      parent: null
    }))
  );
};

// export function createInitialGridState(): GridState {
//   const grid = createEmptyGrid();
//   const startRow = Math.floor(GRID_ROWS / 2);
//   const startCol = Math.floor(GRID_COLS / 4);
//   const endRow = Math.floor(GRID_ROWS / 2);
//   const endCol = Math.floor((GRID_COLS * 3) / 4);
  
//   grid[startRow][startCol].isStart = true;
//   grid[endRow][endCol].isEnd = true;
  
// const endPoints = [
//     { row: endRow, col: endCol },
//     // Add more end points as needed
// ];

// // Set all end points on the grid
// endPoints.forEach(point => {
//     grid[point.row][point.col].isEnd = true;
// });

// return {
//     grid,
//     startCell: { row: startRow, col: startCol },
//     endCell: endPoints,
//     isRunning: false,
//     isFinished: false,
// };
// }

export function resetGrid(currentGrid: Cell[][], startCell: { row: number; col: number }, endCell: { row: number; col: number }[]): Cell[][] {
  const newGrid = currentGrid.map(row =>
    row.map(cell => ({
      ...cell,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      parent: null,
    }))
  );
  
  newGrid[startCell.row][startCell.col].distance = 0;
  newGrid[startCell.row][startCell.col].totalCost = 0;
  
  return newGrid;
}

export function reconstructPath(endCell: Cell): Cell[] {
  const path: Cell[] = [];
  let current: Cell | null = endCell;
  
  while (current !== null) {
    path.unshift(current);
    current = current.parent;
  }
  
  return path;
}