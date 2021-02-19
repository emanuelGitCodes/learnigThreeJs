
let boxDimensions = 5; // length of one side
let numberOfLights = 5;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
camera.position.set(0, 0, boxDimensions * 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Allows for the resizing of browser
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Scene lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// Point light
const lights = [numberOfLights];

for (index = 0; index <= numberOfLights; index++) {
  lights[index] = new THREE.PointLight(0xffffff, 1.2, 100);
  lights[index].castShadow = true;
}

for (index = 0; index <= numberOfLights; index++) {
  scene.add(lights[index]);
}

// Top 3 lights
lights[0].position.set(8, 8, 0);
lights[1].position.set(-5, 8, -8);
lights[2].position.set(-5, 8, 8);

// // Bottom 3 lights
lights[3].position.set(8, -8, 0);
lights[4].position.set(-5, -8, -8);
lights[5].position.set(-5, -8, 8);

// dynamic moving lighting
function dynamicLighting() {
  var time = Date.now() * 0.0005;
  lights[0].position.x = Math.sin(time * 0.7) * 30;
  lights[0].position.y = Math.cos(time * 0.5) * 40;
  lights[0].position.z = Math.cos(time * 0.3) * 30;

  lights[1].position.x = Math.cos(time * 0.3) * 30;
  lights[1].position.y = Math.sin(time * 0.5) * 40;
  lights[1].position.z = Math.sin(time * 0.7) * 30;
}

// Add img to obj
const cubeMaterials = [
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('img/zelda.jpeg'), side: THREE.FrontSide }), // LEFT
  new THREE.MeshLambertMaterial({ color: 0x6495ED, side: THREE.FrontSide }), // RIGHT
  new THREE.MeshLambertMaterial({ color: 0xDFFF00, side: THREE.DoubleSide }), // TOP
  new THREE.MeshLambertMaterial({ color: 0x40E0D0, side: THREE.FrontSide }), // BOTTOM
  new THREE.MeshLambertMaterial({ color: 0xDE3163, side: THREE.DoubleSide }), // FRONT
];

// OBJ being render
const geometry = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);
const material = new THREE.MeshFaceMaterial(cubeMaterials);
// const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = false;
scene.add(cube);


const animate = function () {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // cube.rotation.z += 0.01;

  dynamicLighting();
  renderer.render(scene, camera);
};

animate();
