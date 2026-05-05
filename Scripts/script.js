/* ==========================================
   FADDIERATION — Global Scripts
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* Page fade-in */
    requestAnimationFrame(() => document.body.classList.add('loaded'));

    /* ---- Cursor Glow (Primary #54acbf core + Secondary #a7ebf2 glow) ---- */
    const cursor = document.querySelector('.cursor-glow');
    if (cursor && window.matchMedia('(pointer:fine)').matches) {
        let mx = -100, my = -100;   // mouse target
        let cx = -100, cy = -100;   // current rendered position
        const lerp = 0.15;          // smoothing factor (lower = smoother)

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            if (!cursor.classList.contains('active')) cursor.classList.add('active');
        });

        // Smooth lerp animation loop
        (function renderCursor() {
            cx += (mx - cx) * lerp;
            cy += (my - cy) * lerp;
            cursor.style.left = cx + 'px';
            cursor.style.top = cy + 'px';
            requestAnimationFrame(renderCursor);
        })();

        document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        document.addEventListener('mouseenter', () => cursor.classList.add('active'));

        // Click feedback
        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

        // Hover enlargement on interactive elements
        const hoverTargets = 'a, button, .glass-card, .service-card, .portfolio-item, .stat-card, .p-card, .team-card, .value-card, .faq-question, .port-item, .info-card, .mini-svc-card, .trust-item, .sp-card, .filter-tab, .port-tab, .nav-link, .hero-badge, .pill-link, .toggle-track, input, select, textarea';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    /* ---- Navbar Scroll ---- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---- Mobile Menu ---- */
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-overlay');
    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            overlay.classList.toggle('open');
            document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
        });
        overlay.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
            hamburger.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }));
    }

    /* ---- Sidebar Dot Nav ---- */
    const dots = document.querySelectorAll('.sidebar-dot');
    const sections = document.querySelectorAll('section[id]');
    if (dots.length && sections.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dots.forEach(d => d.classList.toggle('active',
                        d.getAttribute('data-section') === entry.target.id));
                }
            });
        }, { threshold: 0.3, rootMargin: '-72px 0px 0px 0px' });
        sections.forEach(s => obs.observe(s));
        dots.forEach(d => d.addEventListener('click', () => {
            const t = document.getElementById(d.getAttribute('data-section'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        }));
    }

    /* ---- Scroll Reveal ---- */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const rObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('revealed'); rObs.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => rObs.observe(el));
    }

    /* ---- Active Nav Link ---- */
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link,.mobile-nav a').forEach(l => {
        const href = l.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) l.classList.add('active');
    });

    /* ---- Smooth anchor scroll ---- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
});

/* ---- Counter Animation (ease-out cubic) ---- */
function animateCounter(el, target, duration, suffix) {
    duration = duration || 2000;
    suffix = suffix || '';
    const start = performance.now();
    (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
    })(start);
}

/* ---- Particle Canvas (DARK THEME) ---- */
function initParticleCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    function resize() { canvas.width = parent.offsetWidth; canvas.height = parent.offsetHeight; }
    resize(); window.addEventListener('resize', resize);
    const particles = [];
    const count = Math.min(80, Math.floor((parent.offsetWidth * parent.offsetHeight) / 14000));
    for (let i = 0; i < count; i++) particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5
    });
    let mx = null, my = null;
    canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    canvas.addEventListener('mouseleave', () => { mx = null; my = null; });
    (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(59, 130, 246,' + ((1 - d / 130) * 0.2) + ')';  // Darker blue lines
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        for (const p of particles) {
            if (mx !== null) { const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx*dx+dy*dy); if(d<100){p.x+=dx*0.015;p.y+=dy*0.015;} }
            ctx.beginPath();
            ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';  // Darker blue particles
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
        requestAnimationFrame(draw);
    })();
}
