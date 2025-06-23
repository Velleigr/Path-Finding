import React from "react";
import { Cell } from "../types/type";


interface CellProps {
  cell: Cell;
  cellSize?: number; 
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  isMousePressed: boolean;
}

const CellComponent: React.FC<CellProps> = ({
    cell, 
    cellSize,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    isMousePressed
}) => {
  const getCellClassName = () => {

    let classes = ' border border-gray-300 transition-all duration-200 cursor-pointer hover:brightness-110';

    //define the cell's class color based on its properties
    if (cell.isStart) {
      classes += ' bg-green-500 shadow-md';
    } else if (cell.isEnd) {
      classes += ' bg-yellow-500 shadow-md';
    } else if (cell.isPath && !cell.isStart && !cell.isEnd) {
      classes += ' bg-purple-400 shadow-sm animate-pulse';
    } else if (cell.isVisited && !cell.isStart && !cell.isEnd) {
      classes += ' bg-blue-400 opacity-80';
    } else if (cell.isWall) {
      classes += ' bg-gray-500 shadow-inner';
    } else {
      classes += ' bg-[#FFFAFA] hover:bg-gray-100';
    }
    return classes;
  }; 

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default behavior 
    e.preventDefault();
    onMouseDown(cell.row, cell.col);
  }

    const handleMouseEnter = (e: React.MouseEvent) => {
        // Prevent default behavior 
        e.preventDefault();
        if (isMousePressed) {
            onMouseEnter(cell.row, cell.col);
        }
    }

    return (
        <div
            style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            className={getCellClassName()}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={onMouseUp}
            // data-cellID={`cell-${cell.row}-${cell.col}`}
        />
    );
}


export default CellComponent;
