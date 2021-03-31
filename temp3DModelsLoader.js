function init() {
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0xaaaaaa);

	var gui = new dat.GUI();

	// initialize objects
	var lightLeft = getSpotLight(1, 0xffffff);
	var lightRight = getSpotLight(1.25, 0xffffff);

	lightLeft.position.x = 6;
	lightLeft.position.y = 8;
	lightLeft.position.z = 12;

	lightRight.position.x = 50;
	lightRight.position.y = 14;
	lightRight.position.z = -6;

	// dat.gui
	gui.add(lightLeft, 'intensity', 0, 10);
	gui.add(lightLeft.position, 'x', -50, 50);
	gui.add(lightLeft.position, 'y', -50, 50);
	gui.add(lightLeft.position, 'z', -50, 50);

	gui.add(lightRight, 'intensity', 0, 10);
	gui.add(lightRight.position, 'x', -50, 50);
	gui.add(lightRight.position, 'y', -50, 50);
	gui.add(lightRight.position, 'z', -50, 50);

	// load the environment map
	var path = '/assets/cubemap/';
	var format = '.jpg';
	var fileNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

	var reflectionCube = new THREE.CubeTextureLoader().load(fileNames.map(function (fileName) {
		return path + fileName + format;
	}));
	// scene.background = reflectionCube;

	// add other objects to the scene
	scene.add(lightLeft);
	scene.add(lightRight);

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 80;
	camera.position.x = 0;
	camera.position.y = 30;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// load external geometry
	var loader = new THREE.OBJLoader();
	var textureLoader = new THREE.TextureLoader();

	// loader.load('/assets/vroomVroom/Audi_R8_2017.obj');
	loader.load(
		'/assets/spaceShip/Intergalactic_Spaceship-(Wavefront).obj',

		function (object) {
			var colorMap = textureLoader.load('/assets/models/head/Face_Color.jpg');
			var bumpMap = textureLoader.load('/assets/models/head/Face_Disp.jpg');
			var faceMaterial = getMaterial('standard', 0xffffff);

			object.traverse(function (child) {
				if (child.name == 'Plane') {
					child.visible = false;
				}
				if (child.name == 'Infinite') {
					child.material = faceMaterial;
					faceMaterial.roughness = 0.875;
					faceMaterial.map = colorMap;
					faceMaterial.bumpMap = bumpMap;
					faceMaterial.roughnessMap = bumpMap;
					faceMaterial.metalness = 0;
					faceMaterial.bumpScale = 0.175;
				}
			});

			object.scale.x = 10;
			object.scale.y = 10;
			object.scale.z = 10;

			object.position.z = 0;
			object.position.y = 0;
			scene.add(object);
		},

		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},

		function (error) {
			console.log('ERROR in model render');
		}

	);




	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	document.getElementById('webgl').appendChild(renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;
}

function getMaterial(type, color) {
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

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.001;

	return light;
}


function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight(0xffffff, intensity);

	return light;
}

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(function () {
		update(renderer, scene, camera, controls);
	});
}

var scene = init();
