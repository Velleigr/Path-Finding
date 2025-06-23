import React from 'react';
import { Play, Square, RotateCcw, Shuffle, Zap, Clock, BarChart3 } from 'lucide-react';
import { AlgorithmType, GridState, VisualizationState } from '../types/type';
// import { mapPresets } from '../utils/mapPresets';
import { mapPresets } from '../mapPresets.ts';

interface ControlsProps {
  gridState: GridState;
  algorithm: AlgorithmType;
  visualizationState: VisualizationState;
  stats: {
    distance: number;
    nodesExplored: number;
    executionTime: number;
  } | null;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onClearWalls: () => void;
  onGenerateRandomWalls: () => void;
  onLoadPreset: (presetId: string) => void;
  onSpeedChange: (speed: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  gridState,
  algorithm,
  visualizationState,
  stats,
  onAlgorithmChange,
  onStart,
  onStop,
  onReset,
  onClearWalls,
  onGenerateRandomWalls,
  onLoadPreset,
  onSpeedChange,
}) => {
  const algorithms = [
    { id: 'bfs' as AlgorithmType, name: 'BFS (Breadth First Search)', description: 'Guarantees shortest path' },
    { id: 'dfs' as AlgorithmType, name: 'DFS (Depth First Search)', description: 'Explores deep, not optimal' },
    { id: 'gbfs' as AlgorithmType, name: "GBFS (Greedy best first search)", description: 'Heuristic-based optimal' },
    { id: 'astar' as AlgorithmType, name: 'A* Search', description: 'Heuristic-based optimal' },
    { id: 'cus1' as AlgorithmType, name: 'Iterative deepening search (custom 1)', description: 'Advantage of the completeness of BFS inn less memory' },
    { id: 'cus2' as AlgorithmType, name: 'Bidirectional A* search (custom 2)', description: 'Searching both in start and goal nodes' },
  ];

  const speedOptions = [
    { value: 100, label: 'Slow', icon: '🐌' },
    { value: 80, label: 'Medium', icon: '🚶' },
    { value: 60, label: 'Fast', icon: '🏃' },
  ];

  return (
    <div className="flex space-y-6 flex-col justify-self-center max-w-4xl">
      {/* Algorithm Selection */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
          <Zap className="w-6 h-6 text-blue-600" />
          Algorithm Selection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {algorithms.map((alg) => (
            <button
              key={alg.id}
              onClick={() => onAlgorithmChange(alg.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${algorithm === alg.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              disabled={gridState.isRunning}
            >
              <div className="font-medium text-black">{alg.name}</div>
              <div className="text-sm text-gray-600">{alg.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
          <Play className="w-5 h-5 text-green-600" />
          Visualization Controls
        </h3>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={gridState.isRunning ? onStop : onStart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${gridState.isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
              }`}
          >
            {gridState.isRunning ? (
              <>
                <Square className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Visualization
              </>
            )}
          </button>

          <button
            onClick={onReset}
            disabled={gridState.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={onClearWalls}
            disabled={gridState.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            Clear Walls
          </button>

          <button
            onClick={onGenerateRandomWalls}
            disabled={gridState.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4" />
            Random Walls
          </button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4" />
            Animation Speed
          </label>
          <div className="flex gap-2">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSpeedChange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${visualizationState.speed === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                disabled={gridState.isRunning}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Presets */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h3 className="text-lg font-semibold mb-4 text-black">Map Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-black">
          {mapPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              disabled={gridState.isRunning}
              className="p-3 text-left border rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs text-gray-600">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Algorithm Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.distance}</div>
              <div className="text-sm text-gray-600">Path Length</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.nodesExplored}</div>
              <div className="text-sm text-gray-600">Nodes Explored</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.executionTime}ms</div>
              <div className="text-sm text-gray-600">Execution Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;