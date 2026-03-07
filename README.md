# Path Finding AI Visualizer

A web-based interactive visualization tool for exploring classical Artificial Intelligence search algorithms used in path finding problems.
The system allows users to generate maps, visualize algorithm execution, and compare performance across multiple search strategies.

## Project Overview

This project implements several uninformed and informed search algorithms to solve grid-based path finding problems. The application provides a graphical interface where users can:

* Create or randomly generate grid maps
* Place start and goal nodes
* Add walls or obstacles
* Run different search algorithms
* Visualize how each algorithm explores the grid
* Observe the final path and visited nodes

The system is built using a Python backend (FastAPI) for algorithm execution and a web frontend for visualization.

## System Architecture

The application follows a client–server architecture.

**Backend (Python + FastAPI)**

The backend handles:
* Execution of search algorithms
* Processing grid data from the frontend
* Returning search results including:
visited nodes,
solution path,
statistics (nodes expanded, runtime)

The backend exposes API endpoints that the frontend calls to run algorithms.

**Frontend (Web Interface)**

The frontend provides:

* Interactive grid environment
* Visualization of algorithm progress
* Controls for algorithm selection
* Speed control for visualization
* Random map generation
* The frontend communicates with the backend via HTTP requests.

## Implemented Algorithms

The project implements six search algorithms commonly studied in Artificial Intelligence:

* Breadth-First Search (BFS): Breadth-First Search explores nodes level by level. It guarantees the shortest path in an unweighted graph but can consume large amounts of memory.

* Depth-First Search (DFS): Depth-First Search explores as far as possible along each branch before backtracking. It requires less memory but does not guarantee the shortest path.

* Iterative Deepening Search (IDS): IDS combines the advantages of BFS and DFS by repeatedly performing depth-limited searches with increasing depth limits.

* Uniform Cost Search (UCS): Uniform Cost Search expands the node with the lowest path cost. It guarantees an optimal solution for weighted graphs.

* Greedy Best-First Search: Greedy search uses a heuristic to expand nodes that appear closest to the goal. It is faster but does not guarantee optimality.

* A* Search: A* Search combines the cost from the start node and a heuristic estimate to the goal. It is both complete and optimal when using an admissible heuristic.

## Features

* The system includes the following features:
* Implementation of 6 search algorithms
* Interactive grid-based visualization
* Ability to place start and goal nodes
* Ability to add or remove walls
* Random map generation
* Adjustable visualization speed (slow, normal, fast)
