const canvas = document.getElementById('board');

const setAntialias = false;
const showWireframe = false;
const shapeShadows = false;
const sceneColor = 0xdddddd;

var cameraPositionX = 5;
var cameraPositionY = 5;
var cameraPositionZ = 5;

let numberOfLights = 2
const sphereRadius = .1;
const sphereWidthSegments = 8;
const sphereHeightSegments = 8;
const sphereColor = 0xffffff;

const boxWidth = 0.5;
const boxHeight = 0.5;
const boxLength = 0.5;
const boxColor = 0x00fff0;

let object;
const manager = new THREE.LoadingManager(loadModel);
// manager.onProgress = function (item, loaded, total) {
// 	console.log(item, loaded, total);
// };

const loader = new THREE.OBJLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
const texture = textureLoader.load('/assets/vroom/Renders/Audi_R8_2017.1.png');
const texture2 = textureLoader.load('/assets/vroom/Renders/Audi_R8_2017.5.png');
const calipers = textureLoader.load('/assets/vroom/Textures/redPistonsCalipers.jpg');
const tyres = textureLoader.load('/assets/vroom/Textures/Tyre.png');

function init() {
	var gui = new dat.GUI();

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(sceneColor);

	// var ambientLight = getAmbientLight(1);
	// scene.add(ambientLight);

	// Add Light environment
	var lightLeft = getDirectionalLight(1);
	var sphereLeft = getSphere(sphereRadius, sphereWidthSegments, sphereHeightSegments, sphereColor);
	var lightRight = getDirectionalLight(1);
	var sphereRight = getSphere(sphereRadius, sphereWidthSegments, sphereHeightSegments, sphereColor);

	lightLeft.add(sphereLeft);
	lightLeft.position.x = -15;
	lightLeft.position.y = -15;
	lightLeft.position.z = 15;

	lightRight.add(sphereRight);
	lightRight.position.x = 15;
	lightRight.position.y = 15;
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
			// printShotgun(obj);
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

	camera.position.x = cameraPositionX;
	camera.position.y = cameraPositionY;
	camera.position.z = cameraPositionZ;
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

function getSphere(sphereRadius, sphereWidthSegments, sphereHeightSegments, sphereColor) {
	var mesh = new THREE.Mesh(
		new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments),
		new THREE.MeshBasicMaterial({ color: sphereColor, wireframe: showWireframe, }),
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

function getMaterialComposition(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		// case 'phong':
		// 	selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
		// 	break;
		case 'phong':
			selectedMaterial = [
				new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide }),
				new THREE.MeshPhongMaterial({ map: texture2 }),
				new THREE.MeshPhongMaterial({ map: calipers }),
			];
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function loadModel() {
	var materialComposition = getMaterialComposition('phong', 0xeeeeee);

	object.traverse(function (child) {

		child.material = materialComposition;
		// materialComposition.bumpMap = calipers;
		materialComposition.bumpScale = 0.2;
		materialComposition.map = texture;
		// materialComposition.map = calipers;
		// materialComposition.map = tyres;
		materialComposition.metalness = 1.0; // PURE METAL item == 1.0 and no greater
		materialComposition.roughness = 0; // Smooth Mirror reflection == 0 and no smaller;
		// materialComposition.roughnessMap =
		materialComposition.wireframe = showWireframe;

		// .depthTest
		// .depthWrite when when drawing a 2D overlays

		printShotgun(child);
	});

	object.position.x = 0;
	object.position.y = 0;
	object.position.z = 0;
	printShotgun(object);
	scene.add(object);
}

// function loadModel() {
// 	object.traverse(function (child) {
// 		if (child.isMesh) {
// 			// printShotgun(child);
// 			// child.material.map = texture;
// 			child.material.map = texture2;

// 		}
// 	});

// 	object.position.x = 0;
// 	object.position.y = 0;
// 	object.position.z = 0;

// 	scene.add(object);
// }

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
