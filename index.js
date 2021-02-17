

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
  // new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('img/1.png'), side: THREE.DoubleSide }), // LEFT
  // new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/2.png'), side: THREE.DoubleSide }), // RIGHT
  // new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/3.png'), side: THREE.DoubleSide }), // TOP
  // new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('img/4.png'), side: THREE.DoubleSide }), // BOTTOM
  new THREE.MeshLambertMaterial({ color: 0xFF5733, side: THREE.DoubleSide }), // FRONT
  new THREE.MeshLambertMaterial({ color: 0x6495ED, side: THREE.DoubleSide }), // BACK
  new THREE.MeshLambertMaterial({ color: 0xDFFF00, side: THREE.DoubleSide }),
  new THREE.MeshLambertMaterial({ color: 0x40E0D0, side: THREE.DoubleSide }),
  new THREE.MeshLambertMaterial({ color: 0xDE3163, side: THREE.DoubleSide }),

];

// Shape
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshFaceMaterial(cubeMaterials);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Scene lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambientLight);

const light1 = new THREE.PointLight(0xffffff, 4, 50);
light1.position.set(10, 25, 25);
light1.castShadow = true;
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 4, 50);
light2.position.set(-10, -25, 25);
light2.castShadow = true;
scene.add(light2);


// Allows for the resizing of browser
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

const animate = function () {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // cube.rotation.z += 0.01;

  renderer.render(scene, camera);
};

animate();