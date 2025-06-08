// ==================== DOM Elements ====================
const loader = document.querySelector('.loader-container');
const percentBar = document.querySelector('.percent-bar');
const customCursor = document.querySelector('.custom-cursor');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const allNavLinks = document.querySelectorAll('.nav-link');
const nav = document.querySelector('nav');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const statsNumbers = document.querySelectorAll('.stat-number');
const progressBars = document.querySelectorAll('.progress-bar');
const testimonialDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialsContainer = document.querySelector('.testimonials-container');
const glitchText = document.querySelector('.glitch-text');

// ==================== General Variables ====================
let currentTestimonial = 0;
let isAnimating = false;
let isLoaded = false;
let mouseX = 0;
let mouseY = 0;
let testimonialInterval;
let isPaused = false;
let originalGlitchText = '';

// ==================== Loader Animation ====================
const startLoading = () => {
    let loadingProgress = 0;
    const interval = setInterval(() => {
        loadingProgress += Math.floor(Math.random() * 10) + 15;
        if (loadingProgress > 100) loadingProgress = 100;
        
        percentBar.style.width = `${loadingProgress}%`;
        
        if (loadingProgress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                isLoaded = true;
                loader.classList.add('hidden');
                initAnimations();
                
                // Add reveal animation to body
                gsap.to('body', {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
    }, 100);
        }
    }, 20);
};



// Separate render function for better performance
const renderCursor = () => {
    // Apply position with hardware acceleration
    customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    
    // Create trail with lower frequency
    if (Math.random() > 0.1 && isLoaded) {
        createCursorTrail();
    }
    
    // Continue the animation loop
    rafID = requestAnimationFrame(renderCursor);
};

const expandCursor = () => {
    if (!isLoaded) return;
    customCursor.classList.add('expandCursor');
};

const shrinkCursor = () => {
    if (!isLoaded) return;
    customCursor.classList.remove('expandCursor');
};

// Simplified trail creation
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    
    // Use translate3d for hardware acceleration
    trail.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    
    // Add random size variation
    const size = 8 + Math.random() * 7;
    trail.style.width = `${size}px`;
    trail.style.height = `${size}px`;
    
    document.body.appendChild(trail);
    
    // Auto-remove after animation
    setTimeout(() => {
        if (trail && trail.parentNode) {
            document.body.removeChild(trail);
        }
    }, 600);
};

// Add pulsing animation to cursor
const startCursorPulse = () => {
    if (!isLoaded) return;
    
    setInterval(() => {
        if (!customCursor.classList.contains('expandCursor')) {
            // Set custom properties for current position before pulsing
            customCursor.style.setProperty('--x', `${cursorX}px`);
            customCursor.style.setProperty('--y', `${cursorY}px`);
            
            customCursor.classList.add('pulse');
            setTimeout(() => {
                customCursor.classList.remove('pulse');
            }, 800);
        }
    }, 3000);
};

// Add glitch effect to hero text
const startGlitchEffect = () => {
    const glitchText = document.querySelector('.glitch-text');
    if (!glitchText) return;
    
    // Store the original text content
    const originalName = glitchText.querySelector('.highlight').textContent;
    
    // Define the glitch character set
    const glitchChars = '</;#{*?$%>@&^~[]{}`!|\\';
    
    // Function to apply a glitch to the name
    const applyGlitch = () => {
        if (!isLoaded) return;
        
        const nameElement = glitchText.querySelector('.highlight');
        if (!nameElement) return;
        
        let glitchedName = '';
        
        // Determine how many characters to glitch (between 1 and 3)
        const glitchCount = Math.floor(Math.random() * 3) + 1;
        
        // Pick random positions to glitch
        const positions = [];
        for (let i = 0; i < glitchCount; i++) {
            positions.push(Math.floor(Math.random() * originalName.length));
        }
        
        // Create the glitched name
        for (let i = 0; i < originalName.length; i++) {
            if (positions.includes(i)) {
                glitchedName += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchedName += originalName[i];
            }
        }
        
        // Apply the glitched name
        nameElement.textContent = glitchedName;
        
        // Reset after a short delay
        setTimeout(() => {
            nameElement.textContent = originalName;
        }, 100);
    };
    
    // Apply glitch at random intervals
    const randomGlitch = () => {
        const minDelay = 2000; // Minimum time between glitches (ms)
        const maxDelay = 5000; // Maximum time between glitches (ms)
        const glitchDuration = Math.random() * (maxDelay - minDelay) + minDelay;
        
        setTimeout(() => {
            // Apply multiple glitches in quick succession for a more intense effect
            const glitchIntensity = Math.floor(Math.random() * 3) + 2; // 2-4 glitches in succession
            
            for (let i = 0; i < glitchIntensity; i++) {
                setTimeout(applyGlitch, i * 150);
            }
            
            // Continue with random glitches
            if (isLoaded) {
                randomGlitch();
            }
        }, glitchDuration);
    };
    
    // Start the random glitching
    randomGlitch();
};

