from Problem import Problem

# ______________________________________________________________________________
# Define the Grid Robot Problem (for the Robot navigation)
class GridRobotProblem(Problem):
    def __init__(self, initial, goal, grid):
        """Initialize the grid problem with initial state, goal state and grid."""
        super().__init__(initial, goal)
        self.grid = grid

    def actions(self, state):
        actions = []
        x, y = state
        # Check all four possible directions
        if self.grid.isMovable(x, y - 1):  # UP
            actions.append('UP')
        if self.grid.isMovable(x, y + 1):  # DOWN
            actions.append('DOWN')
        if self.grid.isMovable(x - 1, y):  # LEFT
            actions.append('LEFT')
        if self.grid.isMovable(x + 1, y):  # RIGHT
            actions.append('RIGHT')
        return actions
    
    def result(self, state, action):
        """Return the new state after applying the action to the current state."""
        x, y = state
        if action == 'UP':
            return (x, y - 1)
        elif action == 'DOWN':
            return (x, y + 1)
        elif action == 'LEFT':
            return (x - 1, y)
        elif action == 'RIGHT':
            return (x + 1, y)
        else:
            # return current state if action is invalid
            return state
            # raise ValueError("Invalid action: {}".format(action))

    def goal_test(self, state):
        """Check if the current state is the goal state."""
        if isinstance(self.goal, list):
            return state in self.goal
        else:
            return state == self.goal