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
const body = document.body;

// ==================== General Variables ====================
let currentTestimonial = 0;
let isAnimating = false;
let isLoaded = false;
let mouseX = 0;
let mouseY = 0;
let testimonialInterval;
let isPaused = false;
let originalGlitchText = '';
let isMobile = window.innerWidth < 768;

// ==================== Mobile Detection ===================
const checkIfMobile = () => {
    isMobile = window.innerWidth < 768;
    if (isMobile) {
        customCursor.style.display = 'none';
    } else {
        customCursor.style.display = 'block';
    }
};

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
                
                // Force Spline visibility
                const splineContainer = document.querySelector('.hero-3d-container');
                const splineViewer = splineContainer?.querySelector('spline-viewer');
                if (splineViewer) {
                    splineViewer.style.display = 'block';
                    splineViewer.style.visibility = 'visible';
                    splineViewer.style.opacity = '1';
                }
                
                // Hide all Three.js canvases (disable old animations)
                document.querySelectorAll('canvas:not(#gsCanvas)').forEach(canvas => {
                    canvas.style.display = 'none';
                    canvas.style.opacity = '0';
                    canvas.style.visibility = 'hidden';
                    canvas.parentElement?.classList?.add('hidden-canvas');
                });
                
                // Ensure project cards visibility
                setTimeout(() => {
                    document.querySelectorAll('.project-card').forEach(card => {
                        card.style.opacity = '1';
                        card.style.visibility = 'visible';
                        card.style.transform = 'none';
                    });
                }, 500);
    }, 100);
        }
    }, 20);
};

// ==================== Custom Cursor ====================
let cursorX = 0;
let cursorY = 0;
let rafID = null;

const updateCursor = (e) => {
    if (!isLoaded || isMobile) return;
    
    // Just update the coordinates, don't modify DOM here
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // Start animation loop if not already running
    if (!rafID) {
        rafID = requestAnimationFrame(renderCursor);
    }
};

// Separate render function for better performance
const renderCursor = () => {
    // Apply position with hardware acceleration
    customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    
    // Create trail with lower frequency
    if (Math.random() > 0.8 && isLoaded && !isMobile) {
        createCursorTrail();
    }
    
    // Continue the animation loop
    rafID = requestAnimationFrame(renderCursor);
};

const expandCursor = () => {
    if (!isLoaded || isMobile) return;
    customCursor.classList.add('expandCursor');
};

const shrinkCursor = () => {
    if (!isLoaded || isMobile) return;
    customCursor.classList.remove('expandCursor');
};

// Simplified trail creation
const createCursorTrail = () => {
    if (isMobile) return;
    
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
    if (!isLoaded || isMobile) return;
    
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

// ==================== Navigation ====================
const toggleMenu = () => {
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
        // Prevent body scrolling when menu is open on mobile
        if (isMobile) {
            body.classList.add('menu-open');
            document.documentElement.classList.add('nav-open');
            
            // Add event listener to close menu when clicking outside
            setTimeout(() => {
                document.addEventListener('click', handleOutsideMenuClick);
            }, 100);
        }
    } else {
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        body.classList.remove('menu-open');
        document.documentElement.classList.remove('nav-open');
        document.removeEventListener('click', handleOutsideMenuClick);
    }
};

const closeMenu = () => {
    if (!navLinks.classList.contains('active')) return;
    
    navLinks.classList.remove('active');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    body.classList.remove('menu-open');
    document.documentElement.classList.remove('nav-open');
    document.removeEventListener('click', handleOutsideMenuClick);
};

// Properly handle navigation when clicking outside the menu
const handleOutsideMenuClick = (e) => {
    if (isMobile && navLinks.classList.contains('active')) {
        // Check if click was outside the nav menu and toggle button
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
            e.preventDefault();
            e.stopPropagation();
        }
    }
};

