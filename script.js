// --- DOM Element References ---
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const mobileThemeIcon = document.getElementById('mobile-theme-icon');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navbarLinks = document.querySelectorAll('#navbar-links a, #mobile-menu a');
const loaderOverlay = document.getElementById('loader-overlay');
const homeInteractiveArea = document.getElementById('home-interactive-area');
const interactiveItems = document.querySelectorAll('.interactive-item');
const showcaseBgNumber = document.getElementById('showcase-bg-number');
const showcaseItems = document.querySelectorAll('.showcase-item');
const testimonialCards = document.querySelectorAll('#testimonials .testimonial-card');
const testimonialCanvas = document.getElementById('testimonial-canvas');
const customVideoLoader = document.getElementById('custom-video-loader');
const loaderBarFill = customVideoLoader.querySelector('.loader-bar-fill');
const loaderPercentage = customVideoLoader.querySelector('.loader-percentage');
const loaderBarContainer = customVideoLoader.querySelector('.loader-bar-container');
const lShapeExtension = customVideoLoader.querySelector('.l-shape-extension');
const mainVideo = document.getElementById('home-main-video');
const idleObjects = document.querySelectorAll('.idle-object');


// --- Global Loader Functionality ---
/**
 * Shows the global loading overlay.
 */
function showLoader() {
    loaderOverlay.classList.remove('hidden');
}

/**
 * Hides the global loading overlay after a short delay.
 */
function hideLoader() {
    setTimeout(() => {
        loaderOverlay.classList.add('hidden');
    }, 500); // Delay in milliseconds before hiding
}

// Show global loader immediately when script runs (page load)
showLoader();

// Hide global loader once the entire window content (including images/videos) has loaded
window.addEventListener('load', () => {
    hideLoader();
});


// --- Light/Dark Mode Toggle ---
/**
 * Sets the theme of the website (light or dark).
 * Updates body classes, icon, and stores preference in local storage.
 * @param {string} theme - The theme to set ('light' or 'dark').
 */
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.remove('light');
        body.classList.add('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        mobileThemeIcon.classList.remove('fa-sun');
        mobileThemeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        mobileThemeIcon.classList.remove('fa-moon');
        mobileThemeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Initializes the theme based on local storage or system preference.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Check system preference if no theme is saved
        setTheme('dark');
    } else {
        // Default to light theme
        setTheme('light');
    }
}

// Event listener for desktop theme toggle button
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light')) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

// Event listener for mobile theme toggle button
mobileThemeToggle.addEventListener('click', () => {
    if (body.classList.contains('light')) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

// Initialize theme when the script loads
initializeTheme();

// --- Mobile Menu Toggle ---
// Event listener for mobile menu button click
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Animate max-height for smooth open/close
    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
    } else {
        mobileMenu.style.maxHeight = "0";
    }
});

// Close mobile menu when a navigation link is clicked
navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.style.maxHeight = "0";
        }
    });
});

// Close mobile menu if clicked outside of it
document.addEventListener('click', (event) => {
    if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.style.maxHeight = "0";
        }
    }
});

// Close mobile menu if window is resized to a larger desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenu.style.maxHeight = "0";
    }
});

// --- Homepage Interactive Elements (Hover Effect) ---
// Adds/removes a class to the main content area to trigger fading effect on other elements
interactiveItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        homeInteractiveArea.classList.add('home-fader');
    });

    item.addEventListener('mouseleave', () => {
        homeInteractiveArea.classList.remove('home-fader');
    });
});


// --- Showcase Section Dynamic Number on Scroll ---
// Options for the Intersection Observer API
const observerOptions = {
    root: null, // Observes intersection relative to the viewport
    rootMargin: '0px',
    threshold: 0.5 // Triggers when 50% of the observed item is visible
};

// Callback function for the Intersection Observer
const showcaseObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const workNumber = entry.target.dataset.workNumber;
            // Update the background number, ensuring it's always two digits (e.g., 01, 02)
            showcaseBgNumber.textContent = workNumber.padStart(2, '0');
        }
    });
}, observerOptions);

