var renderer;
var scene;
var camera;
var keyboard = new THREEx.KeyboardState();

var collidableObjects = [];

const MAZESIZE = 10;
var entryPoint = [0, 0]; // X and Z COORDINATES respectively.

function init()
{
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);


/*
	// Overview camera. Code is left just in case a general overview of the
	// maze is needed.
	camera = new THREE.PerspectiveCamera(45,
										window.innerWidth / window.innerHeight,
										0.1,
										1000
	);

	camera.position.set(-30, 30, -30);
	camera.lookAt(scene.position);
	controlCamera = new THREE.OrbitControls(camera);

*/

	var grid = generateMaze(MAZESIZE, MAZESIZE);

	camera = new THREE.PerspectiveCamera(45,
										 window.innerWidth / window.innerHeight,
										 0.1,
										 1000
	);
	camera.position.set(0, 0.25, 0);

	// The camera is placed pointing to the nearest open path from the
	// initial position. Check mazeGenerator.js for the reference of
	// "coordinates".
	if(grid[1][0] == coordinates.W)
	{
		camera.lookAt(new THREE.Vector3(1, 0.25, 0));
	}
	else
	{
		camera.lookAt(new THREE.Vector3(0, 0.25, 1));
	}

	generateWalls(grid);

	generateCeilingFloor(MAZESIZE);

	generateSurroundingWalls(MAZESIZE);

	var finBoxGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
	var finBoxMat = new THREE.MeshBasicMaterial({color: 0xffffff});
	var finBoxTex = loadTexture("textures/finish.png");
	finBoxTex.wrapS = THREE.RepeatWrapping;
	finBoxTex.wrapT = THREE.RepeatWrapping;

	finBoxMat.map = finBoxTex;

	var finishBox = new THREE.Mesh(finBoxGeo, finBoxMat);
	finishBox.position.set(MAZESIZE - 1, 0.25, MAZESIZE - 1);
	scene.add(finishBox);
	collidableObjects.push(finishBox);

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

	var middlePos = MAZESIZE/2 - 0.5;
	var halfPi = Math.PI * 0.5;

	var floorMaterial = new THREE.MeshBasicMaterial();
	var floorTexture = loadTexture("textures/grassTexture.jpg");
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.x = 25;
	floorTexture.repeat.y = 25;

	floorMaterial.color.setHex(0xD3D3D3);
	floorMaterial.map = floorTexture;

	var floor = new THREE.Mesh(planeGeometry, floorMaterial);
	floor.rotation.x = -halfPi;
	floor.position.set(middlePos, 0, middlePos);
	scene.add(floor);

	var ceilingMaterial = new THREE.MeshBasicMaterial();
	var ceilingTexture = loadTexture("textures/cementTexture.png");
	ceilingTexture.wrapS = THREE.RepeatWrapping;
	ceilingTexture.wrapT = THREE.RepeatWrapping;
	ceilingTexture.repeat.x = 5;
	ceilingTexture.repeat.y = 5;

	ceilingMaterial.color.setHex(0xD3D3D3);
	ceilingMaterial.map = ceilingTexture;

	var ceiling = new THREE.Mesh(planeGeometry, ceilingMaterial);
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

	var wallTexture = loadTexture("textures/wallPattern.jpg");
	wallTexture.wrapS = THREE.RepeatWrapping;
	wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.x = 25;
	wallTexture.repeat.y = 1;

	eWallMaterial.color.setHex(0xD3D3D3);
	eWallMaterial.map = wallTexture;

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

	var wallTexture = loadTexture("textures/wallPattern.jpg");
	wallTexture.wrapS = THREE.RepeatWrapping;
	wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.x = 2;
	wallTexture.repeat.y = 1;

	material.color.setHex(0x656565);
	material.map = wallTexture;
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
 * Checks whether any movement keys have been pressed, and if so, it changes
 * the position and rotation of the camera.
 */
function keyboardCheck()
{
	var movementSpeed = 0.02;
	var rotationSpeed = 0.03;

	if(keyboard.pressed('w') || keyboard.pressed('up'))
	{
		camera.translateZ(-movementSpeed);
	}

	if(keyboard.pressed('a') || keyboard.pressed('left'))
	{
		camera.rotateY(rotationSpeed);
	}

	if(keyboard.pressed('d') || keyboard.pressed('right'))
	{
		camera.rotateY(-rotationSpeed);
	}
}

/**
 * Checks whether the camera is in front of the finish sphere. If it is, it
 * forces a page reload
 */
function finishCheck()
{
	// This code was possible thanks to stemkoski's example[1] and
	// WestLangley's explanation[2].
	// [1] http://stemkoski.github.io/Three.js/Collision-Detection.html
	// [2] http://stackoverflow.com/a/14816480/6319771
	var directionVector = new THREE.Vector3();
	camera.getWorldDirection(directionVector);

	var ray = new THREE.Raycaster(camera.position.clone(),
								  directionVector.clone().normalize(),
								  0,
								  0.2
	);
	var collisionResults = ray.intersectObjects(collidableObjects);
	if (collisionResults.length > 0
		&& collisionResults[0].distance < directionVector.length())
	{
		location.reload();
	}
}

function loadTexture(path)
{
	var loader = new THREE.TextureLoader();
	var texture = loader.load(path);
	return texture;
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
	keyboardCheck();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	// The function below must go after requestAnimationFrame and
	// renderer.render, as otherwise will register an initial hit before
	// the maze loads, resulting in an infinite page reload loop
	finishCheck();
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
