function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();

	var enableFog = false;

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.2);
	}

	var box = getBox(1, 1, 1);
	var plane = getPlane(20);
	var pointLight = getPointLight(1);
	var sphere = getSphere(0.05);

	plane.name = 'plane-1';

	box.position.y = box.geometry.parameters.height / 2;
	plane.rotation.x = Math.PI / 2;
	pointLight.position.set(0, 2, 0);
	pointLight.intensity = 2;

	scene.add(box);
	scene.add(plane);
	pointLight.add(sphere);
	scene.add(pointLight);

	gui.add(pointLight, 'intensity', 0, 10);
	gui.add(pointLight.position, 'x', -5, 5);
	gui.add(pointLight.position, 'y', 0, 5);
	gui.add(pointLight.position, 'z', -5, 5);

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);

	camera.position.set(1, 2, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xbbbbbb);
	document.getElementById('webgl').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls);

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

// Updates the browser to allow for animation.
function update(renderer, scene, camera, controls) {
	renderer.render(
		scene,
		camera
	);

	controls.update();

	requestAnimationFrame(function () {
		update(renderer, scene, camera, controls);
	});
}

var scene = init();