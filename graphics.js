var renderer;
var scene;
var camera;

const MAZESIZE = 10;
var entryPoint = [0, 0]; // X and Z COORDINATES respectively.

function init()
{
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	camera = new THREE.PerspectiveCamera(45,
										window.innerWidth / window.innerHeight,
										0.1,
										1000
	);

	camera.position.set(-30, 30, -30);
	camera.lookAt(scene.position);

	controlCamera = new THREE.OrbitControls(camera);

	var axisHelper = new THREE.AxisHelper(10);
	scene.add(axisHelper);

	var grid = generateMaze(MAZESIZE, MAZESIZE);

	generateWalls(grid);

	generateCeilingFloor(MAZESIZE);

	generateSurroundingWalls(MAZESIZE);

	document.body.appendChild(renderer.domElement);
	render();
}

/**
 * Generates the floor and the ceiling of the maze.
 * @param  int MAZESIZE size of the maze
 */
function generateCeilingFloor(MAZESIZE)
{
	var planeGeometry = new THREE.PlaneGeometry(MAZESIZE, MAZESIZE);
	var planeMaterial = new THREE.MeshBasicMaterial();
	planeMaterial.color.setHex(0xD3D3D3);

	var middlePos = MAZESIZE/2 - 0.5;
	var halfPi = Math.PI * 0.5;

	var floor = new THREE.Mesh(planeGeometry, planeMaterial);
	floor.rotation.x = -halfPi;
	floor.position.set(middlePos, 0, middlePos);
	scene.add(floor);

	var ceiling = new THREE.Mesh(planeGeometry, planeMaterial);
	ceiling.rotation.x = halfPi;
	ceiling.position.set(middlePos, 0.5, middlePos);
	scene.add(ceiling);
}

/**
 * Generates the external walls that surround the maze.
 * @param  int MAZESIZE size of the maze
 */
function generateSurroundingWalls(MAZESIZE)
{
	var wallGeometry = new THREE.PlaneGeometry(MAZESIZE, 0.5);
	var eWallMaterial = new THREE.MeshBasicMaterial();
	eWallMaterial.color.setHex(0xD3D3D3);

	/**
	 * In order to correctly locate which wall belongs to each side of the
	 * square, the axises must be seen like in the following example:
	 *
	 *                Z axis
	 *                   \
	 *                   \
	 *                   \
	 *                   \
	 *  X axis __________\
	 */

	var middlePos = MAZESIZE/2 - 0.5;
	var limitPos = MAZESIZE - 0.5;
	var halfPi = Math.PI * 0.5;

	// South wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.position.set(middlePos, 0.25, -0.5);
	scene.add(externalWall);

	// West wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.rotation.y = -halfPi;
	externalWall.position.set(limitPos, 0.25, middlePos);
	scene.add(externalWall);

	// North wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.rotation.y = Math.PI;
	externalWall.position.set(middlePos, 0.25, limitPos);
	scene.add(externalWall);

	// East wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.rotation.y = halfPi;
	externalWall.position.set(-0.5, 0.25, middlePos);
	scene.add(externalWall);
}

/**
 * Generates walls interpreting the given grid's topology.
 * @param  array two dimensional array containing the grid
 */
function generateWalls(grid)
{
	var material = new THREE.MeshBasicMaterial();
	material.color.setHex(0x656565);
	material.side = THREE.DoubleSide;

	var geometry = new THREE.PlaneGeometry(1, 0.5);
	var yPos = 0.25;
	var halfPi = Math.PI * 0.5;
	
	for(var i=0; i<MAZESIZE; i++)
	{
		for(var j=0; j<MAZESIZE; j++)
		{
			if(((j+1) < MAZESIZE)
				&& (grid[j][i] != coordinates.E)
				&& (grid[j+1][i] != coordinates.W)
			)
			{
				var wall = new THREE.Mesh(geometry, material);
				wall.rotation.y = halfPi;
				wall.position.set(j + 0.5, yPos, i);
				scene.add(wall);
			}

			if(((i+1) < MAZESIZE)
				&& (grid[j][i] != coordinates.S)
				&& (grid[j][i+1] != coordinates.N)
			)
			{
				var wall = new THREE.Mesh(geometry, material);
				wall.position.set(j, yPos, i + 0.5);
				scene.add(wall);
			}
		}
	}
}

/**
 * Generates and places in the scene a colored square for each cell of the
 * given grid
 * @param  array two dimensional array containing the grid
 */
function generateColoredSquares(grid)
{
	var coordinates = {
		N: 1,
		E: 2,
		S: 3,
		W: 4
	}

	var colored = 0xff0000;
	var colorblue = 0x0000ff;
	var colorgreen = 0x00ff00;
	var colorgray = 0xD3D3D3;

	var halfPi = Math.PI * 0.5;

	for(var i=0; i<MAZESIZE; i++)
	{
		for(var j=0; j<MAZESIZE; j++)
		{
			var geometry = new THREE.PlaneGeometry(1, 1);
			var material  = new THREE.MeshBasicMaterial();
			switch (grid[j][i])
			{
				case coordinates.N:
					material.color.setHex(colored);
					break;
				case coordinates.E:
					material.color.setHex(colorblue);
					break;
				case coordinates.S:
					material.color.setHex(colorgreen);
					break;
				case coordinates.W:
					material.color.setHex(colorgray);
					break;
			}
			material.side = THREE.DoubleSide;
			var square = new THREE.Mesh(geometry, material);
			square.rotation.x = halfPi;
			square.position.set(j, 0, i);
			scene.add(square);
		}
	}
}

/**
 * Rendering function
 */
function render()
{
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

/**
 * Function that handles window resizing and adapts the camera and the
 * rendering accordingly
 **/
function handleResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;
window.addEventListener('resize', handleResize, false);
