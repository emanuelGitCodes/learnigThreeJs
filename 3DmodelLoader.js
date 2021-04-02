const canvas = document.getElementById('board');

const setAntialias = true;
const showWireframe = false;
const shapeShadows = false;
const sceneColor = 0xdddddd;

const cameraPositionX = 7;
const cameraPositionY = 3;
const cameraPositionZ = 1;
const cameraLookAtX = 0;
const cameraLookAtY = 0;
const cameraLookAtZ = -2;

let numberOfLights = 2
const sphereRadius = .1;
const sphereWidthSegments = 8;
const sphereHeightSegments = 8;
const sphereColor = 0xffffff;

const boxWidth = 0.3;
const boxHeight = 0.3;
const boxLength = 0.3;
const boxColor = 0x00fff0;

let object;
const manager = new THREE.LoadingManager(loadModel);
const loader = new THREE.OBJLoader(manager);
// manager.onProgress = function (item, loaded, total) {
// 	console.log(item, loaded, total);
// };

function init() {
	var gui = new dat.GUI();

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(sceneColor);

	var lightList = createLightEnvironment(scene, gui);

	var box = getBox(boxWidth, boxHeight, boxLength, boxColor);
	scene.add(box);

	loader.load(
		'/assets/obj/cerberus/Cerberus.obj',
		function (obj) {
			object = obj;
			object.scale.x = 5;
			object.scale.y = 5;
			object.scale.z = 5;
			printShotgun(obj);
		},
		onProgress,
		onError
	);

	// field of view || aspect ratio || near clipping plane || far clipping plane
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
	camera.lookAt(cameraLookAtX, cameraLookAtY, cameraLookAtZ);

	var renderer = new THREE.WebGLRenderer({ antialias: setAntialias, alpha: true });
	renderer.setSize(window.innerWidth / 1.05, window.innerHeight / 1.05);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target = new THREE.Vector3(cameraLookAtX, cameraLookAtY, cameraLookAtZ);
	document.getElementById('3DModel').appendChild(renderer.domElement);
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

function createLightEnvironment(scene, gui) {
	var lightList = [];

	for (var index = 0; index < numberOfLights; index++) {
		lightList[index] = getDirectionalLight(1);
		var sphere = getSphere(sphereRadius, sphereWidthSegments, sphereHeightSegments, sphereColor);
		lightList[index].add(sphere);

		(index % 2) === 0 ? lightList[index].position.set(15, 15, 15) : lightList[index].position.set(-15, 15, -15);

		gui.add(lightList[index], 'intensity', 0, 10);
		gui.add(lightList[index].position, 'x', -50, 50);
		gui.add(lightList[index].position, 'y', -50, 50);
		gui.add(lightList[index].position, 'z', -50, 50);

		scene.add(lightList[index]);
	}

	return lightList;
}

function getMaterialComposition(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 0xffffff : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
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
	var materialComposition = getMaterialComposition('phong', 0xdddddd);
	// printShotgun(materialComposition);

	object.traverse(function (child) {

		child.material = materialComposition;
		materialComposition.side = THREE.DoubleSide;
		materialComposition.map = new THREE.TextureLoader().load('assets/obj/cerberus/Cerberus_A.jpg');

		// materialComposition.bumpMap = new THREE.TextureLoader().load('assets/obj/cerberus/Cerberus_N.jpg');
		// materialComposition.metalnessMap = new THREE.TextureLoader().load('assets/obj/cerberus/Cerberus_M.jpg');
		// materialComposition.normalMap = new THREE.TextureLoader().load('assets/obj/cerberus/Cerberus_N.jpg');
		// materialComposition.roughnessMap = new THREE.TextureLoader().load('assets/obj/cerberus/Cerberus_R.jpg');

		materialComposition.bumpScale = 0;
		materialComposition.metalness = 1; // PURE METAL item == 1.0 and no greater
		materialComposition.roughness = 0; // Smooth Mirror reflection == 0 and no smaller;
		materialComposition.shininess = 100;
		materialComposition.wireframe = showWireframe;
		// .depthTest
		// .depthWrite when when drawing a 2D overlays
	});
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
