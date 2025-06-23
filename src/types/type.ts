export interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  heuristic: number;
  totalCost: number;
  parent: Cell | null;
}

export interface GridState {
  grid: Cell[][];
  startCell: { row: number; col: number };
  endCells: { row: number; col: number }[];
  isRunning: boolean;
  isFinished: boolean;
}

export type AlgorithmType = 'bfs' | 'dfs' | 'gbfs' | 'astar' | 'cus1' | 'cus2';

export interface AlgorithmResult {
  visitedCells: Cell[];
  pathCells: Cell[];
  success: boolean;
  distance: number;
  nodesExplored: number;
}

export interface MapPreset {
  id: string;
  name: string;
  description: string;
  walls: { row: number; col: number }[];
  start: { row: number; col: number };
  end: { row: number; col: number };
}

export interface VisualizationState {
  speed: number;
  currentStep: number;
  isPlaying: boolean;
  showStats: boolean;
}