// Add touch support for elements on mobile
const addTouchSupport = () => {
    // Skip if not mobile
    if (!isMobile) return;
    
    // Add touchstart event for buttons
    document.querySelectorAll('.btn, .filter-btn, .project-link, .social-link, .nav-link').forEach(element => {
        // Remove existing listeners first to avoid duplicates
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
    
    // Fix 3D container for touch devices
    const heroContainer = document.querySelector('.hero-3d-container');
    if (heroContainer && isMobile) {
        heroContainer.style.pointerEvents = 'none';
    }
};

// Touch handlers
function handleTouchStart() {
    this.classList.add('touch-active');
}

function handleTouchEnd() {
    this.classList.remove('touch-active');
}

// Fix scroll behavior for mobile
const fixMobileScroll = () => {
    // Add smooth scroll behavior for anchor links on mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                closeMenu();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Add smooth scrolling with slight delay to allow menu to close
        setTimeout(() => {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Ensure contact form is visible
        setTimeout(() => {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.style.opacity = '1';
            contactSection.style.visibility = 'visible';
        }
        
        const contactContent = document.querySelector('.contact-content');
        if (contactContent) {
            contactContent.style.opacity = '1';
            contactContent.style.visibility = 'visible';
            contactContent.style.display = 'grid';
            contactContent.style.gridTemplateColumns = '1fr';
            contactContent.style.width = '100%';
        }
    }, 1000);
};

// Function to help maintain form inputs on mobile
const fixMobileFormInputs = () => {
    if (!isMobile) return;
    
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.removeEventListener('focus', handleInputFocus);
        input.removeEventListener('blur', handleInputBlur);
        
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });
};

// Input focus handler
function handleInputFocus() {
    this.parentElement.classList.add('input-active');
}

// Input blur handler
function handleInputBlur() {
    if (this.value.trim() === '') {
        this.parentElement.classList.remove('input-active');
    }
}

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
    // Update filter buttons UI first for immediate feedback
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
            // For minimal design, we don't need to change styles here
            // The CSS handles the active state with the ::after pseudo-element
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter projects with animation
    projectCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.classList.add('visible');
            // Make sure element is fully displayed
            card.style.display = 'block';
            card.style.visibility = 'visible';
            
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
                ease: 'power2.out',
                onComplete: () => {
                    // Only hide if we're still filtered out (not if filter changed during animation)
                    if (!card.classList.contains('visible')) {
                        card.style.display = 'none';
                    }
                }
            });
        }
    });
};

// ==================== Stats Counter Animation ====================
const animateStats = () => {
    // Force display of stats elements
    document.querySelectorAll('.stat-item').forEach(item => {
        item.style.opacity = '1';
        item.style.visibility = 'visible';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
    });
    
    // Force visibility of stat numbers
    document.querySelectorAll('.stat-number').forEach(num => {
        num.style.opacity = '1';
        num.style.visibility = 'visible';
        num.style.display = 'block';
    });
    
    // Animate the counters
    statsNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        let count = 0;
        const increment = Math.max(1, target / 30); // Ensure minimum increment of 1
        const duration = 1500; // Total animation time in ms
        const stepTime = duration / (target / increment);
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                stat.textContent = Math.ceil(count);
                setTimeout(updateCount, stepTime);
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

// Auto slide testimonials - prevent any pausing
const startTestimonialAutoSlide = () => {
    stopTestimonialAutoSlide(); // Clear any existing interval
    testimonialInterval = setInterval(() => {
            nextTestimonial();
    }, 3000); // Change slide every 3 seconds (was 3.5s)
    
    // Add pulse animation to active dot
    document.querySelector('.dot.active').classList.add('pulsing');
};

const stopTestimonialAutoSlide = () => {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
};

// Completely remove testimonial pausing functions
const pauseTestimonialAutoSlide = () => {
    // This function is intentionally empty now - do not pause testimonials
    return;
};

const resumeTestimonialAutoSlide = () => {
    // This function is intentionally empty now - testimonials always running
    return;
};

// Set isPaused to always be false
isPaused = false;

// ==================== GSAP Animations ====================
const initAnimations = () => {
    console.log("Initializing all animations...");
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Project cards reveal animation - simplified to ensure visibility
    gsap.utils.toArray('.project-card').forEach((card) => {
        // Ensure visibility regardless of animation
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
                card.classList.add('visible');
    });
    
    // Skills cards reveal animation - simplified
    gsap.utils.toArray('.premium-skill-item').forEach((card) => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
    });
    
    // About section animation - simplified for better mobile experience
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    
    if (aboutText) aboutText.style.opacity = '1';
    if (aboutImage) aboutImage.style.opacity = '1';
    
    // Stats animation
    animateStats();
    
    // Initialize contact animations
    initContactAnimations();
};

// ==================== THREE.JS 3D ANIMATIONS ====================

// Hero Section 3D Animation - DISABLED but keeping the function for backwards compatibility
const initHero3D = () => {
    // Skip creating ThreeJS elements and return a no-op cleanup function
    return () => {};
};

