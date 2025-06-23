from utils import *
from Node import Node
from collections import deque

def depth_first_graph_search(problem):
    """
    Search the deepest nodes in the search tree first.
    Search through the successors of a problem to find a goal.
    The argument frontier should be an empty queue.
    Does not get trapped by loops.
    If two paths reach a state, only use the first one.
    """
    frontier = [(Node(problem.initial))]  # Stack
    total_nodes_visited = 0 # For debugging purposes, to count total nodes expanded
    visited_nodes = []  #to keep track of visited nodes

    # print("frontier:",frontier)
    explored = set()
    while frontier:
        node = frontier.pop()
        # print("node:",node)
        total_nodes_visited += 1
        visited_nodes.append(node.state)  # Add the current node to visited nodes
        if problem.goal_test(node.state):
            return node, total_nodes_visited, visited_nodes
        explored.add(node.state)
        frontier.extend(child for child in node.expand(problem)
                        if child.state not in explored and child not in frontier)
        # print("frontier extend: \n",frontier)
    return None, total_nodes_visited, visited_nodes  # If no solution is found

def breadth_first_graph_search(problem):
    """
    Note that this function can be implemented in a
    single line as below:
    return graph_search(problem, FIFOQueue())
    """
    node = Node(problem.initial)
    frontier = deque([node])
    explored = set()
    total_nodes_visited = 0 
    visited_nodes = []

    if problem.goal_test(node.state):
        return node, 1, visited_nodes
    
    while frontier:
        node = frontier.popleft()
        explored.add(node.state)
        total_nodes_visited += 1
        visited_nodes.append(node.state)  # Add the current node to visited nodes
        for child in node.expand(problem):
            if child.state not in explored and child not in frontier:
                if problem.goal_test(child.state):
                    return child,  total_nodes_visited + 1, visited_nodes
                frontier.append(child)
    return None, total_nodes_visited, visited_nodes


def depth_limited_search(node, problem, limit, explored=None, counter = None, visited_nodes = None):
    """
    Search the deepest nodes in the search tree first,
    but do not expand nodes at depth greater than limit.
    """
    if counter is None:
        counter = [0]  # a mutable list

    counter[0] += 1

    if(problem.goal_test(node.state)):
        return node, counter[0]
    
    if explored is None:
        explored = set()

    if visited_nodes is None:
        visited_nodes = []
    
    explored.add(node.state)
    visited_nodes.append(node.state)

    if limit == 0: 
        return 'cutoff', counter[0]
    else: 
        cutoff_occurred = False
        for child in node.expand(problem):
            if child.state not in explored:
                result, count = depth_limited_search(child, problem, limit - 1, explored, counter, visited_nodes)
                if result == 'cutoff':
                    cutoff_occurred = True
                elif result is not None:
                    return result, count
        # alwways return total nodes visited 
        return ('cutoff' if cutoff_occurred else None), counter[0]
      

def iterative_deepening_search(problem, max_depth=100):
    """
    Perform iterative deepening search on the problem.
    This combines the benefits of depth-first and breadth-first search.
    It repeatedly calls depth_limited_search with increasing limits.
    """
    total_nodes_visited = 0
    visited_nodes = []  # to keep track of visited nodes
    for depth in range(max_depth):
        explored = set()
        visited_this_depth = []
        result, count = depth_limited_search(Node(problem.initial), problem, depth, explored, None, visited_this_depth)
        total_nodes_visited += count
        visited_nodes.extend(visited_this_depth)
        if result != 'cutoff':
            return result, total_nodes_visited, visited_nodes
    return None, total_nodes_visited, visited_nodes  # If no solution is found within the max depth