// ==================== Navigation ====================
const toggleMenu = () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
};

const closeMenu = () => {
    navLinks.classList.remove('active');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
};

// toggleTheme function is kept for backward compatibility but won't be used
const toggleTheme = () => {
    // This function is kept for backward compatibility
    // But we're forcing dark mode
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
};

const checkTheme = () => {
    // Always use dark mode
    localStorage.setItem('theme', 'dark');
    // Add dark mode if it was not previously set
    document.body.classList.add('dark-mode');
};

const handleScroll = () => {
    const scrollPos = window.scrollY;
    
    if (scrollPos > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

// ==================== Projects Filter ====================
const filterProjects = (category) => {
    projectCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.classList.add('visible');
            gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out',
                delay: Math.random() * 0.3
            });
        } else {
            card.classList.remove('visible');
            gsap.to(card, {
                opacity: 0.3,
                y: 30,
                scale: 0.95,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });
};

// ==================== Stats Counter Animation ====================
const animateStats = () => {
    statsNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        let count = 0;
        const increment = target / 50;
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                stat.textContent = Math.ceil(count);
                setTimeout(updateCount, 30);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCount();
    });
};

// ==================== Progress Bars Animation ====================
const animateProgressBars = () => {
    progressBars.forEach(bar => {
        const percent = bar.dataset.percent;
        gsap.to(bar, {
            width: `${percent}%`,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
};

// ==================== Testimonial Slider ====================
const showTestimonial = (index) => {
    if (isAnimating) return;
    isAnimating = true;
    
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
        dot.classList.remove('pulsing');
    });
    testimonialDots[index].classList.add('active');
    
    // Add pulsing animation if not paused
    if (!isPaused) {
        testimonialDots[index].classList.add('pulsing');
    }
    
    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
        }
    });
    
    // Create a smoother, more relaxing transition
    tl.to('.testimonial-card', {
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.05
    })
    .set('.testimonial-card', { display: 'none' })
    .set(testimonialCards[index], { display: 'block', scale: 0.98 })
    .to(testimonialCards[index], {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
    });
    
    currentTestimonial = index;
};

const nextTestimonial = () => {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
};

const prevTestimonial = () => {
    const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(prev);
};

// Auto slide testimonials
const startTestimonialAutoSlide = () => {
    stopTestimonialAutoSlide(); // Clear any existing interval
    testimonialInterval = setInterval(() => {
        if (!isPaused) {
            nextTestimonial();
        }
    }, 7500); // Change slide every 3.5 seconds
    
    // Add pulse animation to active dot
    document.querySelector('.dot.active').classList.add('pulsing');
};

const stopTestimonialAutoSlide = () => {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
};



// ==================== GSAP Animations ====================
const initAnimations = () => {
    console.log("Initializing all animations...");
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Project cards reveal animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.projects-section',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            onStart: () => {
                card.classList.add('visible');
            }
        });
    });
    
    // Skills cards reveal animation
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1
        });
    });
    
    // About section animation
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-image',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });
    
    // Contact section animation - basic animations (keeping for backwards compatibility)
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.contact-form-container', {
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });
    
    // Stats animation
    ScrollTrigger.create({
        trigger: '.stats-container',
        start: 'top bottom-=150',
        onEnter: () => animateStats()
    });
    
    // Progress bars animation
    ScrollTrigger.create({
        trigger: '.skills-grid',
        start: 'top bottom-=150',
        onEnter: () => animateProgressBars()
    });
    
    // Explicitly call the contact animations
    console.log("About to initialize contact animations...");
    initContactAnimations();
};

