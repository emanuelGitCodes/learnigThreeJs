
const sceneTransparentColor = 0x000000
const setAntialias = true;

const cameraAxisX = 0;
const cameraAxisY = 0;
const cameraAxisZ = 5;

const numberOfLights = 2
const lights = [numberOfLights];
const lightCastShadow = true;
var lightColor = 0xffffff;

const showWireframe = false;
const shapeShadows = true;

const coneRadius = .8;
const coneHeight = 1.5;
const coneRadialSegments = 4;
const coneHeightSegments = 128;
const coneColor = 0x00cccc;
var coneAxisX = -2.5;
var coneAxisY = 0;
var coneAxisZ = 0;
var coneRotateX = Math.PI / 2;
var coneRotateY = 0;
var coneRotateZ = Math.PI / 2;

const rectangleWidth = .6;
var rectangleHeight = 4;
const rectangleLength = .6;
const rectangleColor = 0x00cccc;
var rectangleAxisX = 0;
var rectangleAxisY = 0;
var rectangleAxisZ = 0;
var rectangleRotateX = Math.PI / 2;
var rectangleRotateY = 0;
var rectangleRotateZ = 0;

const cylinderRadius = .3;
var cylinderLength = 4;
const cylinderRadialSegments = 16;
const cylinderHeightSegments = 16;
const cylinderColor = 0x00cc00;
var cylinderAxisX = 0;
var cylinderAxisY = -1;
var cylinderAxisZ = 0;
var cylinderRotateX = 0;
var cylinderRotateY = 0;
var cylinderRotateZ = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(cameraAxisX, cameraAxisY, cameraAxisZ);

const renderer = new THREE.WebGLRenderer({ antialias: setAntialias, alpha: true });
renderer.setClearColor(sceneTransparentColor, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// const canvas =
// 	document.getElementById('board').appendChild(renderer.domElement);
// canvas.setAttribute('id', '3D');
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Light Environment ********************************************************************

for (index = 0; index <= numberOfLights; index++) {
  lights[index] = new THREE.PointLight(lightColor, 1.2, 100);
  lights[index].position.set(
    Math.floor(Math.random() * Math.floor(11)),
    Math.floor(Math.random() * Math.floor(11)),
    Math.floor(Math.random() * Math.floor(11)),
  );
  lights[index].castShadow = lightCastShadow;
  scene.add(lights[index]);
}

function dynamicLighting() {
  var time = Date.now() * 0.0005;
  for (index = 0; index <= numberOfLights; index++) {
    if ((index % 2) == 0) {
      lights[index].position.x = Math.sin(time * 0.7) * 30;
      lights[index].position.y = Math.cos(time * 0.5) * 40;
      lights[index].position.z = Math.cos(time * 0.3) * 30;
    }

    if ((index % 2) != 0) {
      lights[index].position.x = Math.cos(time * 0.3) * 30;
      lights[index].position.y = Math.sin(time * 0.5) * 40;
      lights[index].position.z = Math.sin(time * 0.7) * 30;
    }
  }
}

// SHAPES *******************************************************************************
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(coneRadius, coneHeight, coneRadialSegments, coneHeightSegments),
  new THREE.MeshLambertMaterial({ color: coneColor, wireframe: showWireframe })
);
cone.castShadow = true;
cone.receiveShadow = shapeShadows;
cone.position.set(coneAxisX, coneAxisY, coneAxisZ);
cone.rotation.x += coneRotateX;
cone.rotation.y += coneRotateY;
cone.rotation.z += coneRotateZ;

const rectangle = new THREE.Mesh(
  new THREE.BoxGeometry(rectangleWidth, rectangleHeight, rectangleLength),
  new THREE.MeshLambertMaterial({ color: rectangleColor, wireframe: showWireframe })
);
rectangle.castShadow = true;
rectangle.receiveShadow = shapeShadows;
rectangle.position.set(rectangleAxisX, rectangleAxisY, rectangleAxisZ);
rectangle.rotation.z += rectangleRotateX;
rectangle.rotation.y += rectangleRotateY;
rectangle.rotation.z += rectangleRotateZ;

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderLength, cylinderRadialSegments, cylinderHeightSegments),
  new THREE.MeshLambertMaterial({ color: cylinderColor, wireframe: showWireframe }),
);
cylinder.castShadow = true;
cylinder.receiveShadow = shapeShadows;
cylinder.position.set(cylinderAxisX, cylinderAxisY, cylinderAxisZ);
cylinder.rotation.x += cylinderRotateX;
cylinder.rotation.y += cylinderRotateY;
cylinder.rotation.z += cylinderRotateZ;

const arrow = new THREE.Group();
arrow.add(cone);
arrow.add(rectangle);
arrow.add(cylinder);
scene.add(arrow);

// FUNCTIONS CALLS **********************************************************************
const animate = function () {
  requestAnimationFrame(animate);
  dynamicLighting();
  renderer.render(scene, camera);
};

animate();