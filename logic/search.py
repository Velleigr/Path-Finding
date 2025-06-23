import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple, Literal, Dict

from utils import *
from Grid import Grid
from RobotProblem import GridRobotProblem
from SearchHandle.UninformedSearch import (breadth_first_graph_search, depth_first_graph_search, iterative_deepening_search)
from SearchHandle.InformedSearch import (greedy_best_first_graph_search, astar_search, bidirectional_astar_search)
# ______________________________________________________________________________
# Define the file handling functions for Robot navigation


app = FastAPI()

#  CORS configuration to allow requests from specific origins
origins = [
    "http://localhost:5173",
    "https://path-finding-nu.vercel.app", 
    "https://path-finding-backend.onrender.com"
]


# Allow frontend to call backend (from localhost:5173 or vercel site)
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    grid: List[List[int]]  # 0 for empty, 1 for wall
    start: Tuple[int, int]
    goals: List[Tuple[int, int]]
    walls: List[Tuple[int, int]]
    algorithm: Literal['bfs', 'dfs', 'gbfs', 'astar', 'cus1', 'cus2']


class SearchResponse(BaseModel):
    path: List[Tuple[int, int]]
    total_nodes: int
    # visited_nodes: Dict[str, List[Tuple[int, int]]]
    visited_nodes: List[Tuple[int, int]]
    success: bool
    message: str


#________________________________________________________________________________
# this part for command line execution
filename = sys.argv[1]
method = sys.argv[2]

def read_line_data(text: str):
    data = text.strip('[]()\n')
    return tuple(map(int, data.split(',')))


def parse_file(filename):
    """Parse the input file to create a grid and initial/goal states."""
    with open(filename, 'r') as file:
        lines = []
        for line in file:
            clean = line.strip()
            if clean and not clean.startswith("#"):
                lines.append(clean)


        # Parse map size
        map_size = read_line_data(lines[0])
        rows, cols = map_size[0], map_size[1]

        # Parse initial state
        initial_state = read_line_data(lines[1])

        # Parse goal states
        goal_raw = lines[2].split('|')
        goals = [read_line_data(g.strip()) for g in goal_raw]
        
        # Parse walls from line 4 to the end
        walls = [(read_line_data(line)) for line in lines[3:]]

        return {
            'map_size': map_size,
            'rows': rows,
            'cols': cols,
            'initial_state': initial_state,
            'goals': goals,
            'walls': walls
        }


# ______________________________________________________________________________
# Function to define the method to search
def runRobotSearch(problem: GridRobotProblem, method: str):
    """Run the search algorithm based on the specified method."""
    if method.lower() == 'bfs':
       return breadth_first_graph_search(problem)
    elif method.lower() == 'dfs':
       return depth_first_graph_search(problem)
    elif method.lower() == "gbfs":
       return greedy_best_first_graph_search(problem)
    elif method.lower() == 'astar'or (method.lower() == "as") or (method.lower() == "a*"):
       return astar_search(problem)
    elif method.lower() == 'cus1' or method.lower() == 'ids':
       return iterative_deepening_search(problem)
    elif method.lower() == 'cus2' or method.lower() == 'jps':
       return bidirectional_astar_search(problem)
    else:
        raise ValueError("Unknown search method: {}".format(method))



# =====================
# API Endpoint
# =====================
@app.post("/search", response_model=SearchResponse)
def search_route(request: SearchRequest):
    """API endpoint to perform search on the grid."""
    # Create the grid from the request data
    rows = len(request.grid)
    cols = len(request.grid[0]) if rows > 0 else 0

    # print(request.grid)

    # Create the grid and add walls
    grid = Grid(rows, cols)
    # for wall in request.walls:
    #     x, y, w, h = wall
    #     grid.create_wall(x, y, w, h)


    # Challenge________________________________________
    grid.create_wall_with_positions(request.walls)

    print(grid.grid)
    print(request.start, request.goals)

    # Build problem instance
    problem = GridRobotProblem(request.start, request.goals, grid)

    try:
        result_node, total_nodes, visited_nodes = runRobotSearch(problem, request.algorithm)
        print(result_node)
        print(total_nodes)
        print(visited_nodes)

        if result_node is None:
            return SearchResponse(
                path=[], total_nodes = total_nodes, visited_nodes = visited_nodes, success=False, message="No path found.🥲"
            )

        # Reconstruct path
        if isinstance(result_node, str) and result_node == 'cutoff':
            return SearchResponse(
                path=[], total_nodes = total_nodes, visited_nodes = visited_nodes, success=False, message="Search cutoff. No solution within depth limit.🥲"
            )
        else:
            test = []
            path = []
            pnode = result_node
            if pnode.parent is None:
            # Start and goal are the same
                path = [pnode.state]
            else:
                while pnode.parent:
                    test.append(pnode.action)
                    path.append(pnode.state)
                    pnode = pnode.parent

        path=path[::-1]
        test= test[::-1]
        print("Test path for backend: ",test)
        print("Test nodes path for backend: ",path)
        return SearchResponse(
            path=path[::-1],  # from start to goal
            total_nodes=total_nodes,
            visited_nodes = visited_nodes,
            success=True,
            message="Path found successfully"
        )
    except Exception as e:
        return SearchResponse(
            path=[],
            total_nodes=0,
            visited_nodes = visited_nodes,
            success=False,
            message=f"Error: {str(e)}"
        )
   

# ______________________________________________________________________________
# Main function to create the grid and problem instance

if __name__ == "__main__":
    data = parse_file(filename)
    rows, cols = data['rows'], data['cols']
    initial_state = data['initial_state']
    goals = data['goals']
    walls = data['walls']

    # Create the grid and add walls
    grid = Grid(rows, cols)
    for wall in walls:
        x, y, w, h = wall
        grid.create_wall(x, y, w, h)

    print("grid created", grid.grid)
    # Create the problem instance
    problem = GridRobotProblem(initial_state, goals, grid)
    # Run the search algorithm
    result_solution, total_nodes, visited_nodes = runRobotSearch(problem, method) 
    
    if result_solution is None:
        print("No path found.")
    elif isinstance(result_solution, str) and result_solution == 'cutoff':
        print("Search cutoff. No solution within depth limit.")
    else:
    # Backtrack to find the path from the initial state to the goal
        path =[]
        pnode = result_solution
        if pnode.parent is None:
            # Start and goal are the same
            path = [pnode.state]
        else:
            while pnode.parent:
                path.append(pnode.action)
                pnode = pnode.parent

    
    # Print the parsed data
    print("Search Result one time:", result_solution)
    print("Path to goal:", path[::-1])  # Reverse the path to show from start to goal
    print("Total nodes:", total_nodes)  # Reverse the path to show from start to goal
    print("Visited nodes:", visited_nodes)  # 
    print("Map Size:", (rows, cols))
    print("Initial State:", initial_state)
    print("Goal States:", goals)
    print("Walls:", walls)