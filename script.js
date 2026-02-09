const canvas = document.querySelector('#bg');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,  
    window.innerWidth / window.innerHeight,  
    0.1, 
    1000 
);

const isMobile = window.innerWidth < 768;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


camera.position.z = 30;

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = isMobile ? 1500 : 3000; 

const positions = new Float32Array(particleCount * 3);  

const radius = isMobile ? 7 : 9; 

for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2; 
    const phi = Math.random() * Math.PI;  
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;      
    positions[i * 3 + 1] = y; 
    positions[i * 3 + 2] = z;  
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);

    const partColor = 0xfff0de;

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2, 
    color: partColor,  
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true 
});

const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
particleSystem.position.y = 3;

scene.add(particleSystem);


const floorGeometry = new THREE.PlaneGeometry(100, 100);

const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,  
    side: THREE.DoubleSide
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = Math.PI / 2;

floor.position.y = -20;

scene.add(floor);

const spotCount = isMobile ? 50 : 150;

const lightSpots = [];

for (let i = 0; i < spotCount; i++) {
    const spotGeometry = new THREE.CircleGeometry(0.5, 16);  
    
  const isSilver = Math.random() > 0.5;  
    const spotColor = isSilver ? 0xc0c0c0 : 0xffffff;  
    
    const spotMaterial = new THREE.MeshBasicMaterial({
        color: spotColor,
        transparent: true,
        opacity: 0.4,  
        blending: THREE.AdditiveBlending
    });
    
    const spot = new THREE.Mesh(spotGeometry, spotMaterial);
    
    spot.rotation.x = -Math.PI / 2;
    
    spot.position.y = -19.9;
 
    scene.add(spot);

    lightSpots.push({
        mesh: spot,
        angle: Math.random() * Math.PI * 2,  
        speed: 0.005 + Math.random() * 0.01, 
        distance: 5 + Math.random() * 20,  
        color: spotMaterial.color.clone()  
    });
}

function animate() {
    requestAnimationFrame(animate); 
    
    particleSystem.rotation.y += 0.002; 
    particleSystem.rotation.x += 0.001; 
    
    lightSpots.forEach(spot => {
        spot.angle += spot.speed;
        
        spot.mesh.position.x = Math.cos(spot.angle) * spot.distance;
        spot.mesh.position.z = Math.sin(spot.angle) * spot.distance;
    
    });

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
});

if (window.innerWidth < 768) {
    particlesMaterial.opacity = 0.3; 
    
    highlightMaterial.opacity = 0.2;
}