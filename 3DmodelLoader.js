const canvas = document.getElementById('model3D');

const setAntialias = false;
const showWireframe = false;
const shapeShadows = false;
const sceneColor = 0xdddddd;

const cameraPositionX = 2;
const cameraPositionY = 2;
const cameraPositionZ = 5;
const cameraLookAtX = 0;
const cameraLookAtY = 0;
const cameraLookAtZ = 0;

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
var objLocationStr = 'assets/vroom/3D Models/Audi_R8_2017.obj';
const mtlLoader = new THREE.MTLLoader();
const manager = new THREE.LoadingManager(loadModel);
const loader = new THREE.OBJLoader(manager);
manager.onProgress = function (item, loaded, total) {
	console.log(item, loaded, total);
};

function init() {
	var gui = new dat.GUI();

	var scene = new THREE.Scene();
	scene.background = new THREE.Color(sceneColor);

	var lightList = createLightEnvironment(scene, gui);

	var box = getBox(boxWidth, boxHeight, boxLength, boxColor);
	scene.add(box);

	// mtlLoader.load('assets/vroom/3D Models/Audi_R8_2017.mtl', (mtl) => {
	// 	printShotgun(mtl);
	// 	mtl.preload();

	loader.load(
		objLocationStr,
		function (obj) {
			object = obj;
			object.scale.x = 1;
			object.scale.y = 1;
			object.scale.z = 1;
			printShotgun(obj);
		},
		onProgress,
		onError
	);
	// });

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
	document.getElementById('model3D').appendChild(renderer.domElement);
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

		(index % 2) === 0 ? lightList[index].position.set(-25, 15, 15) : lightList[index].position.set(25, 15, -15);

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
		// Lower on the list equals more GPU demanding!
		// Keep in mind if ever doing mobiles.
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			// computes lighting only at vertices
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			// computes lighting at every pixel
			// texture focus on shininess
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			// textures focus on metalness & roughness
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		case 'physical':
			// textures focus on clearcoat & clearCoatRoughness
			selectedMaterial = new THREE.MeshPhysicalMaterial(materialOptions);
			break;
		default:
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function loadModel() {
	// Textures shade can change based on the color level
	var materialComposition = getMaterialComposition('basic', 0xcccccc);

	// mtlLoader.load('/assets/vroom/3D Models/Audi_R8_2017.mtl', (mtl) => {
	// 	object.setMaterials(mtl);

	object.traverse(function (child) {
		child.material = materialComposition;
		materialComposition.side = THREE.FrontSide; // Render outer layer only
		// materialComposition.map = new THREE.TextureLoader().load('assets/vroom/Renders/Audi_R8_2017.1.png');
		materialComposition.wrapS = THREE.RepeatWrapping;
		materialComposition.wrapT = THREE.RepeatWrapping;
		materialComposition.magFilter = THREE.NearestFilter
		materialComposition.bumpScale = 0;
		materialComposition.metalness = 0.1; // ONLY on STANDARD! 0 to 1.0 == PURE METAL item
		materialComposition.roughness = 0.4; // ONLY on STANDARD! Smooth Mirror reflection == 0 to 1
		materialComposition.shininess = 100; // Only on Phong! This is the opposite of shininess.
		materialComposition.wireframe = showWireframe;
		// .depthTest
		// .depthWrite when when drawing a 2D overlays
	});
	// });
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
