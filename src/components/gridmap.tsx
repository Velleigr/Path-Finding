import React, { useState, useCallback } from 'react';
import CellComponent from './cell';
import { GridState } from '../types/type';

interface GridProps {
  gridState: GridState;
  //callback to update the grid after interactions.
  onGridChange: (newGrid: GridState) => void;
}

const GridComponent: React.FC<GridProps> = ({ gridState, onGridChange }) => {
  // State to manage mouse press and wall drawing
  // this support drawing walls by clicking and dragging
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [drawingWalls, setDrawingWalls] = useState(true);

  const rows = gridState.grid.length;
  const cols = gridState.grid[0].length;

  const MAX_GRID_WIDTH = 1000;  // Max container width in px
  const MAX_GRID_HEIGHT = 1000; // Max container height in px
  const MIN_CELL_SIZE = 14;    // Prevent too small
  const MAX_CELL_SIZE = 52;    // Prevent too large

  const cellSize = Math.max(MIN_CELL_SIZE, Math.min(
    MAX_CELL_SIZE,
    Math.floor(Math.min(MAX_GRID_WIDTH / cols, MAX_GRID_HEIGHT / rows))
  ));
  //const cellSize = Math.floor(750 / cols);

  //useCallback to handle mouse down event on a cell 
  const handleMouseDown = useCallback((row: number, col: number) => {
    // Prevent interaction if the grid is running or if the cell is start or end
    if (gridState.isRunning) return;

    const cell = gridState.grid[row][col];
    if (cell.isStart || cell.isEnd) return;

    setIsMousePressed(true);
    //Toggle between drawing and erasing walls depending on current state.
    setDrawingWalls(!cell.isWall);

    const newGrid = gridState.grid.map(gridRow =>
      gridRow.map(gridCell =>
        gridCell.row === row && gridCell.col === col
          ? { ...gridCell, isWall: !cell.isWall, isVisited: false, isPath: false }
          : gridCell
      )
      //Clear isVisited and isPath flags to reset visualization.
    );

    //pass the new grid state to the parent component
    onGridChange({ ...gridState, grid: newGrid });
  }, [gridState, onGridChange]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!isMousePressed || gridState.isRunning) return;

    const cell = gridState.grid[row][col];
    if (cell.isStart || cell.isEnd) return;

    //Applies continuous wall drawing (or erasing) as the mouse moves.
    const newGrid = gridState.grid.map(gridRow =>
      gridRow.map(gridCell =>
        gridCell.row === row && gridCell.col === col
          ? { ...gridCell, isWall: drawingWalls, isVisited: false, isPath: false }
          : gridCell
      )
    );

    onGridChange({ ...gridState, grid: newGrid });
  }, [isMousePressed, drawingWalls, gridState, onGridChange]);

  const handleMouseUp = useCallback(() => {
    setIsMousePressed(false);
  }, []);

  return (
    <div className='flex justify-self-center '>
      <div className="inline-block bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
        {/* part of grid 2D UI */}
        <div
          className="grid gap-0 select-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`
          }}
          onMouseLeave={handleMouseUp}
        >
          {gridState.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <CellComponent
                key={`row: ${rowIndex}- col: ${colIndex}`}
                cell={cell}
                cellSize={cellSize}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                isMousePressed={isMousePressed}
              />
            ))
          )}
        </div>

        {/* part of explaination color of cell in grid */}
        <div className="mt-4 text-base text-gray-600 space-y-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-400 rounded"></div>
              <span>Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridComponent;