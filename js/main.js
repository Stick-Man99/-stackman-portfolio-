/**
 * Stack Man 个人网站 - 主脚本文件
 * 功能：主题切换、导航栏滚动效果、移动端菜单、粒子效果、滚动动画
 */

(function() {
    'use strict';

    // ===================================
    // DOM 元素
    // ===================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    const particlesContainer = document.getElementById('particles');
    const navLinks = document.querySelectorAll('.nav-link');

    // ===================================
    // 主题管理
    // ===================================
    const ThemeManager = {
        key: 'stackman-theme',
        
        init() {
            // 从 localStorage 读取主题
            const savedTheme = localStorage.getItem(this.key);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                this.setDark();
            } else {
                this.setLight();
            }
            
            // 绑定事件
            themeToggle.addEventListener('click', () => this.toggle());
        },
        
        isDark() {
            return document.documentElement.getAttribute('data-theme') === 'dark';
        },
        
        setDark() {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(this.key, 'dark');
        },
        
        setLight() {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(this.key, 'light');
        },
        
        toggle() {
            if (this.isDark()) {
                this.setLight();
            } else {
                this.setDark();
            }
        }
    };

    // ===================================
    // 导航栏滚动效果
    // ===================================
    const NavbarScroll = {
        threshold: 50,
        
        init() {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            this.handleScroll(); // 初始检查
        },
        
        handleScroll() {
            if (window.scrollY > this.threshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };

    // ===================================
    // 移动端菜单
    // ===================================
    const MobileMenu = {
        init() {
            navToggle.addEventListener('click', () => this.toggle());
            
            // 点击导航链接后关闭菜单
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
            
            // 点击菜单外部关闭
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    this.close();
                }
            });
        },
        
        toggle() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        },
        
        close() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    };

    // ===================================
    // 平滑滚动
    // ===================================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80; // 减去导航栏高度
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ===================================
    // 粒子背景效果
    // ===================================
    const Particles = {
        count: 30,
        
        init() {
            if (!particlesContainer) return;
            
            for (let i = 0; i < this.count; i++) {
                this.createParticle();
            }
        },
        
        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // 随机大小
            const size = Math.random() * 4 + 2;
            
            // 随机动画延迟
            const delay = Math.random() * 15;
            
            // 随机颜色（主色调范围内）
            const colors = ['#6366f1', '#8b5cf6', '#f97316'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.animationDelay = delay + 's';
            
            particlesContainer.appendChild(particle);
        }
    };

    // ===================================
    // 滚动动画（Intersection Observer）
    // ===================================
    const ScrollAnimations = {
        init() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);
            
            // 观察所有需要动画的元素
            document.querySelectorAll('.skill-category, .project-card, .contact-card').forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
        }
    };

    // ===================================
    // 技能标签悬停效果增强
    // ===================================
    const SkillTags = {
        init() {
            const tags = document.querySelectorAll('.skill-tag');
            tags.forEach(tag => {
                tag.addEventListener('mouseenter', (e) => {
                    // 添加随机的小偏移
                    const offsetX = (Math.random() - 0.5) * 4;
                    const offsetY = (Math.random() - 0.5) * 4;
                    e.target.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                });
                
                tag.addEventListener('mouseleave', (e) => {
                    e.target.style.transform = 'translate(0, 0)';
                });
            });
        }
    };

    // ===================================
    // 打字机效果（英雄区域标语）
    // ===================================
    const TypewriterEffect = {
        init() {
            const slogan = document.querySelector('.hero-slogan');
            if (!slogan) return;
            
            const text = slogan.textContent;
            slogan.textContent = '';
            slogan.style.borderRight = '2px solid var(--accent)';
            
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    slogan.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50);
                } else {
                    slogan.style.borderRight = 'none';
                }
            };
            
            // 延迟开始
            setTimeout(type, 1500);
        }
    };

    // ===================================
    // 导航链接激活状态
    // ===================================
    const ActiveNavLink = {
        sections: [],
        
        init() {
            // 获取所有 section
            this.sections = document.querySelectorAll('section[id]');
            window.addEventListener('scroll', () => this.update(), { passive: true });
            this.update(); // 初始检查
        },
        
        update() {
            const scrollY = window.scrollY;
            
            this.sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    };

    // ===================================
    // 性能优化：节流函数
    // ===================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===================================
    // 初始化
    // ===================================
    function init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // 初始化所有模块
        ThemeManager.init();
        NavbarScroll.init();
        MobileMenu.init();
        SmoothScroll.init();
        Particles.init();
        ScrollAnimations.init();
        SkillTags.init();
        ActiveNavLink.init();
        
        // 可选：打字机效果（如果希望标语有打字效果，取消下面注释）
        // TypewriterEffect.init();
        
        // 控制台彩蛋
        console.log('%c\u{1F99E} Welcome to Stack Man\'s website!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
        console.log('%c\u{61C2}\u{7B97}\u{6CD5}\u{7684}\u{6BB5}\u{5B50}\u{624B}\u{FF0C}\u{4FE1}\u{606F}\u{5B66}\u{7ADE}\u{8D5B}\u{52A9}\u{624B}', 'font-size: 14px; color: #8b5cf6;');
    }

    init();
})();