// Skills Section 3D Animation - DISABLED but keeping the function for backwards compatibility
const initSkills3D = () => {
    // Skip creating ThreeJS elements and return a no-op cleanup function
    return () => {};
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

// Fine-tune mobile display after everything is loaded
const enhanceMobileDisplay = () => {
    if (!isMobile) return;
    
    // Improve hero content spacing on mobile
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Ensure proper padding and centering
        heroContent.style.paddingTop = window.innerWidth < 576 ? '2rem' : '3rem';
        heroContent.style.paddingBottom = '1rem';
        heroContent.style.paddingLeft = '1rem';
        heroContent.style.paddingRight = '1rem';
    }
    
    // Make buttons more mobile-friendly
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaButtons) {
        const buttons = ctaButtons.querySelectorAll('.btn');
        buttons.forEach(btn => {
            // Add proper touch target sizing
            btn.style.minHeight = '50px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            
            // Smaller screens need compact buttons
            if (window.innerWidth < 576) {
                btn.style.padding = '0.8rem 1.2rem';
                btn.style.fontSize = '1.4rem';
                btn.style.minWidth = '110px';
            } else {
                btn.style.padding = '1rem 2rem';
                btn.style.fontSize = '1.6rem';
            }
            
            // Add touch feedback
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.opacity = '0.9';
            }, {passive: true});
            
            btn.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
            }, {passive: true});
        });
    }
    
    // Ensure hero 3D model is properly positioned
    const hero3D = document.querySelector('.hero-3d-container');
    if (hero3D) {
        // Reduce opacity even more on very small screens
        if (window.innerWidth < 400) {
            hero3D.style.opacity = '0.55';
            hero3D.style.top = '32%';
        }
    }
    
    // Ensure scroll indicator is visible and properly positioned
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.bottom = window.innerHeight < 700 ? '1rem' : '2rem';
        scrollIndicator.style.opacity = '0.9';
        scrollIndicator.style.animation = 'bounce 2s infinite';
        
        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);}
                40% {transform: translateX(-50%) translateY(-10px);}
                60% {transform: translateX(-50%) translateY(-5px);}
            }
        `;
        document.head.appendChild(style);
    }
};

// Call this after all other initialization
window.addEventListener('load', () => {
    setTimeout(fixContactSectionVisibility, 1000);
    setTimeout(fixContactSectionVisibility, 3000); // Try again after 3 seconds
    
    // Position 3D model in background
    position3DModelInBackground();
    
    // Make sure about image has no bottom margin
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        aboutImage.style.marginBottom = '0';
    }
    
    // Enhance mobile display after everything is loaded
    setTimeout(enhanceMobileDisplay, 1500);
    
    // Reapply on orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            position3DModelInBackground();
            enhanceMobileDisplay();
        }, 500);
    });
});

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    // Start loader
    startLoading();
    
    // Check theme
    checkTheme();
    
    // Initialize mobile detection
    checkIfMobile();
    
    // Apply optimizations for 3D content
    optimize3DforMobile();
    
    // Position 3D model in background
    position3DModelInBackground();
    
    // Fix element visibility
    fixContactSectionVisibility();
    fixProjectVisibility();
    
    // Initialize cursor pulse animation if not mobile
    if (!isMobile) {
    setTimeout(() => {
        startCursorPulse();
    }, 2000);
    }
    
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
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
    });
    
    // Initialize projects section - always show all projects
    filterProjects('all');
    
    // Start testimonial auto-slide - increased speed
    startTestimonialAutoSlide();
    
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

// ==================== Window Events ====================
window.addEventListener('DOMContentLoaded', () => {
    startLoading();
    checkTheme();
    checkIfMobile();
    optimize3DforMobile();
    
    // Set up initial event listeners
    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleWindowResize);
    navToggle.addEventListener('click', toggleMenu);
    
    // Touch and mobile related initialization
    addTouchSupport();
    fixMobileScroll();
    fixMobileFormInputs();
    
    // Set up project filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterProjects(btn.getAttribute('data-filter'));
        });
    });
    
    // Set up interactive elements
    document.querySelectorAll('a, button, .btn, .project-card, .social-link').forEach(el => {
        el.addEventListener('mouseenter', expandCursor);
        el.addEventListener('mouseleave', shrinkCursor);
    });
    
    // Set up nav link clicks to close mobile menu
    allNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Testimonial controls - keep next/prev buttons functionality but remove pausing
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    
    // Testimonial dots - keep functionality but remove pausing
    testimonialsContainer && testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // REMOVE all testimonial pausing event listeners
    // Do not add any hover/touch events that would pause testimonials
});

// Handle window resize
const handleWindowResize = () => {
    checkIfMobile();
    optimize3DforMobile();
    
    // Cancel animation frame and reapply for cursor trail on resize
    if (rafID) {
        cancelAnimationFrame(rafID);
        rafID = null;
        if (!isMobile) {
            rafID = requestAnimationFrame(renderCursor);
        }
    }
};

// Optimize 3D content loading for mobile
const optimize3DforMobile = () => {
    // Get the 3D containers
    const hero3D = document.querySelector('.hero-3d-container');
    const skills3D = document.querySelector('.skills-3d-container');
    
    if (!hero3D) return;
    
    // Hide any three.js canvases
    document.querySelectorAll('canvas:not(#gsCanvas)').forEach(canvas => {
        canvas.style.display = 'none';
        canvas.style.opacity = '0';
        canvas.style.visibility = 'hidden';
    });
    
    // Ensure spline viewer is visible
    const splineViewer = hero3D.querySelector('spline-viewer');
    if (splineViewer) {
        splineViewer.style.display = 'block';
        splineViewer.style.visibility = 'visible';
        splineViewer.style.opacity = '1';
    }
    
    // We'll use position3DModelInBackground() for positioning now
    // This function will be called separately
    
    // Disable potentially heavy animations but keep the model visible
    if (skills3D) {
        skills3D.style.opacity = '0.6';
        skills3D.style.pointerEvents = 'none';
    }
    
    // Call the new positioning function
    position3DModelInBackground();
};

// New function to fix project visibility issues
const fixProjectVisibility = () => {
    // Force project cards to be visible
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        project.style.opacity = '1';
        project.style.visibility = 'visible';
        project.style.display = 'block';
        project.style.transform = 'none';
        project.classList.add('visible');
        
        // Ensure images are visible
        const img = project.querySelector('.project-img img');
        if (img) {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
        }
    });
    
    // Make sure the grid container is visible
    const grid = document.querySelector('.projects-grid');
    if (grid) {
        grid.style.opacity = '1';
        grid.style.visibility = 'visible';
        grid.style.display = 'grid';
    }
};

// Fix project card colors and visibility
const fixProjectCards = () => {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    // Fix card background color
    card.style.backgroundColor = 'rgba(28, 28, 32, 0.7)';
    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    
    // Fix info section
    const infoSection = card.querySelector('.project-info');
    if (infoSection) {
      infoSection.style.backgroundColor = 'rgba(28, 28, 32, 0.7)';
    }
    
    // Fix title color
    const title = card.querySelector('.project-title');
    if (title) {
      title.style.color = '#fff';
    }
    
    // Fix description color
    const desc = card.querySelector('.project-desc');
    if (desc) {
      desc.style.color = '#aaa';
    }
    
    // Fix tech tags
    const tags = card.querySelectorAll('.tech-tag');
    tags.forEach(tag => {
      tag.style.backgroundColor = 'rgba(108, 99, 255, 0.15)';
      tag.style.color = '#6c63ff';
      tag.style.border = '1px solid rgba(108, 99, 255, 0.3)';
    });
  });
};

// Fix contact section scroll issues
const fixContactScroll = () => {
  // Target the contact form elements
  const contactSection = document.querySelector('.contact-section');
  const contactContent = document.querySelector('.contact-content');
  const formContainer = document.querySelector('.contact-form-container');
  const form = document.querySelector('.contact-form');
  
  // Fix scrolling issues by making sure elements don't have overflow: auto
  [contactSection, contactContent, formContainer, form].forEach(el => {
    if (el) {
      el.style.overflow = 'visible';
    }
  });
  
  // Fix form field appearance
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.style.overflow = 'visible';
    group.style.marginBottom = '2rem';
  });
};

// Position hero section correctly
const fixHeroSection = () => {
  // Get the hero section and header
  const heroSection = document.querySelector('.hero-section');
  const header = document.querySelector('nav');
  
  if (heroSection && header) {
    // Calculate header height
    const headerHeight = header.offsetHeight;
    
    // Set hero section to take full viewport minus header
    heroSection.style.minHeight = `calc(100vh - ${headerHeight/2}px)`;
    heroSection.style.paddingTop = `${headerHeight}px`;
    
    // Fix 3D model position
    const heroModel = document.querySelector('.hero-3d-container');
    if (heroModel) {
      heroModel.style.transform = 'translateY(0)';
      
      const splineViewer = heroModel.querySelector('spline-viewer');
      if (splineViewer) {
        splineViewer.style.transform = 'scale(0.95) translateY(0)';
      }
    }
  }
};

// Position 3D model in background of hero section
const position3DModelInBackground = () => {
    const heroSection = document.querySelector('.hero-section');
    const hero3D = document.querySelector('.hero-3d-container');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroSection || !hero3D || !heroContent) return;
    
    // Make hero section relative positioned
    heroSection.style.position = 'relative';
    heroSection.style.overflow = 'hidden';
    
    // Position 3D model absolutely
    hero3D.style.position = 'absolute';
    
    // Shift the model position based on screen size
    if (isMobile) {
        // On mobile: position higher up and reduce opacity more
        hero3D.style.top = window.innerWidth < 576 ? '35%' : '40%'; // Shifted up more on smaller screens
        hero3D.style.opacity = '0.65'; // Reduced brightness/opacity on mobile
    } else {
        // On desktop
        hero3D.style.top = '45%';
        hero3D.style.opacity = '0.75';
    }
    
    hero3D.style.left = '50%';
    hero3D.style.transform = 'translate(-50%, -50%)';
    hero3D.style.width = '100%';
    hero3D.style.maxWidth = isMobile ? '600px' : '700px';
    hero3D.style.minHeight = isMobile ? '380px' : '450px';
    hero3D.style.zIndex = '1';
    
    // Make sure spline viewer is visible
    const splineViewer = hero3D.querySelector('spline-viewer');
    if (splineViewer) {
        splineViewer.style.height = isMobile ? '380px' : '450px';
        splineViewer.style.width = '100%';
        splineViewer.style.display = 'block';
        splineViewer.style.visibility = 'visible';
        splineViewer.style.opacity = '1';
    }
    
    // Position content above 3D model
    heroContent.style.position = 'relative';
    heroContent.style.zIndex = '2';
    heroContent.style.paddingTop = '4rem';
    heroContent.style.display = 'flex';
    heroContent.style.flexDirection = 'column';
    heroContent.style.alignItems = 'center';
    heroContent.style.textAlign = 'center';
    
    // Add text shadows for better visibility
    const glitchText = heroContent.querySelector('.glitch-text');
    if (glitchText) {
        glitchText.style.textShadow = '0 2px 10px rgba(0,0,0,0.5)';
        glitchText.style.fontSize = isMobile ? '4rem' : '4.8rem';
        glitchText.style.marginBottom = '2rem';
    }
    
    const subtitle = heroContent.querySelector('.subtitle');
    if (subtitle) {
        subtitle.style.textShadow = '0 2px 8px rgba(0,0,0,0.4)';
        subtitle.style.fontSize = isMobile ? '2.2rem' : '2.6rem';
        subtitle.style.marginTop = '2rem';
        subtitle.style.marginBottom = '2.5rem';
    }
    
    const description = heroContent.querySelector('.description');
    if (description) {
        description.style.textShadow = '0 2px 6px rgba(0,0,0,0.4)';
        description.style.fontSize = isMobile ? '1.6rem' : '1.8rem';
        description.style.marginBottom = '3.5rem';
        description.style.maxWidth = '85%';
    }
    
    // Better spacing for buttons - always keep horizontal layout
    const ctaButtons = heroContent.querySelector('.cta-buttons');
    if (ctaButtons) {
        ctaButtons.style.marginTop = '2.5rem';
        ctaButtons.style.marginBottom = '2.5rem';
        ctaButtons.style.display = 'flex';
        ctaButtons.style.flexDirection = 'row'; // Always keep horizontal
        ctaButtons.style.gap = isMobile ? '1.5rem' : '2rem';
        ctaButtons.style.justifyContent = 'center';
        ctaButtons.style.width = '100%'; 
        
        // Make buttons fit better on small screens but keep horizontal
        if (window.innerWidth < 576) {
            // Make buttons smaller but keep them in a row
            const buttons = ctaButtons.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.style.padding = '1rem 1.5rem';
                btn.style.fontSize = '1.4rem';
            });
        }
    }
    
    const socialLinks = heroContent.querySelector('.social-links');
    if (socialLinks) {
        socialLinks.style.marginTop = '3.5rem';
        socialLinks.style.display = 'flex';
        socialLinks.style.gap = '1.5rem';
        socialLinks.style.justifyContent = 'center';
    }
    
    // Fix scroll indicator position
    const scrollIndicator = heroSection.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.position = 'absolute';
        scrollIndicator.style.bottom = '2rem';
        scrollIndicator.style.left = '50%';
        scrollIndicator.style.transform = 'translateX(-50%)';
        scrollIndicator.style.zIndex = '3';
        scrollIndicator.style.fontSize = '2rem';
        scrollIndicator.style.color = '#ffffff';
        scrollIndicator.style.textShadow = '0 2px 5px rgba(0,0,0,0.3)';
    }
};

// Update when window is resized
window.addEventListener('resize', () => {
    position3DModelInBackground();
});

// Also call this after the page has loaded
window.addEventListener('load', () => {
    position3DModelInBackground();
});