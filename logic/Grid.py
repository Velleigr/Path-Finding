from typing import List, Tuple

#Grid class to represent a 2D grid with walls 
class Grid():
    def __init__(self, rows: int, cols: int):
        self.rows = rows
        self.cols = cols
        self.grid = [[0] * cols for _ in range(rows)]  #Initialize a 2d grid, all cells are 0
        
    
    def create_wall(self, x:int, y:int, w:int, h:int): #(x, y) for top left corner, w for width, h for height of wall
        """Create a wall at the specified row and column."""
        for i in range (x, min(x+ w, self.cols)):  #Ensure we don't go out of bounds
            for j in range (y, min (y + h, self.rows)):
                self.grid[j][i] = 1 #wall cells are 1

    def create_wall_with_positions(self, positions: List[Tuple[int, int]]):
        for row, col in positions:
            if 0 <= row < self.rows and 0 <= col < self.cols:
                self.grid[row][col] = 1 

    # return the boolean value for checking if the cell is movable or not
    def isMovable(self, x: int, y: int) -> bool:
        if (0 <= x < self.cols) and (0 <= y < self.rows) and self.grid[y][x] != 1:
            return True
        else:
            return False



    