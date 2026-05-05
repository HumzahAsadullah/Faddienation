/* ==========================================
   FADDIERATION — About Page Scripts
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    /* Particle canvas */
    if (typeof initParticleCanvas === 'function') initParticleCanvas('aboutParticles');

    /* Hero stat counters */
    const statEls = document.querySelectorAll('.hs-num[data-target]');
    if (statEls.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    animateCounter(el, parseInt(el.dataset.target), 2200, el.dataset.suffix || '');
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statEls.forEach(el => obs.observe(el));
    }

    /* Timeline progressive fill */
    const spine = document.querySelector('.timeline-fill');
    const events = document.querySelectorAll('.timeline-event');
    const timeline = document.querySelector('.timeline');
    if (spine && timeline && events.length) {
        function updateTimeline() {
            const rect = timeline.getBoundingClientRect();
            const timelineTop = rect.top;
            const timelineH = rect.height;
            const viewH = window.innerHeight;
            const scrolled = Math.max(0, viewH * 0.5 - timelineTop);
            const pct = Math.min(100, (scrolled / timelineH) * 100);
            spine.style.height = pct + '%';

            events.forEach(ev => {
                const evRect = ev.getBoundingClientRect();
                if (evRect.top < viewH * 0.65) ev.classList.add('reached');
            });
        }
        window.addEventListener('scroll', updateTimeline, { passive: true });
        updateTimeline();
    }
});
