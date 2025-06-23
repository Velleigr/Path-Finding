from utils import memoize, manhattan_distance, PriorityQueue
from Node import Node

# ______________________________________________________________________________
# Informed (Heuristic) Search
def best_first_graph_search(problem, f, display=False):
    """Search the nodes with the lowest f scores first.
    You specify the function f(node) that you want to minimize; for example,
    if f is a heuristic estimate to the goal, then we have greedy best
    first search; if f is node.depth then we have breadth-first search.
    There is a subtlety: the line "f = memoize(f, 'f')" means that the f
    values will be cached on the nodes as they are computed. So after doing
    a best first search you can examine the f values of the path returned."""
    f = memoize(f, 'f')
    node = Node(problem.initial)
    frontier = PriorityQueue('min', f)
    frontier.append(node)
    explored = set()
    #  Keep track of visited nodes for display purposes
    visited_nodes = []
    total_nodes_visited = 0
    while frontier:
        node = frontier.pop()
        total_nodes_visited += 1
        visited_nodes.append(node.state)
        # check the goal test
        if problem.goal_test(node.state):
            if display:
                print(len(explored), "paths have been expanded and", len(frontier), "paths remain in the frontier")
            return node, total_nodes_visited, visited_nodes
        explored.add(node.state)
        for child in node.expand(problem):
            if child.state not in explored and child not in frontier:
                frontier.append(child)
            elif child in frontier:
                if f(child) < frontier[child]:
                    del frontier[child]
                    frontier.append(child)
    return None, total_nodes_visited, visited_nodes


def robot_manhattan_heuristic(node, problem, backtrack=False):
    if backtrack:
        return manhattan_distance(node.state, problem.initial)
    else: 
        return min(manhattan_distance(node.state, goal) for goal in problem.goal)


# Greedy best-first search is accomplished by specifying f(n) = h(n).
def greedy_best_first_graph_search(problem, h = robot_manhattan_heuristic, display=False):
    """Greedy best-first graph search is best_first_graph_search with f(n) = h(n).
    You need to specify the h function when you call greedy_best_first_graph_search,
    or else in your Problem subclass."""
    return  best_first_graph_search(problem, lambda n: h(n, problem), display)


# ______________________________________________________________________________
# A* heuristics 
def astar_search(problem, h = robot_manhattan_heuristic, display=False):
    """A* search is best-first graph search with f(n) = g(n)+h(n).
    You need to specify the h function when you call astar_search, or
    else in your Problem subclass."""
    h = memoize(h or problem.h, 'h')
    return best_first_graph_search(problem, lambda n: n.path_cost + h(n, problem), display)

# ______________________________________________________________________________
# custom search method 

def bidirectional_astar_search(problem, h = robot_manhattan_heuristic, display=False):
    """Bidirectional search is a search method that simultaneously searches
    from the initial state and the goal state, meeting in the middle."""
   
    h = memoize(h or problem.h, 'h')
    f = memoize(lambda n: n.path_cost + h(n, problem ), 'f')
    f_back = memoize(lambda n: n.path_cost + h(n, problem,True ), 'f_back')

    
    # Initialize the forward and backward frontiers
    forward_frontier = PriorityQueue('min', f)
    backward_frontier = PriorityQueue('min', f_back)
    
    # Initialize the explored sets
    forward_explored = set()
    backward_explored = set()
    
    # Initialize the forward search node
    forward_node = Node(problem.initial)
    forward_frontier.append(forward_node)

    # Dictionaries to store the actual nodes for easier access
    forward_explored_dict = {}
    backward_explored_dict = {}

    # Initialize the list to keep track of visited nodes
    visited_nodes_forward = []
    visited_nodes_backward = []
    

    if problem.goal_test(forward_node.state):
        return forward_node, 1
    
    total_nodes_visited = 0

    goals = problem.goal if isinstance(problem.goal, list) else [problem.goal]

    for goal in goals:
        backward_node = Node(goal)
        backward_frontier.append(backward_node)

    
    while forward_frontier and backward_frontier:
        # Expand the forward search
        forward_node = forward_frontier.pop()
        backward_node = backward_frontier.pop()
        total_nodes_visited += 2

         # add the new forward node to the explored set 
        forward_explored.add(forward_node.state)
        forward_explored_dict[forward_node.state] = forward_node
        visited_nodes_forward.append(forward_node.state)

        # Expand the backward node 
        backward_explored.add(backward_node.state)
        backward_explored_dict[backward_node.state] = backward_node
        visited_nodes_backward.append(backward_node.state)
        
        if forward_node.state in backward_explored:
            return merge_nodes_of_paths(forward_node, backward_explored_dict[forward_node.state]), total_nodes_visited, visited_nodes_forward + visited_nodes_backward

        if backward_node.state in forward_explored:
            return merge_nodes_of_paths(forward_explored_dict[backward_node.state], backward_node), total_nodes_visited, visited_nodes_forward + visited_nodes_backward
        
        # search loop for the forward search
        for child in forward_node.expand(problem):
            if child.state not in forward_explored and child not in forward_frontier:
                forward_frontier.append(child)
            elif child in forward_frontier:
                if f(child) < forward_frontier[child]:
                    del forward_frontier[child]
                    forward_frontier.append(child)
        
        # search loop for the backward search
        for child in backward_node.expand(problem):
            if child.state not in backward_explored and child not in backward_frontier:
                backward_frontier.append(child)
            elif child in backward_frontier:
                if f_back(child) < backward_frontier[child]:
                    del backward_frontier[child]
                    backward_frontier.append(child)
    
    return None, total_nodes_visited, visited_nodes_forward + visited_nodes_backward

def merge_nodes_of_paths(meeting_forward_node, meeting_backward_node):
    """Merge the nodes from the forward and backward nodes."""
    # Get the backward path from goal to meeting point
    backward_path_nodes = []
    current = meeting_backward_node 
    while current.parent is not None:
        backward_path_nodes.append(current)
        current = current.parent
    backward_path_nodes.append(current)  # Add the goal node
    
    # Reverse to get path from meeting point to goal (excluding meeting point)
    backward_path_nodes.reverse()
    if len(backward_path_nodes) > 1:
        backward_path_nodes = backward_path_nodes[1:]  # Remove meeting point to avoid duplication
    
    # Start with the forward node (which has the correct path from initial to meeting point)
    result_node = meeting_forward_node
    
    # Extend the path by adding the backward path nodes
    for backward_node in backward_path_nodes:
        # Create a new node that continues from the current result
        new_node = Node(backward_node.state)
        new_node.parent = result_node
        new_node.action = reverse_action(backward_node.action)  # Keep the original action
        result_node = new_node
    
    return result_node

def reverse_action(action):
    """Return the opposite of the given action."""
    if action == 'UP':
        return 'DOWN'
    elif action == 'DOWN':
        return 'UP'
    elif action == 'LEFT':
        return 'RIGHT'
    elif action == 'RIGHT':
        return 'LEFT'
    return None
    