// ==================== THREE.JS 3D ANIMATIONS ====================

// Hero Section 3D Animation
const initHero3D = () => {
    // If we're on mobile and the flag is set, don't initialize
    if (window.preventHero3D) {
        return () => {}; // Return empty cleanup function
    }
    
    const container = document.getElementById('hero-3d-space');
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x6c63ff, // Primary theme color
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add a torus knot for visual interest
    const geometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x6c63ff, // Primary theme color
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.001;
        particlesMesh.rotation.y += 0.001;
        
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;
        
        // Responsive to mouse
        particlesMesh.rotation.x += mouseY * 0.01;
        particlesMesh.rotation.y += mouseX * 0.01;
        
        torusKnot.rotation.x += mouseY * 0.01;
        torusKnot.rotation.y += mouseX * 0.01;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up function
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        container.removeChild(renderer.domElement);
    };
};

// Skills Section 3D Animation
const initSkills3D = () => {
    const container = document.getElementById('skills-3d-space');
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create particles for a premium look
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 700;
    
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        // Position particles in a sphere-like shape
        const radius = 25 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random scales for particles
        scaleArray[i] = Math.random() * 1.5 + 0.5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Custom shader material for more beautiful particles
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color(0x6c63ff) },
            color2: { value: new THREE.Color(0x00c9a7) },
            time: { value: 0 }
        },
        vertexShader: `
            attribute float scale;
            uniform float time;
            varying vec3 vColor;
            
            void main() {
                // Oscillating movement
                vec3 pos = position;
                pos.x += sin(pos.y * 0.05 + time) * 1.5;
                pos.y += cos(pos.x * 0.05 + time) * 1.5;
                pos.z += sin(pos.z * 0.05 + time) * 1.5;
                
                // Calculate color based on position
                float colorMix = smoothstep(-20.0, 20.0, position.y);
                vColor = mix(vec3(0.424, 0.388, 1.0), vec3(0.0, 0.788, 0.655), colorMix);
                
                // Position and size
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = scale * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Create a circular particle
                float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                
                // Apply color and fading edges
                gl_FragColor = vec4(vColor, strength * 0.7);
            }
        `,
            transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Create glowing tech icons (small glowing spheres)
    const iconGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const iconCount = 10;
    const icons = [];
    
    for (let i = 0; i < iconCount; i++) {
        // Create a glowing material
        const color = i % 2 === 0 ? 0x6c63ff : 0x00c9a7;
        const iconMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const icon = new THREE.Mesh(iconGeometry, iconMaterial);
        
        // Position randomly but more concentrated near the center
        const distance = 8 + Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 20;
        
        icon.position.x = Math.cos(angle) * distance;
        icon.position.y = height;
        icon.position.z = Math.sin(angle) * distance;
        
        // Add a point light for glow effect
        const light = new THREE.PointLight(color, 1, 10);
        light.position.copy(icon.position);
        
        // Store icon properties for animation
        icon.userData = {
            orbitRadius: distance,
            orbitAngle: angle,
            orbitSpeed: 0.001 + Math.random() * 0.003,
            pulseSpeed: 0.01 + Math.random() * 0.03,
            light: light
        };
        
        icons.push(icon);
        scene.add(icon);
        scene.add(light);
    }
    
    // Add connecting lines between nearby icons (like a network)
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.2
    });
    
    const linesGeometry = new THREE.BufferGeometry();
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);
    
    // Function to update the lines
    const updateLines = () => {
        linesGroup.clear();
        
        for (let i = 0; i < icons.length; i++) {
            for (let j = i + 1; j < icons.length; j++) {
                const distance = icons[i].position.distanceTo(icons[j].position);
                
                if (distance < 15) {
                    const opacity = 1 - distance / 15;
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x6c63ff,
                        transparent: true,
                        opacity: opacity * 0.3
                    });
                    
                    const points = [icons[i].position.clone(), icons[j].position.clone()];
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    linesGroup.add(line);
                }
            }
        }
    };
    
    // Animation
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        
        time += 0.01;
        particlesMaterial.uniforms.time.value = time;
        
        // Slowly rotate the entire particle system
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x = Math.sin(time * 0.1) * 0.1;
        
        // Animate each tech icon
        icons.forEach(icon => {
            // Orbit animation
            icon.userData.orbitAngle += icon.userData.orbitSpeed;
            icon.position.x = Math.cos(icon.userData.orbitAngle) * icon.userData.orbitRadius;
            icon.position.z = Math.sin(icon.userData.orbitAngle) * icon.userData.orbitRadius;
            
            // Pulsing animation
            const pulse = Math.sin(time * icon.userData.pulseSpeed) * 0.3 + 0.7;
            icon.scale.set(pulse, pulse, pulse);
            
            // Update light position
            icon.userData.light.position.copy(icon.position);
            icon.userData.light.intensity = pulse;
        });
        
        // Update connecting lines
        if (time % 0.5 < 0.01) {
            updateLines();
        }
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle mouse movement for interactive effect
    const handleMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Subtle rotation based on mouse position
        particleSystem.rotation.y = mouseX * 0.3;
        particleSystem.rotation.x = mouseY * 0.3;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up function
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeChild(renderer.domElement);
    };
};

