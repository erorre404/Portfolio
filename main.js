// --- Scene Setup ---
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true, // transparent background to blend with CSS if needed
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// --- Lighting ---
// Ambient light for base visibility
const ambientLight = new THREE.AmbientLight(0x0a0f1e, 2);
scene.add(ambientLight);

// Neon point lights
const cyanLight = new THREE.PointLight(0x00f3ff, 2, 100);
cyanLight.position.set(20, 20, 10);
scene.add(cyanLight);

const purpleLight = new THREE.PointLight(0xbc13fe, 2, 100);
purpleLight.position.set(-20, -20, 10);
scene.add(purpleLight);

// --- 3D Particle System ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 4000;

const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Distribute particles in a large spherical/cubic volume around the camera
    posArray[i] = (Math.random() - 0.5) * 200; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create materials for particles
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending // gives the neon glow effect
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// Optional: Add some larger glowing orbs
const orbGeometry = new THREE.SphereGeometry(1, 32, 32);

// Wireframe glowing sphere 1
const orbMaterial1 = new THREE.MeshBasicMaterial({ 
    color: 0x00f3ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.15 
});
const orb1 = new THREE.Mesh(orbGeometry, orbMaterial1);
orb1.position.set(15, 10, -10);
orb1.scale.set(5, 5, 5);
scene.add(orb1);

// Wireframe glowing sphere 2
const orbMaterial2 = new THREE.MeshBasicMaterial({ 
    color: 0xbc13fe, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.15 
});
const orb2 = new THREE.Mesh(orbGeometry, orbMaterial2);
orb2.position.set(-25, -20, -20);
orb2.scale.set(8, 8, 8);
scene.add(orb2);

// Wireframe glowing sphere 3 (far)
const orbMaterial3 = new THREE.MeshBasicMaterial({ 
    color: 0x00f3ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.1 
});
const orb3 = new THREE.Mesh(orbGeometry, orbMaterial3);
orb3.position.set(20, -40, -30);
orb3.scale.set(12, 12, 12);
scene.add(orb3);

// --- Interaction variables ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Mouse move event
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll event listener for camera movement (Parallax)
let scrollY = window.scrollY;
document.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particleMesh.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.x = elapsedTime * 0.02;

    // Rotate orbs
    orb1.rotation.x += 0.005;
    orb1.rotation.y += 0.005;
    
    orb2.rotation.x -= 0.002;
    orb2.rotation.y -= 0.003;

    orb3.rotation.z += 0.001;
    orb3.rotation.x += 0.002;

    // Camera positional logic based on scroll
    // Map scroll position to camera Z and Y
    const scrollFactor = scrollY * 0.01;
    camera.position.y = -scrollFactor * 3; // move camera down
    
    // Smooth mouse parallax effect (easing)
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Add subtle wobble to particles based on mouse
    particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
    particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);
    
    // Very subtle camera shake/movement based on mouse
    camera.position.x += (mouseX * 0.002 - camera.position.x) * 0.05;

    renderer.render(scene, camera);
}

animate();

// --- Scroll Reveal Animation ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
// Trigger once on load
reveal();

// --- 3D Hover Tilt Effect (Vanilla JS) ---
const cards = document.querySelectorAll('.glass-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease-out';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease-out';
    });
});
