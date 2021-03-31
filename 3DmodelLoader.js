const canvas = document.getElementById('board');

const setAntialias = false;
const showWireframe = false;
const shapeShadows = false;
const sceneColor = 0xdddddd;

let numberOfLights = 2

const boxWidth = 1;
const boxHeight = 1;
const boxLength = 1;
const boxColor = 0x00fff0;

let object;
const manager = new THREE.LoadingManager(loadModel);
manager.onProgress = function (item, loaded, total) {
	console.log(item, loaded, total);
};

const loader = new THREE.OBJLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
const texture = textureLoader.load('/assets/vroom/Renders/Audi_R8_2017.1.png');
// const texture2 = textureLoader.load('/assets/vroom/Renders/Audi_R8_2017.2.png');

// let texture = new Array(5).fill(0).map((_, index) => {
// 	return textureLoader.load('/assets/vroom/Renders/Audi_R8_2017.' + index + '.png');
// })

// const texture = [
// 	textureLoader.loadAsync('/assets/vroom/Renders/Audi_R8_2017.1.png'),
// 	textureLoader.loadAsync('/assets/vroom/Renders/Audi_R8_2017.2.png'),
// 	textureLoader.loadAsync('/assets/vroom/Renders/Audi_R8_2017.5.png'),
// 	textureLoader.loadAsync('/assets/vroom/Renders/Audi_R8_2017.7.png'),
// 	textureLoader.loadAsync('/assets/vroom/Renders/Audi_R8_2017.9.png')
// ];


function init() {
	var gui = new dat.GUI();

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(sceneColor);

	// var ambientLight = getAmbientLight(1);
	// scene.add(ambientLight);

	// Add Light environment
	var lightLeft = getDirectionalLight(1);
	var lightRight = getDirectionalLight(1);

	lightLeft.position.x = -25;
	lightLeft.position.y = -25;
	lightLeft.position.z = 25;

	lightRight.position.x = 25;
	lightRight.position.y = 25;
	lightRight.position.z = 15;

	gui.add(lightLeft, 'intensity', 0, 10);
	gui.add(lightLeft.position, 'x', -50, 50);
	gui.add(lightLeft.position, 'y', -50, 50);
	gui.add(lightLeft.position, 'z', -50, 50);

	gui.add(lightRight, 'intensity', 0, 10);
	gui.add(lightRight.position, 'x', -50, 50);
	gui.add(lightRight.position, 'y', -50, 50);
	gui.add(lightRight.position, 'z', -50, 50);

	scene.add(lightLeft);
	scene.add(lightRight);

	var box = getBox(boxWidth, boxHeight, boxLength, boxColor);
	scene.add(box);

	//////////////////////////////////////////////////////////////////////
	// load external geometry

	loader.load(
		'assets/vroom/3D Models/Audi_R8_2017.obj',
		function (obj) {
			object = obj;
		},
		onProgress,
		onError
	);

	//////////////////////////////////////////////////////////////////////

	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 10;
	camera.position.x = 5;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer({ antialias: setAntialias, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth / 1.05, window.innerHeight / 1.05);
	renderer.shadowMap.enabled = true;

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	document.getElementById('3DModel').appendChild(renderer.domElement);

	printShotgun(scene);
	update(renderer, scene, camera, controls);

	return scene;
}

function printShotgun(obj) {
	console.log(obj);
}

function getBox(boxWidth, boxHeight, boxLength, boxColor) {
	var mesh = new THREE.Mesh(
		new THREE.BoxGeometry(boxWidth, boxHeight, boxLength),
		new THREE.MeshLambertMaterial({ color: boxColor, wireframe: showWireframe, }),
	);

	mesh.castShadow = true;
	return mesh;
}

function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight(0xffffff, intensity);

	return light;
}

function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;

	return light;
}

function loadModel() {
	object.traverse(function (child) {
		if (child.isMesh) {
			// printShotgun(child);
			child.material.map = texture;

		}
	});

	object.position.x = 0;
	object.position.y = 0;
	object.position.z = 0;

	scene.add(object);
}

function onProgress(xhr) {
	console.log('Model downloaded: ' + Math.round((xhr.loaded / xhr.total * 100), 2) + '% loaded');
};

function onError(error) {
	console.log('ERROR: Rendering Model');
};

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);

	requestAnimationFrame(function () {
		update(renderer, scene, camera, controls);
	});

}

var scene = init();