// Skills Progress Animation
const animateSkills = () => {
    const skillElements = document.querySelectorAll('.premium-skill-progress');
    
    skillElements.forEach(skill => {
        // Get the target width from inline style
        const targetWidth = skill.style.width;
        
        // Set all skills to consistent silver styling
        skill.style.background = "linear-gradient(90deg, rgba(192, 192, 200, 1), rgba(220, 220, 230, 1), rgba(192, 192, 200, 1), rgba(230, 230, 240, 1))";
        skill.style.backgroundSize = "200% 100%";
        skill.style.boxShadow = "0 0 8px rgba(192, 192, 200, 0.6)";
        
        // Force the width to match the percentage immediately
        skill.style.width = targetWidth;
        
        // Add animation manually
        skill.style.animation = "silverShine 2s infinite ease-in-out";
    });
    
    // Add floating skill elements to the 3D container
    addFloatingSkills();
};

// Add floating skill elements to the background
const addFloatingSkills = () => {
    const container = document.getElementById('skills-3d-space');
    if (!container) return;
    
    // Only add floating skills if they don't already exist
    if (container.querySelector('.floating-skill')) return;
    
    const skills = [
        'HTML5', 'CSS3', 'JavaScript', 'React', 
        'Node.js', 'SASS', 'Git', 'UI/UX'
    ];
    
    const colors = [
        '#6c63ff', '#00c9a7', '#ff6b6b', '#feca57',
        '#1dd1a1', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];
    
    // Create floating skill elements
    skills.forEach((skill, index) => {
        const element = document.createElement('div');
        element.className = 'floating-skill';
        element.textContent = skill;
        element.style.backgroundColor = colors[index % colors.length];
        
        // Random positioning
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        const zPos = Math.random() * 50 - 25;
        const scale = 0.8 + Math.random() * 0.4;
        const rotation = Math.random() * 20 - 10;
        
        element.style.left = `${xPos}%`;
        element.style.top = `${yPos}%`;
        element.style.transform = `translateZ(${zPos}px) scale(${scale}) rotate(${rotation}deg)`;
        
        // Animation duration and delay
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * -20;
        
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        
        container.appendChild(element);
    });
};

