/**
 * Contains the values associated to the coordinates
 */
var coordinates = {
	N: 1,
	E: 2,
	S: 3,
	W: 4
}

/**
 * Contains the corresponding inverted values of the coordinates
 */
var invCoordinates = {
	N: coordinates.S,
	E: coordinates.W,
	S: coordinates.N,
	W: coordinates.E
}

/**
 * Generates a grid of size width by height containing topological information
 * about the generated maze.
 * @param  int width  width of the maze
 * @param  int height height of the maze
 * @return array      bidimensional array
 */
function generateMaze(width, height)
{
	 	grid = generateMatrix(width, height);
		depthFirstSearch(width, height, grid);
		return grid;
}

/**
 * The grid is traversed using the depth first search algorithm. On each step,
 * the cell is filled with the inverse coordinate from where the algorithm is
 * coming from. The code is based on the examples provided by Jamis Buck [1]
 * and Erik Sweet and Bill Basener [2].
 * @url [1] http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-
 *      backtracking
 * @url [2] https://en.wikipedia.org/wiki/Maze_generation_algorithm#
 *      Python_code_examples
 * @param  int width max width of the maze
 * @param  int height height of the maze
 * @return array two dimensional array with the maze
 */
function depthFirstSearch(width, height, grid)
{
	var x = 0;
	var y = 0;
	grid[x][y] = coordinates.W;

	var stack = [];
	stack.push([x, y]);

	while(stack.length)
	{
		var moveTo = [];
		if((y-1 >= 0) && (grid[x][y-1] == 0))
			moveTo.push(coordinates.N);

		if((x < width-1) && (grid[x+1][y] == 0))
			moveTo.push(coordinates.E);

		if((y < height-1) && (grid[x][y+1] == 0))
			moveTo.push(coordinates.S);

		if((x-1 >= 0) && (grid[x-1][y] == 0))
			moveTo.push(coordinates.W);

		if(moveTo.length)
		{
			stack.push([x, y]);
			shuffle(moveTo);
			switch (moveTo.pop())
			{
				case coordinates.N:
					y -= 1;
					grid[x][y] = invCoordinates.N;
					break;
				case coordinates.E:
					x += 1;
					grid[x][y] = invCoordinates.E;
					break;
				case coordinates.S:
					y += 1;
					grid[x][y] = invCoordinates.S;
					break;
				case coordinates.W:
					x -= 1;
					grid[x][y] = invCoordinates.W;
					break;
			}
		}
		else
		{
			var pos = stack.pop();
			x = pos[0];
			y = pos[1];
		}
	}
	return grid;
}

/**
 * Scrambles the elements of an array.
 * @author Jonas Raoni Soares Silva
 * @url http://jsfromhell.com/array/shuffle
 * @param  array v the array containing the elements to shuffle
 * @return array scrambled array
 */
shuffle = function(v){
	for(var j, x, i = v.length;i;
		j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x
	);
	return v;
};

/**
 * Creates a matrix of size width by height
 * @param  int width  width of the matrix
 * @param  int height height of the matrix
 * @return array two dimensional array
 * @url http://stackoverflow.com/a/966239
 * @url http://stackoverflow.com/a/8301441
 */
function generateMatrix(width, height)
{
	var matrix = [];
	for (var i = 0; i < width; i++)
	{
		matrix[i] = [];
		for (var j = 0; j < height; j++)
		{
			matrix[i][j] = 0;
		}
	}
	return matrix;
}
