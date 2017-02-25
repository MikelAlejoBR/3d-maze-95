var renderer;
var scene;
var camera;

const MAZESIZE = 100;
const ADVANCELENGTH = 1;
const POINTSTOGENERATE = 10;
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
	 * Plane
	 */
	var geometry = new THREE.PlaneGeometry(100, 100);
	var material  = new THREE.MeshBasicMaterial({color: 0xffffff});
	material.side = THREE.DoubleSide;
	var plane = new THREE.Mesh(geometry, material);

	plane.rotation.x = 0.5 * Math.PI; /* 90 degrees */

	plane.position.x = 50;
	plane.position.y = 0;
	plane.position.z = 50;

	scene.add(plane);

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

	var geometry = new THREE.SphereGeometry(1, 16, 16);
	var material = new THREE.MeshBasicMaterial({color: 0xADD8E6});

	var vectorArray = new Array();
	vectorArray = generatePoints(entryPoint, MAZESIZE, ADVANCELENGTH);
	for(i=0; i<vectorArray.length; i++)
	{
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.x = vectorArray[i].getComponent(0);
		sphere.position.y = vectorArray[i].getComponent(1);
		sphere.position.z = vectorArray[i].getComponent(2);
		scene.add(sphere);
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
