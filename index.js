
let boxDimensions = 5; // length of one side

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
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
// Reduce code using loop
const light = [];
light[0] = new THREE.PointLight(0xffffff, 1.2, 100);
light[1] = new THREE.PointLight(0xffffff, 1.2, 100);
light[2] = new THREE.PointLight(0xffffff, 1.2, 100);
light[3] = new THREE.PointLight(0xffffff, 1.2, 100);
light[4] = new THREE.PointLight(0xffffff, 1.2, 100);
light[5] = new THREE.PointLight(0xffffff, 1.2, 100);

light[0].castShadow = true;
light[1].castShadow = true;
light[2].castShadow = true;
light[3].castShadow = true;
light[4].castShadow = true;
light[5].castShadow = true;

// Top 3 lights
light[0].position.set(8, 8, 0);
light[1].position.set(-5, 8, -8);
light[2].position.set(-5, 8, 8);

// // Bottom 3 lights
light[3].position.set(8, -8, 0);
light[4].position.set(-5, -8, -8);
light[5].position.set(-5, -8, 8);

scene.add(light[0]);
scene.add(light[1]);
scene.add(light[2]);
scene.add(light[3]);
scene.add(light[4]);
scene.add(light[5]);

// dynamic moving lighting
function dynamicLighting() {
  var time = Date.now() * 0.0005;
  light[0].position.x = Math.sin(time * 0.7) * 30;
  light[0].position.y = Math.cos(time * 0.5) * 40;
  light[0].position.z = Math.cos(time * 0.3) * 30;

  light[1].position.x = Math.cos(time * 0.3) * 30;
  light[1].position.y = Math.sin(time * 0.5) * 40;
  light[1].position.z = Math.sin(time * 0.7) * 30;
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
  cube.rotation.y += 0.01;
  // cube.rotation.z += 0.01;

  dynamicLighting();
  renderer.render(scene, camera);
};

animate();
