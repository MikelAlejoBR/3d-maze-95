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

	/**
	 * Global axis creation
	 *
	 * We create two points a and b in order to
	 * draw the line
	 */
	var material_redline = new THREE.LineBasicMaterial({color: 0xff0000});
	var material_blueline = new THREE.LineBasicMaterial({color: 0x0000ff});
	var material_greenline = new THREE.LineBasicMaterial({color: 0x00ff00});

	/**
	 * Creation of vertices
	 */
	var geometry = new THREE.Geometry();
	geometry.vertices.push(	new THREE.Vector3(0, 0, 0),
							new THREE.Vector3(100, 0, 0)
	);
	var axisX = new THREE.Line(geometry, material_redline);

	geometry = new THREE.Geometry();
	geometry.vertices.push(	new THREE.Vector3(0, 0, 0),
							new THREE.Vector3(0, 100, 0)
	);
	var axisY = new THREE.Line(geometry, material_greenline);

	geometry = new THREE.Geometry();
	geometry.vertices.push(	new THREE.Vector3(0, 0, 0),
							new THREE.Vector3(0, 0, 100)
	);

	var axisZ = new THREE.Line(geometry, material_blueline);

	scene.add(axisX);
	scene.add(axisY);
	scene.add(axisZ);

	var grid = generateMaze(MAZESIZE, MAZESIZE);

	var coordinates = {
		N: 1,
		E: 2,
		S: 3,
		W: 4
	}

	var material = new THREE.MeshBasicMaterial();
	material.color.setHex(0x656565);
	material.side = THREE.DoubleSide;

	for(var i=0; i<MAZESIZE; i++)
	{
		for(var j=0; j<MAZESIZE; j++)
		{
			if(((j+1) < MAZESIZE)
				&& (grid[j][i] != coordinates.E)
				&& (grid[j+1][i] != coordinates.W)
			)
			{
				geometry = new THREE.PlaneGeometry(1, 0.5);
				var wall = new THREE.Mesh(geometry, material);
				wall.rotation.y = 0.5 * Math.PI;
				wall.position.y = 0.25;
				wall.position.x = j + 0.5;
				wall.position.z = i;
				scene.add(wall);
			}

			if(((i+1) < MAZESIZE)
				&& (grid[j][i] != coordinates.S)
				&& (grid[j][i+1] != coordinates.N)
			)
			{
				geometry = new THREE.PlaneGeometry(0.5, 1);
				var wall = new THREE.Mesh(geometry, material);
				wall.rotation.z = 0.5 * Math.PI;
				wall.position.x = j;
				wall.position.y = 0.25;
				wall.position.z = i + 0.5;
				scene.add(wall);
			}
		}
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

	document.body.appendChild(renderer.domElement);
	render();
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