// Contact Section Animations
const initContactAnimations = () => {
    console.log("Contact animations initializing...");
    
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-container');
    const contactItems = document.querySelectorAll('.contact-item');
    const socialIcons = document.querySelectorAll('.contact-social .social-icon');
    
    // Set initial visibility for all elements
    if (contactInfo) contactInfo.style.opacity = "1";
    if (contactForm) contactForm.style.opacity = "1";
    contactItems.forEach(item => item.style.opacity = "1");
    socialIcons.forEach(icon => icon.style.opacity = "1");
    
    console.log("Contact elements found:", {
        "contactInfo": contactInfo ? "Found" : "Not found",
        "contactForm": contactForm ? "Found" : "Not found",
        "contactItems": contactItems.length,
        "socialIcons": socialIcons.length
    });
    
    // Only run GSAP animations if ScrollTrigger is available
    if (window.ScrollTrigger && gsap) {
        // Staggered animation for contact items
        gsap.from(contactItems, {
            scrollTrigger: {
                trigger: contactInfo,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            opacity: 0.5, // Start with partial opacity
            x: -50,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Animation for contact form
        gsap.from(contactForm, {
            scrollTrigger: {
                trigger: contactForm,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            opacity: 0.5, // Start with partial opacity
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Staggered animation for social icons
        gsap.from(socialIcons, {
            scrollTrigger: {
                trigger: '.contact-social',
                start: 'top bottom-=50',
                toggleActions: 'play none none none'
            },
            opacity: 0.5, // Start with partial opacity
            y: 30,
            scale: 0.5,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
        
        console.log("GSAP animations applied");
    } else {
        console.log("GSAP or ScrollTrigger not available, skipping animations");
    }
    
    // Form input focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add active class to parent when input is focused
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-active');
        });
        
        // Remove active class when input loses focus
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('input-active');
            }
        });
        
        // Check if input has value on page load
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('input-active');
        }
    });
    
    // Add subtle parallax effect to contact info
    window.addEventListener('mousemove', e => {
        if (!contactInfo) return; // Skip if element not found
        
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        gsap.to(contactInfo, {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: 'power1.out'
        });
    });
};

// Fix for contact section visibility issues
const fixContactSectionVisibility = () => {
    console.log("Running contact section visibility fix");
    
    // Define all the contact elements we need to target
    const contactElements = {
        section: document.querySelector('.contact-section'),
        content: document.querySelector('.contact-content'),
        info: document.querySelector('.contact-info'),
        form: document.querySelector('.contact-form-container'),
        items: document.querySelectorAll('.contact-item'),
        social: document.querySelectorAll('.contact-social .social-icon')
    };
    
    // Log what we found
    console.log("Contact elements found:", {
        "section": contactElements.section ? "Found" : "Not found",
        "content": contactElements.content ? "Found" : "Not found",
        "info": contactElements.info ? "Found" : "Not found",
        "form": contactElements.form ? "Found" : "Not found",
        "items": contactElements.items.length,
        "social": contactElements.social.length
    });
    
    // Force display and visibility on all elements
    if (contactElements.section) {
        contactElements.section.style.display = 'block';
        contactElements.section.style.opacity = '1';
        contactElements.section.style.visibility = 'visible';
    }
    
    if (contactElements.content) {
        contactElements.content.style.display = 'grid';
        contactElements.content.style.opacity = '1';
        contactElements.content.style.visibility = 'visible';
    }
    
    if (contactElements.info) {
        contactElements.info.style.display = 'block';
        contactElements.info.style.opacity = '1';
        contactElements.info.style.visibility = 'visible';
    }
    
    if (contactElements.form) {
        contactElements.form.style.display = 'block';
        contactElements.form.style.opacity = '1';
        contactElements.form.style.visibility = 'visible';
    }
    
    contactElements.items.forEach(item => {
        item.style.display = 'flex';
        item.style.opacity = '1';
        item.style.visibility = 'visible';
    });
    
    contactElements.social.forEach(icon => {
        icon.style.display = 'flex';
        icon.style.opacity = '1';
        icon.style.visibility = 'visible';
    });
    
    // Run multiple times to ensure it works
    setTimeout(() => {
        initContactAnimations();
        console.log("Contact animations re-initialized");
    }, 500);
    
    setTimeout(() => {
        // Check if elements are actually visible
        const computedStyles = {
            section: contactElements.section ? getComputedStyle(contactElements.section) : null,
            content: contactElements.content ? getComputedStyle(contactElements.content) : null,
            info: contactElements.info ? getComputedStyle(contactElements.info) : null,
            form: contactElements.form ? getComputedStyle(contactElements.form) : null
        };
        
        console.log("Contact section visibility check:", {
            "section": computedStyles.section ? computedStyles.section.display + " / " + computedStyles.section.opacity : "No element",
            "content": computedStyles.content ? computedStyles.content.display + " / " + computedStyles.content.opacity : "No element",
            "info": computedStyles.info ? computedStyles.info.display + " / " + computedStyles.info.opacity : "No element",
            "form": computedStyles.form ? computedStyles.form.display + " / " + computedStyles.form.opacity : "No element"
        });
        
        // Force visibility one more time if needed
        Object.values(contactElements).forEach(element => {
            if (element && element.style) {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }
        });
    }, 1500);
};