// Attach the observer to each showcase item
showcaseItems.forEach(item => {
    showcaseObserver.observe(item);
});


// --- Testimonials Section Zoom-in and Repel Effect ---
// Observer for animating testimonial cards on scroll
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            testimonialCards.forEach((card, index) => {
                // Staggered zoom-in animation for each card
                setTimeout(() => {
                    card.classList.add('show');
                }, index * 150);
            });
            testimonialObserver.unobserve(entry.target); // Stop observing once animated
        }
    });
}, { threshold: 0.2 }); // Trigger when 20% of the section is visible

// Observe the testimonials section
testimonialObserver.observe(document.getElementById('testimonials'));


// Testimonial Canvas Repel Effect: Interactive background particles
const ctx = testimonialCanvas.getContext('2d');
let particles = []; // Array to hold particle objects
// Mouse object to track position and repel radius
let mouse = { x: undefined, y: undefined, radius: 100 };

/**
 * Initializes the canvas and creates particles.
 * Called on load and resize to adjust particle density.
 */
function initCanvas() {
    testimonialCanvas.width = testimonialCanvas.offsetWidth;
    testimonialCanvas.height = testimonialCanvas.offsetHeight;
    particles = []; // Clear existing particles
    // Calculate number of particles based on canvas size for consistent density
    const numberOfParticles = Math.floor((testimonialCanvas.width * testimonialCanvas.height) / 9000);
    // Array of colors for particles
    const colors = ['rgba(255,255,255,0.8)', 'rgba(255, 99, 71, 0.7)', 'rgba(60, 179, 113, 0.7)', 'rgba(100, 149, 237, 0.7)', 'rgba(255, 215, 0, 0.7)'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1; // Random size between 1 and 6
        // Random position within canvas boundaries, accounting for particle size
        let x = (Math.random() * ((testimonialCanvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((testimonialCanvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25; // Slower random horizontal movement
        let directionY = (Math.random() * 0.5) - 0.25; // Slower random vertical movement
        let color = colors[Math.floor(Math.random() * colors.length)]; // Random color from array
        particles.push(new Particle(x, y, size, color, directionX, directionY));
    }
}

/**
 * Represents a single particle in the canvas animation.
 */
class Particle {
    /**
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} size - Radius of the particle.
     * @param {string} color - Color of the particle.
     * @param {number} directionX - Horizontal movement speed and direction.
     * @param {number} directionY - Vertical movement speed and direction.
     */
    constructor(x, y, size, color, directionX, directionY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.directionX = directionX;
        this.directionY = directionY;
    }

    /**
     * Draws the particle on the canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); // Draw a circle
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * Updates the particle's position and handles mouse interaction.
     */
    update() {
        // Reverse direction if particle hits canvas edges
        if (this.x + this.size > testimonialCanvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > testimonialCanvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        // Repel effect when mouse is near particles
        if (mouse.x !== undefined && mouse.y !== undefined) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                let angle = Math.atan2(dy, dx);
                let force = (mouse.radius + this.size - distance) / mouse.radius;
                let speed = 1.5; // Controls how strongly particles repel

                this.x -= Math.cos(angle) * force * speed;
                this.y -= Math.sin(angle) * force * speed;
            }
        }

        this.x += this.directionX; // Move particle horizontally
        this.y += this.directionY; // Move particle vertically
        this.draw(); // Redraw particle at new position
    }
}

/**
 * Animation loop for the testimonial canvas.
 */
function animateTestimonialCanvas() {
    requestAnimationFrame(animateTestimonialCanvas); // Request next frame for smooth animation
    ctx.clearRect(0, 0, testimonialCanvas.width, testimonialCanvas.height); // Clear entire canvas
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); // Update and redraw each particle
    }
}

// Event listener to update mouse position on canvas hover
testimonialCanvas.addEventListener('mousemove', (event) => {
    const rect = testimonialCanvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left; // Get mouse X relative to canvas
    mouse.y = event.clientY - rect.top;  // Get mouse Y relative to canvas
});

// Event listener to reset mouse position when it leaves the canvas
testimonialCanvas.addEventListener('mouseleave', () => {
    mouse.x = undefined; // Indicate mouse is outside canvas
    mouse.y = undefined;
});

// Initialize and start animating testimonial canvas when the window content is fully loaded
window.addEventListener('load', () => {
    if (testimonialCanvas) { // Ensure canvas element exists
        initCanvas(); // Initialize particles
        animateTestimonialCanvas(); // Start animation loop
        window.addEventListener('resize', initCanvas); // Re-initialize on window resize to adjust particle count
    }
});


// --- Custom Video Loader Logic ---
/**
 * Displays the custom video loader and prepares the video element.
 * @param {HTMLVideoElement} videoElement - The video element to be loaded.
 */
function showCustomVideoLoader(videoElement) {
    customVideoLoader.classList.add('show');
    loaderPercentage.textContent = '0%';
    loaderBarFill.style.width = '0%';
    loaderBarContainer.classList.remove('l-shape');
    lShapeExtension.style.width = '0';
    lShapeExtension.style.opacity = '0'; // Ensure extension is fully hidden
    videoElement.style.opacity = '0'; // Hide video initially
    videoElement.style.visibility = 'hidden';
    videoElement.pause(); // Pause video
    videoElement.currentTime = 0; // Reset video to start
}

/**
 * Hides the custom video loader with an L-shape animation and plays the video.
 * @param {HTMLVideoElement} videoElement - The video element to play after loading.
 */
function hideCustomVideoLoader(videoElement) {
    // Step 1: Animate the progress bar to 100%
    loaderPercentage.textContent = '100%';
    loaderBarFill.style.width = '100%';

    // Step 2: After 1 second, start the L-shape transformation
    setTimeout(() => {
        loaderBarContainer.classList.add('l-shape');
        // The l-shape-extension transition has a CSS delay, so this will trigger it after the vertical transform begins
        lShapeExtension.style.opacity = '1';
        lShapeExtension.style.width = 'var(--horizontal-extension-width)'; // Animate to its full defined width
    }, 1000); // 1000ms (1 second) delay

    // Step 3: After 2.5 seconds, hide the entire loader and show/play the video
    setTimeout(() => {
        customVideoLoader.classList.remove('show');
        videoElement.style.opacity = '1'; // Show video
        videoElement.style.visibility = 'visible';
        videoElement.play(); // Play video
    }, 2500); // 2500ms (2.5 seconds) delay
}

// Logic to attach the custom video loader to the main homepage video
if (mainVideo) {
    mainVideo.preload = 'auto'; // Preload video metadata and a portion of data
    mainVideo.autoplay = false; // Prevent autoplay by default
    mainVideo.loop = true; // Loop the video
    mainVideo.muted = true; // Mute the video

    let simulatedProgress = 0;
    let progressInterval;

    // Event listener for when video metadata is loaded
    mainVideo.addEventListener('loadedmetadata', () => {
        // If a progress interval is already running, clear it
        if (progressInterval) clearInterval(progressInterval);
        simulatedProgress = 0; // Reset simulated progress
        loaderPercentage.textContent = '0%';
        loaderBarFill.style.width = '0%';

        // Start simulating progress bar fill
        progressInterval = setInterval(() => {
            simulatedProgress += 5; // Increment progress by 5%
            if (simulatedProgress <= 100) {
                loaderPercentage.textContent = `${simulatedProgress}%`;
                loaderBarFill.style.width = `${simulatedProgress}%`;
            } else {
                clearInterval(progressInterval); // Stop interval at 100%
                hideCustomVideoLoader(mainVideo); // Trigger loader hide animation
            }
        }, 200); // Update progress every 200ms (slower for visual effect)
    });

    // Fallback: If video starts playing unexpectedly (e.g., from cache), ensure loader is hidden
    mainVideo.addEventListener('playing', () => {
        if (progressInterval) clearInterval(progressInterval);
        customVideoLoader.classList.remove('show');
    });

    // Fallback: If video can play through quickly (e.g., fully cached), trigger hide sequence
    mainVideo.addEventListener('canplaythrough', () => {
        if (simulatedProgress < 100) { // Only force hide if not already 100% and hiding
            if (progressInterval) clearInterval(progressInterval);
            hideCustomVideoLoader(mainVideo);
        }
    });

    // Initial call to show custom loader and start loading the video
    showCustomVideoLoader(mainVideo);
    mainVideo.load();
}


// --- Idle Objects Disturbance Effect ---
let mouseX = 0;
let mouseY = 0;
let lastActivityTime = Date.now();
const idleThreshold = 5000; // 5 seconds of inactivity before idle objects activate

// Store initial positions for idle objects
idleObjects.forEach(obj => {
    // Calculate initial pixel positions from percentage styles
    obj.initialX = parseFloat(obj.style.left) / 100 * window.innerWidth;
    obj.initialY = parseFloat(obj.style.top) / 100 * window.innerHeight;
    obj.style.transform = `translate(0px, 0px)`; // Ensure initial transform is reset
});

/**
 * Animation loop for updating idle objects.
 * Handles mouse repulsion and return to original position when idle.
 */
function updateIdleObjects() {
    // Check if the mouse is currently within the window (defined)
    const isMouseActive = (mouseX !== undefined && mouseY !== undefined);

    // Check if user has been idle for longer than the threshold
    if (Date.now() - lastActivityTime > idleThreshold) {
        idleObjects.forEach(obj => {
            obj.classList.add('active'); // Make idle objects visible

            // Get current transformed position of the object
            const currentTransform = obj.style.transform;
            const currentTranslateX = parseFloat(currentTransform.split('(')[1].split(',')[0].replace('px', '')) || 0;
            const currentTranslateY = parseFloat(currentTransform.split(',')[1].replace('px)', '')) || 0;

            const currentX = obj.initialX + currentTranslateX;
            const currentY = obj.initialY + currentTranslateY;

            let dx = mouseX - currentX;
            let dy = mouseY - currentY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            const repelStrength = 20; // How strongly objects are pushed away from the mouse
            const attractStrength = 0.05; // How quickly objects return to their initial position when idle

            if (isMouseActive && distance < 200) { // If mouse is active and within repel radius
                const angle = Math.atan2(dy, dx);
                const forceFactor = (200 - distance) / 200; // Force decreases as distance increases
                const moveX = -Math.cos(angle) * repelStrength * forceFactor;
                const moveY = -Math.sin(angle) * repelStrength * forceFactor;

                obj.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                // Slowly return to initial position if no mouse interaction or mouse is outside window
                const targetX = 0;
                const targetY = 0;

                const newTranslateX = currentTranslateX + (targetX - currentTranslateX) * attractStrength;
                const newTranslateY = currentTranslateY + (targetY - currentTranslateY) * attractStrength;

                obj.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
            }
        });
    } else {
        // If user is active, hide idle objects and reset their position
        idleObjects.forEach(obj => {
            obj.classList.remove('active');
            obj.style.transform = `translate(0px, 0px)`; // Rapidly return to origin
        });
    }
    requestAnimationFrame(updateIdleObjects); // Continue the animation loop
}

// Update mouse position and reset activity timer on mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastActivityTime = Date.now();
});

// Reset activity timer on scroll
document.addEventListener('scroll', () => {
    lastActivityTime = Date.now();
});

// Initialize mouse coordinates to undefined to ensure initial idle state
mouseX = undefined;
mouseY = undefined;

// Start checking for idle objects movement animation
requestAnimationFrame(updateIdleObjects);
