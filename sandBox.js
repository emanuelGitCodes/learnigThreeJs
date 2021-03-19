function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();
	var clock = new THREE.Clock();

	var enableFog = false;

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2);
	}

	var box = getBox(1, 1, 1);
	var plane = getPlane(20);
	var pointLight = getPointLight(1);
	var pointLightSphere = getSphere(0.05);
	var spotLight = getSpotLight(1);
	var spotLightSphere = getSphere(0.05);
	var directionalLight = getDirectionalLight(1);
	var directionalLightSphere = getSphere(0.05);
	var ambientLight = getAmbientLight(0.5);
	var ambientLightSphere = getSphere(0.05);

	var helper = new THREE.CameraHelper(directionalLight.shadow.camera);

	var boxGrid = getBoxGrid(7, 1.5);

	plane.name = 'plane-1';
	boxGrid.name = 'boxGrid';

	box.position.y = box.geometry.parameters.height / 2;
	plane.rotation.x = Math.PI / 2;

	pointLight.intensity = 2;
	pointLight.position.set(0, 2, 0);
	spotLight.position.set(0, 4, 0);
	directionalLight.position.set(0, 6, 0);

	// scene.add(box);
	scene.add(plane);

	pointLight.add(pointLightSphere);
	// scene.add(pointLight);

	spotLight.add(spotLightSphere);
	// scene.add(spotLight);

	directionalLight.add(directionalLightSphere);
	scene.add(directionalLight);
	scene.add(helper);

	ambientLight.add(ambientLightSphere);
	scene.add(ambientLight);

	scene.add(boxGrid);

	// gui.add(pointLight, 'intensity', 0, 10);
	// gui.add(pointLight.position, 'x', -5, 5);
	// gui.add(pointLight.position, 'y', 0, 5);
	// gui.add(pointLight.position, 'z', -5, 5);

	// gui.add(spotLight, 'intensity', 0, 10);
	// // Penumbra is how hard the edge of the light is displayed.
	// gui.add(spotLight, 'penumbra', 0, 1);
	// gui.add(spotLight.position, 'x', 0, 20);
	// gui.add(spotLight.position, 'y', 0, 20);
	// gui.add(spotLight.position, 'z', 0, 20);

	gui.add(directionalLight, 'intensity', 0, 10);
	gui.add(directionalLight.position, 'x', -20, 20);
	gui.add(directionalLight.position, 'y', 0, 20);
	gui.add(directionalLight.position, 'z', -20, 20);

	gui.add(ambientLight, 'intensity', 0, 10);
	gui.add(ambientLight.position, 'x', -20, 20);
	gui.add(ambientLight.position, 'y', 0, 20);
	gui.add(ambientLight.position, 'z', -20, 20);

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);

	// var camera = new THREE.OrthographicCamera(
	// 	-15,
	// 	15,
	// 	15,
	// 	-15,
	// 	1,
	// 	1000
	// );
	camera.position.set(20, 20, 25);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xbbbbbb);
	document.getElementById('webgl').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls, clock);

	return scene;
}

function getBox(w, h, d) {
	var mesh = new THREE.Mesh(
		new THREE.BoxGeometry(w, h, d),
		new THREE.MeshPhongMaterial({ color: 0xbbbbbb, wireframe: false, }),
	);

	mesh.castShadow = true;
	return mesh;
}

// Create a grid of boxes of AREA = amount * amount
function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var index = 0; index < amount; index++) {
		var obj = getBox(1, 1, 1);
		obj.position.x = index * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height / 2;
		group.add(obj);

		for (var cnt = 0; cnt < amount; cnt++) {
			var obj = getBox(1, 1, 1);
			obj.position.x = index * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height / 2;
			obj.position.z = cnt * separationMultiplier;

			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount - 1)) / 2;
	group.position.y = 0;
	group.position.z = -(separationMultiplier * (amount - 1)) / 2;

	return group;
}

function getPlane(size) {
	var mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(size, size),
		new THREE.MeshPhongMaterial({ color: 0xbbbbbb, wireframe: false, side: THREE.DoubleSide, }),
	);

	mesh.receiveShadow = true;
	return mesh;
}

function getSphere(radius) {
	var mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 24, 24),
		new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, }),
	);

	return mesh;
}

function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;

	return light;
}

function getSpotLight(intensity) {
	var light = new THREE.SpotLight(0xffffff, intensity);
	light.castShadow = true;
	// Treat the light.shadow.bias on a case by case bases.
	light.shadow.bias = 0.001;
	// shadow.mapSize width and height default value is 1024.
	light.shadow.mapSize.width = 512;
	light.shadow.mapSize.height = 512;
	return light;
}

function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.camera.left = -10;
	light.shadow.camera.bottom = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;

	return light;
}

function getAmbientLight(intensity) {
	var light = new THREE.AmbientLight(0x000077, intensity);

	return light;
}

// Updates the browser to allow for animation.
function update(renderer, scene, camera, controls, clock) {
	renderer.render(
		scene,
		camera
	);

	controls.update();

	var timeElapsed = clock.getElapsedTime();
	var boxGrid = scene.getObjectByName('boxGrid');

	boxGrid.children.forEach(function (child, index) {
		var x = timeElapsed * 2 + index;
		child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;

		// Get a random unique value between 0 and pi/2, to that number we add
		//0.001 so it's not exactly flushed with the plane.
		// child.scale.y = (Math.sin(timeElapsed * 2 + index) + 1) / 2 + 0.001;
		child.position.y = child.scale.y / 2;
	});

	requestAnimationFrame(function () {
		update(renderer, scene, camera, controls, clock);
	});
}

var scene = init();