// Call this function after page load
window.addEventListener('load', () => {
    setTimeout(fixContactSectionVisibility, 1000);
    setTimeout(fixContactSectionVisibility, 3000); // Try again after 3 seconds
});

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    // Start loader
    startLoading();
    
    // Check theme
    checkTheme();
    
    // Initialize 3D scenes
    const cleanupHero3D = window.preventHero3D ? (() => {})() : initHero3D();
    const cleanupSkills3D = initSkills3D();
    
    // Initialize cursor pulse animation
    setTimeout(() => {
        startCursorPulse();
    }, 2000);
    
    // Initialize glitch text effect
    setTimeout(() => {
        startGlitchEffect();
    }, 2500);
    
    // Set initial display for testimonials
    testimonialCards.forEach((card, index) => {
        if (index !== 0) {
            card.style.display = 'none';
            card.style.opacity = 0;
        }
    });
    
    // Initially show all projects
    projectCards.forEach(card => {
        card.classList.add('visible');
    });
    
    // Initialize projects section
    filterProjects('all');
    
    // Start testimonial auto-slide
    startTestimonialAutoSlide();
    
    // Pause testimonial slider on hover or click
    testimonialsContainer.addEventListener('mouseenter', pauseTestimonialAutoSlide);
    testimonialsContainer.addEventListener('mouseleave', resumeTestimonialAutoSlide);
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', pauseTestimonialAutoSlide);
    });
    prevBtn.addEventListener('click', pauseTestimonialAutoSlide);
    nextBtn.addEventListener('click', pauseTestimonialAutoSlide);
    
    // Event listeners
    document.addEventListener('mousemove', updateCursor);
    
    document.querySelectorAll('a, button, .nav-toggle, .theme-toggle, .project-card, .skill-card').forEach(element => {
        element.addEventListener('mouseenter', expandCursor);
        element.addEventListener('mouseleave', shrinkCursor);
    });
    
    // ==================== Mobile Navigation ====================
// Improved mobile navigation with animation
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Change icon based on menu state
    if (navLinks.classList.contains('active')) {
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';
        
        // Animate links with staggered delay
        allNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    } else {
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        // Re-enable scrolling when menu is closed
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link with smooth animation
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !navToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
    }
});
    
  // Theme toggle event listener removed
    window.addEventListener('scroll', handleScroll);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects(btn.dataset.filter);
        });
    });
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);
    
    // Add hover animations to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                scale: 1.03,
                boxShadow: '0 20px 50px rgba(108, 99, 255, 0.3)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Clean up on unload
    window.addEventListener('unload', () => {
        cleanupHero3D();
        cleanupSkills3D();
        stopTestimonialAutoSlide();
    });
    
    // Initialize skill animations
    animateSkills();
    
    // Initialize contact animations
    initContactAnimations();
});

// ==================== Form Submission ====================
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.classList.contains('contact-form') || form.classList.contains('newsletter-form')) {
        e.preventDefault();
        
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
        
        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = `<i class="fas fa-check"></i> Sent Successfully!`;
            
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 2000);
        }, 1500);
    }
});

// Stop animation when cursor leaves window
document.addEventListener('mouseleave', () => {
    if (rafID) {
        cancelAnimationFrame(rafID);
        rafID = null;
    }
});

// Restart animation when cursor enters window
document.addEventListener('mouseenter', () => {
    if (!rafID && isLoaded) {
        rafID = requestAnimationFrame(renderCursor);
    }
});

// Fix contact section visibility on window load
window.addEventListener('load', () => {
    // Force display and visibility on all contact elements
    document.querySelectorAll('.contact-section, .contact-content, .contact-info, .contact-form-container, .contact-item').forEach(el => {
        el.style.display = '';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Re-initialize contact animations
    initContactAnimations();
    
    console.log("Window load: Contact section visibility enforced");
});