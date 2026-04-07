/**
 * Stack Man Website - Main Script
 * Version: v2.0
 */

// ===================================
// Console Welcome Message
// ===================================
console.log('%cWelcome to Stack Man\'s website!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cAI Assistant for Informatics Competition', 'font-size: 14px; color: #8b5cf6;');

// ===================================
// Theme Toggle - Enhanced with smooth transition
// ===================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Get theme from localStorage
function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark'; // Default dark theme
}

// Set theme with smooth transition
function setTheme(theme) {
    // Add transition class for smooth animation
    document.body.classList.add('theme-transitioning');
    
    // Small delay to ensure transition class is applied
    requestAnimationFrame(() => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 400); // Match CSS transition duration
    });
}

// Initialize theme
setTheme(getTheme());

// Theme toggle event
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');

function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===================================
// Mobile Navigation Menu
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking nav link
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Mobile dropdown accordion effect
    const dropdowns = navMenu.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
}

// ===================================
// Particles Background Initialization
// ===================================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#6366f1'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#6366f1',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ===================================
// AOS Animation Initialization
// ===================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100,
        delay: 0
    });
}

// ===================================
// Number Scroll Animation
// ===================================
function animateNumber(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Use IntersectionObserver to trigger number animation
const statNumbers = document.querySelectorAll('.stat-number');
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const target = parseInt(statNumber.dataset.target);
            if (!isNaN(target)) {
                animateNumber(statNumber, target);
            }
            numberObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => {
    numberObserver.observe(num);
});

// ===================================
// Carousel Component
// ===================================
const carouselTrack = document.querySelector('.carousel-track');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');

if (carouselTrack && carouselPrev && carouselNext) {
    const cards = carouselTrack.querySelectorAll('.achievement-card');
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 304;
    let currentIndex = 0;
    let autoPlayTimer;
    
    function updateCarousel() {
        const maxIndex = Math.max(0, cards.length - Math.floor(carouselTrack.parentElement.offsetWidth / cardWidth));
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    
    function nextSlide() {
        const maxIndex = Math.max(0, cards.length - Math.floor(carouselTrack.parentElement.offsetWidth / cardWidth));
        currentIndex = (currentIndex + 1) % (maxIndex + 1);
        updateCarousel();
    }
    
    function prevSlide() {
        const maxIndex = Math.max(0, cards.length - Math.floor(carouselTrack.parentElement.offsetWidth / cardWidth));
        currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        updateCarousel();
    }
    
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 3000);
    }
    
    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
        }
    }
    
    carouselNext.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    carouselPrev.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    // Pause autoplay on hover
    carouselTrack.parentElement.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.parentElement.addEventListener('mouseleave', startAutoPlay);
    
    // Update on window resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarousel();
    });
    
    // Start autoplay
    startAutoPlay();
}

// ===================================
// Contact Form Submission
// ===================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Add actual submission logic here
        alert('Thank you for your inquiry! We will reply to you soon.');
        contactForm.reset();
    });
}

// ===================================
// Smooth Scroll to Anchor
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// Service Card Click Navigation
// ===================================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Navigate if not clicking on a link element
        if (!e.target.closest('a')) {
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        }
    });
});

// ===================================
// Page Load Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Handle navbar initial state
    handleScroll();
    
    // Add page loaded class
    document.body.classList.add('loaded');
});

// ===================================
// Performance Optimization: requestAnimationFrame
// ===================================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });
