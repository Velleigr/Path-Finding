import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import Header from './components/header.tsx'
import GridComponent from './components/gridmap.tsx'
import Controls from './components/controller.tsx';
import { mapPresets } from './mapPresets.ts';
import { parseMapFile } from './utils/parseMap.ts';
import { GridState, AlgorithmType, VisualizationState, Cell } from './types/type.ts';
import { createEmptyGrid, resetGrid } from './utils/gridUtils.ts';


function App() {
  const [selectedMap, setSelectedMap] = useState(mapPresets[0].file); // default to map1
  const [gridState, setGridState] = useState<GridState>(); // Initialize with an empty grid of size 5x11
  const [walls, setWalls] = useState<[number, number, number, number][]>([]);

  //Load default map (map1) on first render
  useEffect(() => {
    (async () => {
      const data_map = await parseMapFile(selectedMap);
      setGridState(data_map.gridState);
      setWalls(data_map.walls);
      console.log(data_map);
    })();
  }, []);

  console.log(gridState)
  
  
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bfs'); // default algorithm is bfs 
  const [visualizationState, setVisualizationState] = useState<VisualizationState>({
    speed: 80, // default speed medium
    currentStep: 0,
    isPlaying: false,
    showStats: false,
  });
  const [stats, setStats] = useState<{
    distance: number;
    nodesExplored: number;
    executionTime: number;
  } | null>(null);


  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to handle aborting the current algorithm
  const handleGridChange = useCallback((newGridState: GridState) => {
    setGridState(newGridState);
  }, []);

  // Function to handle algorithm change
  const handleAlgorithmChange = useCallback((newAlgorithm: AlgorithmType) => {
    setAlgorithm(newAlgorithm);
  }, []);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setGridState(prev => {
      if (!prev) return prev; // or return some default state if needed
      return { ...prev, isRunning: false };
    });
  }, []);

  // Function to handle reset
  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setGridState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        grid: resetGrid(prev.grid, prev.startCell, prev.endCells),
        isRunning: false,
        isFinished: false,
      }
    });
    setStats(null);
  }, []);


    // Function to handle clear walls
 const handleClearWalls = useCallback(() => {
    setGridState(prev => {
      if (!prev) return prev;
      return {
      ...prev,
      grid: prev.grid.map(row =>
        row.map(cell => ({
          ...cell,
          isWall: false,
          isVisited: false,
          isPath: false,
        }))
      ),
    }});
    setStats(null);
  }, []);

  const handleGenerateRandomWalls = useCallback(() => {
    setGridState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        grid: prev.grid.map(row =>
          row.map(cell => ({
            ...cell,
            isWall: !cell.isStart && !cell.isEnd && Math.random() < 0.25,
            isVisited: false,
            isPath: false,
          })))
      };
    });
    setStats(null);
  }, []);


  const handleSpeedChange = useCallback((speed: number) => {
    setVisualizationState(prev => ({ ...prev, speed }));
  }, []);


  const animateSearch = useCallback((visitedNodes: number[][], path: number[][]) => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateGrid = (updates: (grid: Cell[][]) => Cell[][]) => {
      setGridState(prev => (prev ? { ...prev, grid: updates(prev.grid) } : prev));
    };

    (async () => {
      // Animate visited nodes
      for (const [col, row] of visitedNodes) {
        updateGrid(grid =>
          grid.map(r =>
            r.map(c => {
              if (
                c.row === row &&
                c.col === col &&
                !c.isStart &&
                !c.isEnd &&
                !c.isWall &&
                !c.isVisited // prevent overwrite
              ) {
                return { ...c, isVisited: true };
              }
              return c;
            })
          )
        );
        await delay(visualizationState.speed);
      }

      // Animate final path
      for (const [col, row] of path) {
        updateGrid(grid =>
          grid.map(r =>
            r.map(c => {
              if (
                c.row === row &&
                c.col === col &&
                !c.isStart &&
                !c.isEnd &&
                !c.isWall &&
                !c.isPath
              ) {
                return { ...c, isPath: true };
              }
              return c;
            })
          )
        );
        await delay(visualizationState.speed);
      }

      // Mark animation finished
      setGridState(prev =>
        prev ? { ...prev, isRunning: false, isFinished: true } : prev
      );
    })();
  }, [visualizationState.speed]);




  // Function to animate the search process
  const handleSearch = async  () => {
    if (!gridState) return;

    const requestbody = {
      grid: gridState.grid.map(row => row.map(cell => (cell.isWall ? 1 : 0))),
      start: [gridState.startCell.col, gridState.startCell.row],
      goals: gridState.endCells.map(goal => [goal.col, goal.row]), 
      // walls: walls,
      walls: gridState.grid.flat()
      .filter(cell => cell.isWall)
      .map(cell => [cell.row, cell.col]),
      algorithm: algorithm, 
    }

    // console.log(requestbody.walls)
    // console.log(requestbody.grid)

    setGridState(prev => prev && { ...prev, isRunning: true });
    const startTime = performance.now();

    try {
    // const response = await fetch("http://localhost:8000/search", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(requestbody),
    // });

    const response = await fetch("https://path-finding-backend.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestbody),
    });

    const data = await response.json();

    const endTime = performance.now();

    setStats({
      distance: data.path.length,
      nodesExplored: data.total_nodes,
      executionTime: Math.round(endTime - startTime),
    });

    if (data.success) {
      animateSearch(data.visited_nodes, data.path);
    } else {
      alert(data.message);
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("An error occurred while running the search.");
    }
  }


  return (
    <>
      <Header />
      {/* Main content */}
      <div className='flex flex-col items-center space-y-6 md:flex-row md:justify-between p-5 md:space-y-0'>
        {gridState && (
          <div className="w-[95%] md:w-[48%] md:self-start">
            <GridComponent gridState={gridState} onGridChange={setGridState} />
          </div>
        )}
        {gridState && (
          <div className="w-[95%] md:w-[48%]">
            <Controls
              gridState={gridState}
              algorithm={algorithm}
              visualizationState={visualizationState}
              stats={stats}
              onAlgorithmChange={handleAlgorithmChange}
              onStart={handleSearch}
              onStop={handleStop}
              onReset={handleReset}
              onClearWalls={handleClearWalls}
              onGenerateRandomWalls={handleGenerateRandomWalls}
              onLoadPreset={(presetId: string) => {
                const preset = mapPresets.find(p => p.id === presetId);
                if (preset) {
                  setSelectedMap(preset.file);
                   (async () => {
                      const data_map = await parseMapFile(preset.file);
                      setGridState(data_map.gridState);
                      setWalls(data_map.walls);
                    })();
                }
              }}
              onSpeedChange={handleSpeedChange}
            />
          </div>
        )}
      </div>

    </>
  )
}

export default App
