/**
 * L2E Tecnologia Rodoviária - Refined Script (V2.1)
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroVideo();
    initNeuralNetwork();
    initScrollReveal();
    initHeaderScroll();
    initSimulatedData();
    initCounters();
    initFormInteraction();
    initMobileMenu();
});

/**
 * Hero Video Force Play
 */
function initHeroVideo() {
    const video = document.getElementById('main-highway-video');
    if (!video) return;

    const playVideo = () => {
        video.play().then(() => {
            console.log("Video started playing.");
            document.removeEventListener('click', playVideo);
            document.removeEventListener('touchstart', playVideo);
        }).catch(err => {
            console.log("Autoplay still blocked or error:", err);
        });
    };

    // Try playing immediately
    video.play().catch(() => {
        console.log("Autoplay blocked. Waiting for user interaction to play.");
        // Support for strict browser policies: play on first click/touch
        document.addEventListener('click', playVideo);
        document.addEventListener('touchstart', playVideo);
    });
}

/**
 * Delicate Neural Network Background
 */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25; 
            this.radius = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    const initNodes = () => {
        particles = [];
        const count = Math.floor((width * height) / 15000); // Increased density
        for (let i = 0; i < count; i++) {
            particles.push(new Node());
        }
    };
    
    const drawConnections = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 220) {
                    const opacity = (1 - dist / 220) * 0.4;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };
    
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        drawConnections();
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };
    
    initNodes();
    animate();
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.05 });
    reveals.forEach(el => observer.observe(el));
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

function initSimulatedData() {
    // Analytics monitor logic removed as per user request
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            animateCounter(el);
        }
    });
}

function animateCounter(el) {
    if (el.dataset.animated === "true") return;
    el.dataset.animated = "true";
    
    const targetText = el.dataset.target;
    const target = parseFloat(targetText.replace(/[^\d.]/g, ''));
    const isPercentage = targetText.includes('%');
    const hasPlus = targetText.includes('+');
    
    let current = 0;
    const duration = 2500;
    const startTime = performance.now();
    
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        current = ease * target;
        
        let display = current.toLocaleString(undefined, {
            maximumFractionDigits: isPercentage ? 1 : 0
        });
        
        if (hasPlus) display = '+' + display;
        if (isPercentage) display = display + '%';
        el.innerText = display;
        
        if (progress < 1) requestAnimationFrame(step);
        else el.innerText = targetText;
    }
    requestAnimationFrame(step);
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    if (!toggle || !nav) return;
    
    const toggleMenu = () => {
        const isActive = nav.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        
        // Lucide transforms <i> into <svg>, so we need to look for both
        const iconElement = toggle.querySelector('i') || toggle.querySelector('svg');
        if (iconElement) {
            iconElement.setAttribute('data-lucide', isActive ? 'x' : 'menu');
            lucide.createIcons();
        }
        
        // Prevent scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

function initFormInteraction() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Enviando...';
        
        setTimeout(() => {
            btn.innerHTML = 'Solicitação Enviada! <i data-lucide="check"></i>';
            btn.style.background = '#10b981';
            lucide.createIcons();
            form.reset();
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
                lucide.createIcons();
            }, 3000);
        }, 1500);
    });
}
