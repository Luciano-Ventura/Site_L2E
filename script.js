/**
 * L2E Tecnologia Rodoviária - Refined Script (V2.1)
 */

document.addEventListener('DOMContentLoaded', () => {
    initInstitutionalData();
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
 * Inicialização e ligação de dados institucionais (SSOT)
 */
function initInstitutionalData() {
    if (window.L2E_CONFIG && window.L2E_CONFIG.helpers && typeof window.L2E_CONFIG.helpers.applyToDOM === 'function') {
        window.L2E_CONFIG.helpers.applyToDOM();
    }
}

/**
 * Hero Video Force Play
 */
function initHeroVideo() {
    const video = document.getElementById('main-highway-video');
    if (!video) return;

    // Respeita modo de economia de dados do navegador/dispositivo
    if (navigator.connection && navigator.connection.saveData) {
        console.log("Modo de economia de dados ativo: vídeo mantido pausado.");
        return;
    }

    const playVideo = () => {
        video.play().then(() => {
            document.removeEventListener('click', playVideo);
            document.removeEventListener('touchstart', playVideo);
        }).catch(err => {
            console.log("Reprodução do vídeo pausada ou restrita:", err);
        });
    };

    video.play().catch(() => {
        document.addEventListener('click', playVideo, { once: true });
        document.addEventListener('touchstart', playVideo, { once: true });
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
    // Extract the numeric part for calculation
    const target = parseFloat(targetText.replace(/[^\d.]/g, ''));
    const isPercentage = targetText.includes('%');
    const hasPlus = targetText.includes('+');
    const hasM = targetText.toUpperCase().includes('M');
    
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
        if (hasM) display = display + 'M';
        if (isPercentage) display = display + '%';
        
        el.innerText = display;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.innerText = targetText;
        }
    }
    requestAnimationFrame(step);
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    if (!toggle || !nav) return;
    
    const closeMenu = () => {
        if (!nav.classList.contains('active')) return;
        nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        
        const iconElement = toggle.querySelector('i') || toggle.querySelector('svg');
        if (iconElement && window.lucide) {
            iconElement.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
        document.body.style.overflow = '';
    };

    const toggleMenu = (e) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        const willBeActive = !nav.classList.contains('active');
        nav.classList.toggle('active', willBeActive);
        if (overlay) overlay.classList.toggle('active', willBeActive);
        
        const iconElement = toggle.querySelector('i') || toggle.querySelector('svg');
        if (iconElement && window.lucide) {
            iconElement.setAttribute('data-lucide', willBeActive ? 'x' : 'menu');
            lucide.createIcons();
        }
        
        // Impede scroll APENAS em telas móveis quando o menu estiver aberto
        if (window.innerWidth <= 768) {
            document.body.style.overflow = willBeActive ? 'hidden' : '';
        } else {
            document.body.style.overflow = '';
        }
    };

    toggle.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Fecha o menu ao clicar em um link APENAS se o menu mobile estiver aberto
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Fecha o menu ao redimensionar além do breakpoint mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMenu();
        }
    });
}

function initFormInteraction() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    // Máscara dinâmica de telefone / WhatsApp
    const whatsappInput = form.querySelector('#whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                } else if (value.length <= 10) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
                } else {
                    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
                }
            }
            e.target.value = value;
        });
    }
    
    // Feedback persistente acessível
    let feedbackEl = form.querySelector('.form-feedback');
    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.className = 'form-feedback';
        feedbackEl.setAttribute('aria-live', 'polite');
        form.appendChild(feedbackEl);
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        const formData = new FormData(form);
        
        // Proteção contra spambots (Honeypot)
        if (formData.get('_gotcha')) {
            form.reset();
            feedbackEl.className = 'form-feedback success';
            feedbackEl.innerHTML = '<i data-lucide="check-circle-2"></i> <span>Solicitação enviada com sucesso!</span>';
            if (window.lucide) lucide.createIcons();
            return;
        }

        btn.disabled = true;
        btn.innerHTML = 'Enviando...';
        feedbackEl.className = 'form-feedback';
        feedbackEl.style.display = 'none';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                feedbackEl.className = 'form-feedback success';
                feedbackEl.innerHTML = '<i data-lucide="check-circle-2"></i> <span>Solicitação enviada com sucesso! Nossa equipe técnica retornará o seu contato em breve.</span>';
                feedbackEl.style.display = 'flex';
                form.reset();
                if (window.lucide) lucide.createIcons();
            } else {
                throw new Error('Falha no recebimento pelo servidor');
            }
        } catch (error) {
            feedbackEl.className = 'form-feedback error';
            feedbackEl.innerHTML = '<i data-lucide="alert-triangle"></i> <span>Não foi possível enviar no momento. Por favor, tente novamente ou fale conosco diretamente pelo WhatsApp (48) 99932-4253.</span>';
            feedbackEl.style.display = 'flex';
            if (window.lucide) lucide.createIcons();
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
            if (window.lucide) lucide.createIcons();
        }
    });
}
