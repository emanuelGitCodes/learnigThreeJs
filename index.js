
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Add img to obj
const cubeMaterials = [
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('img/1.png'), side: THREE.DoubleSide }), // LEFT
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/2.png'), side: THREE.DoubleSide }), // RIGHT
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/3.png'), side: THREE.DoubleSide }), // TOP
  new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('img/4.png'), side: THREE.DoubleSide }), // BOTTOM
  new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide }), // FRONT
  // new THREE.MeshBasicMaterial({ color: 0xfff00f, side: THREE.DoubleSide }), // BACK
];

// Shape
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshFaceMaterial(cubeMaterials);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Scene lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

// Allows for the resizing of browser
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

const animate = function () {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // cube.rotation.z += 0.01;

  renderer.render(scene, camera);
};

animate();