// Get the canvas element
const canvas = document.querySelector('#bg');

// Create the scene (your 3D world)
const scene = new THREE.Scene();

// Create the camera (your viewpoint)
const camera = new THREE.PerspectiveCamera(
    75,  // Field of view
    window.innerWidth / window.innerHeight,  // Aspect ratio
    0.1,  // Near clipping plane
    1000  // Far clipping plane
);

// Create the renderer (what draws to the canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true  // Transparent background
});

// Set the size to fill the window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Move camera back so we can see things
camera.position.z = 30;

// Create particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 3000;  // Number of particles

// Array to hold particle positions
const positions = new Float32Array(particleCount * 3);  // x, y, z for each particle

// Disco ball settings
const radius = 9;  // Size of the disco ball

// Create particles in a sphere shape
for (let i = 0; i < particleCount; i++) {
    // Random angles for sphere positioning
    const theta = Math.random() * Math.PI * 2;  // Horizontal angle (0 to 360°)
    const phi = Math.random() * Math.PI;  // Vertical angle (0 to 180°)
    
    // Convert sphere coordinates to x, y, z
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Store in positions array
    positions[i * 3] = x;      // x position
    positions[i * 3 + 1] = y;  // y position
    positions[i * 3 + 2] = z;  // z position
}

// Add positions to geometry
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);

 const isSilver = Math.random() > 0.5;  // Randomly choose silver or gold
    const partColor = 0xfff0de;

// Create particle material (how they look)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,  // Size of each particle
    color: partColor,  
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true  // Particles get smaller with distance
});

// Create the particle system
const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
particleSystem.position.y = 3;

// Add to scene
scene.add(particleSystem);

// ===== CREATE FLOOR =====

// Floor geometry (large flat plane)
const floorGeometry = new THREE.PlaneGeometry(100, 100);

// Floor material (dark, so lights show up well)
const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,  
    side: THREE.DoubleSide
});

// Create floor mesh
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

// Rotate floor to be horizontal (default is vertical)
floor.rotation.x = Math.PI / 2;

// Position floor below the disco ball
floor.position.y = -20;

// Add to scene
scene.add(floor);

// ===== LIGHT REFLECTION SPOTS =====

// Number of light spots
const spotCount = 150;

// Create light spots (circles on the floor)
const lightSpots = [];

for (let i = 0; i < spotCount; i++) {
    // Create a small circle for each light spot
    const spotGeometry = new THREE.CircleGeometry(0.5, 16);  // Smaller: 0.5 instead of 1.5
    
  const isSilver = Math.random() > 0.5;  // Randomly choose silver or gold
    const spotColor = isSilver ? 0xc0c0c0 : 0xffffff;  // Silver or gold
    
    const spotMaterial = new THREE.MeshBasicMaterial({
        color: spotColor,
        transparent: true,
        opacity: 0.4,  // More subtle: 0.4 instead of 0.7
        blending: THREE.AdditiveBlending
    });
    
    const spot = new THREE.Mesh(spotGeometry, spotMaterial);
    
    // Rotate to lie flat on floor
    spot.rotation.x = -Math.PI / 2;
    
    // Position on floor
    spot.position.y = -19.9;  // Just slightly above floor to avoid z-fighting
    
    // Add to scene
    scene.add(spot);
    
    // Store for animation
    lightSpots.push({
        mesh: spot,
        angle: Math.random() * Math.PI * 2,  // Starting angle
        speed: 0.007 + Math.random() * 0.01,  // How fast it moves
        distance: 5 + Math.random() * 20,   // How far from center
        color: spotMaterial.color.clone()    // Store original color
    });
}

// Animation function
function animate() {
    requestAnimationFrame(animate);  // Loop continuously
    
    // Rotate the disco ball
    particleSystem.rotation.y += 0.002;  // Spin horizontally
    particleSystem.rotation.x += 0.001;  // Slight vertical spin
    
// Animate light reflection spots
    lightSpots.forEach(spot => {
        // Update angle (makes it orbit)
        spot.angle += spot.speed;
        
        // Calculate new position (circular motion around center)
        spot.mesh.position.x = Math.cos(spot.angle) * spot.distance;
        spot.mesh.position.z = Math.sin(spot.angle) * spot.distance;
    
    });

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Update when window is resized
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});