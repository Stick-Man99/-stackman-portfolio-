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

const subjectLabels = {
    course: '课程咨询',
    assessment: '入学测评',
    school: '校方合作',
    other: '其他咨询'
};

const sourceLabels = {
    home: '首页',
    competition: '竞赛培训页',
    roadmap: '学习路线文章',
    school: '校方合作页',
    cases: '成长路径页',
    about: '关于页面',
    blog: '博客页面'
};

function setFormStatus(form, message, type = '') {
    let status = form.querySelector('.form-status');
    if (!status) {
        status = document.createElement('p');
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.appendChild(status);
    }
    status.className = `form-status ${type}`.trim();
    status.textContent = message;
}

function copyText(text, button) {
    const showCopied = () => {
        const original = button.textContent;
        button.textContent = '已复制';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = original;
            button.classList.remove('copied');
        }, 1800);
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(showCopied).catch(() => fallbackCopy());
        return;
    }

    fallbackCopy();

    function fallbackCopy() {
        const input = document.createElement('textarea');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.focus();
        input.select();
        try {
            document.execCommand('copy');
            showCopied();
        } catch (error) {
            button.textContent = text;
        }
        input.remove();
    }
}

document.querySelectorAll('.copy-button[data-copy-text]').forEach(button => {
    button.addEventListener('click', () => copyText(button.dataset.copyText, button));
});

if (contactForm) {
    const params = new URLSearchParams(window.location.search);
    const subjectSelect = contactForm.querySelector('[name="subject"]');
    const context = document.getElementById('consultation-context');
    const requestedSubject = params.get('subject');
    const source = params.get('from');

    const hasRequestedSubject = subjectSelect && Array.from(subjectSelect.options).some(option => option.value === requestedSubject);
    if (hasRequestedSubject) {
        subjectSelect.value = requestedSubject;
    }

    if (context && (requestedSubject || source)) {
        const subjectText = subjectLabels[requestedSubject] || '网站咨询';
        const sourceText = sourceLabels[source] ? `来自${sourceLabels[source]}` : '';
        context.textContent = `${sourceText}${sourceText ? '，' : ''}本次将围绕“${subjectText}”沟通。请补充孩子的年级和目前基础。`;
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const subject = subjectLabels[data.subject] || '网站咨询';
        const body = [
            `姓名：${data.name || ''}`,
            `联系邮箱：${data.email || ''}`,
            `咨询主题：${subject}`,
            `学生年级：${data.student_grade || '未填写'}`,
            `目前基础：${data.learning_level || '未填写'}`,
            `期望形式：${data.learning_format || '未填写'}`,
            `来源页面：${sourceLabels[data.source] || sourceLabels[params.get('from')] || '直接访问'}`,
            '',
            data.message || ''
        ].join('\n');

        const mailto = `mailto:1825253292@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setFormStatus(contactForm, '正在打开邮件客户端；如果没有反应，请稍后直接复制微信号 jjhcr123 联系。', 'success');
        window.location.href = mailto;
    });
}

// ===================================
// Contextual Consultation CTA
// ===================================
const currentPath = window.location.pathname;
const isContactPage = currentPath.endsWith('/contact.html') || currentPath.endsWith('/contact.html/');
const isPrivacyPage = currentPath.endsWith('/privacy.html') || currentPath.endsWith('/privacy.html/');

if (!isContactPage && !isPrivacyPage && !document.querySelector('.mobile-consultation-cta')) {
    const inSubdirectory = currentPath.includes('/services/') || currentPath.includes('/blog/');
    const contactPath = inSubdirectory ? '../contact.html' : 'contact.html';
    const source = currentPath.includes('/services/competition') ? 'competition' :
        currentPath.includes('/services/school') ? 'school' :
        currentPath.includes('/services/cases') ? 'cases' :
        currentPath.includes('/blog/learning-roadmap') ? 'roadmap' :
        currentPath.includes('/about') ? 'about' :
        currentPath.includes('/blog') ? 'blog' : 'home';
    const subject = source === 'school' ? 'school' : source === 'competition' || source === 'roadmap' || source === 'cases' ? 'assessment' : 'course';
    const cta = document.createElement('a');
    cta.className = 'mobile-consultation-cta';
    cta.href = `${contactPath}?from=${source}&subject=${subject}`;
    cta.innerHTML = '<i class="fas fa-comments"></i><span>咨询测评</span>';
    cta.setAttribute('aria-label', '前往咨询测评');
    document.body.appendChild(cta);
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
