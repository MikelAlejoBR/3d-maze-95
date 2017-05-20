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

	camera.position.x = -30;
	camera.position.y = 30;
	camera.position.z = -30;
	camera.lookAt(scene.position);

	controlCamera = new THREE.OrbitControls(camera);

	var axisHelper = new THREE.AxisHelper(10);
	scene.add(axisHelper);

	var grid = generateMaze(MAZESIZE, MAZESIZE);

	generateWalls(grid);

	var floorGeometry = new THREE.PlaneGeometry(MAZESIZE, MAZESIZE);
	var floorMaterial = new THREE.MeshBasicMaterial();
	floorMaterial.color.setHex(0xD3D3D3);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -0.5 * Math.PI;
	floor.position.x = MAZESIZE/2 - 0.5;
	floor.position.z = MAZESIZE/2 - 0.5;
	scene.add(floor);

	var ceilingGeometry = new THREE.PlaneGeometry(MAZESIZE, MAZESIZE);
	var ceilingMaterial = new THREE.MeshBasicMaterial();
	ceilingMaterial.color.setHex(0xD3D3D3);
	var ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
	ceiling.rotation.x = 0.5 * Math.PI;
	ceiling.position.x = MAZESIZE/2 - 0.5;
	ceiling.position.y = 0.5;
	ceiling.position.z = MAZESIZE/2 - 0.5;
	scene.add(ceiling);

	generateSurroundingWalls(MAZESIZE);

	document.body.appendChild(renderer.domElement);
	render();
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

	// South wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.position.set((MAZESIZE/2 - 0.5), 0.25, -0.5);
	scene.add(externalWall);

	// West wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.rotation.y = Math.PI * -0.5;
	externalWall.position.set(MAZESIZE - 0.5, 0.25, MAZESIZE/2 - 0.5);
	scene.add(externalWall);

	// North wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.rotation.y = Math.PI;
	externalWall.position.set(MAZESIZE/2 - 0.5, 0.25, MAZESIZE - 0.5);
	scene.add(externalWall);

	// East wall
	var externalWall = new THREE.Mesh(wallGeometry, eWallMaterial);
	externalWall.rotation.y = Math.PI * 0.5;
	externalWall.position.set(-0.5, 0.25, MAZESIZE/2 - 0.5);
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
				wall.rotation.y = 0.5 * Math.PI;
				wall.position.y = yPos;
				wall.position.x = j + 0.5;
				wall.position.z = i;
				scene.add(wall);
			}

			if(((i+1) < MAZESIZE)
				&& (grid[j][i] != coordinates.S)
				&& (grid[j][i+1] != coordinates.N)
			)
			{
				var wall = new THREE.Mesh(geometry, material);
				wall.position.x = j;
				wall.position.y = yPos;
				wall.position.z = i + 0.5;
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
			square.rotation.x = 0.5 * Math.PI;
			square.position.x = j;
			square.position.y = 0;
			square.position.z = i;
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
