/**
 * Astaire Fine Jewellery - Cinematic 3D Hero Background
 * Uses Three.js to create a subtle sparkle/particle field.
 */

class Hero3D {
    constructor() {
        this.container = document.getElementById('hero-canvas-container');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 1500;

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 12;
            colors[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create a circular sparkle texture
        const material = new THREE.PointsMaterial({
            size: 0.015,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.6,
            color: 0xd4a383, // Brand Peach Dark
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particlesGeometry, material);
        this.scene.add(this.particles);
    }

    addEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) - 0.5;
            this.mouseY = (event.clientY / window.innerHeight) - 0.5;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.00005;

        this.particles.rotation.y = time * 0.5;
        this.particles.rotation.x = time * 0.2;

        // Subtle mouse follow
        this.particles.position.x += (this.mouseX * 0.5 - this.particles.position.x) * 0.02;
        this.particles.position.y += (-this.mouseY * 0.5 - this.particles.position.y) * 0.02;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when library is loaded
window.addEventListener('load', () => {
    if (window.THREE) {
        new Hero3D();
    }
});
