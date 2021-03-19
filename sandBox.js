

function init() {

	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xffffff, 0.2);

	var box = getBox(1, 1, 1);
	box.position.y = box.geometry.parameters.height / 2;

	var plane = getPlane(20);
	plane.position.set(0, 0, 0)
	plane.rotation.x = Math.PI / 2;
	plane.name = 'plane-1';

	scene.add(box);
	// plane.add(box);
	scene.add(plane);

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set(1, 2, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xffffff);
	document.getElementById('webgl').appendChild(renderer.domElement);
	update(renderer, scene, camera);

	return scene;
}

function getBox(w, h, d) {
	return new THREE.Mesh(
		new THREE.BoxGeometry(w, h, d),
		new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
		}),
	);
}

function getPlane(size) {
	return new THREE.Mesh(
		new THREE.PlaneGeometry(size, size),
		new THREE.MeshBasicMaterial({
			color: 0x0f00f0,
			wireframe: false,
			side: THREE.DoubleSide,
		}),
	);
}

// Updates the browser to allow for animation.
function update(renderer, scene, camera) {
	renderer.render(
		scene,
		camera
	);

	// var plane = scene.getObjectByName('plane-1');
	// plane.rotation.x += 0.01;
	// plane.rotation.y += 0.01;

	// scene.traverse(function (child) {
	// 	child.scale.x += 0.001;
	// });

	requestAnimationFrame(function () {
		update(renderer, scene, camera);
	});
}

// Allow on the console to see the properties of the scene.
var scene = init();