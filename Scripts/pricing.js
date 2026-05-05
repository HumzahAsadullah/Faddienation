/* ==========================================
   FADDIERATION — Pricing Page Scripts (Rebuilt)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* ===== Particle Canvas ===== */
    if (typeof initParticleCanvas === 'function') initParticleCanvas('pricingParticles');

    /* ===== Billing Toggle ===== */
    const toggle = document.querySelector('.toggle-track');
    const lblMonth = document.querySelector('.lbl-month');
    const lblAnnual = document.querySelector('.lbl-annual');
    const saveBadge = document.querySelector('.save-badge');
    const priceEls = document.querySelectorAll('.price-amount[data-monthly]');
    const periodEls = document.querySelectorAll('.price-period');
    const origEls = document.querySelectorAll('.price-original');

    let isAnnual = false;

    function setPricing() {
        priceEls.forEach(el => {
            const m = el.dataset.monthly;
            const a = el.dataset.annual;
            const currency = el.dataset.currency || '$';
            if (m === 'Custom') return;
            const target = isAnnual ? parseInt(a) : parseInt(m);
            animatePrice(el, target, currency);
        });

        periodEls.forEach(el => {
            el.textContent = isAnnual ? '/year' : '/project';
        });
        origEls.forEach(el => {
            if (el.dataset.orig) {
                el.classList.toggle('show', isAnnual);
            }
        });

        if (lblMonth) lblMonth.classList.toggle('active', !isAnnual);
        if (lblAnnual) lblAnnual.classList.toggle('active', isAnnual);
        if (toggle) toggle.classList.toggle('annual', isAnnual);
        if (saveBadge) saveBadge.classList.toggle('show', isAnnual);
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            isAnnual = !isAnnual;
            setPricing();
        });
    }
    if (lblMonth) lblMonth.addEventListener('click', () => { if (isAnnual) { isAnnual = false; setPricing(); } });
    if (lblAnnual) lblAnnual.addEventListener('click', () => { if (!isAnnual) { isAnnual = true; setPricing(); } });

    function animatePrice(el, target, currency) {
        const raw = el.textContent.replace(/[^0-9]/g, '');
        const current = parseInt(raw) || 0;
        const diff = target - current;
        if (diff === 0) return;
        const duration = 700;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
            const val = Math.round(current + diff * eased);
            el.innerHTML = '<span class="currency">' + currency + '</span>' + val.toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ===== FAQ Accordion ===== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const inner = item.querySelector('.faq-answer-inner');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(fi => {
                fi.classList.remove('open');
                fi.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open if was closed
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = inner.scrollHeight + 20 + 'px';
            }
        });
    });

    /* ===== Card 3D Tilt ===== */
    const cards = document.querySelectorAll('.p-card');
    if (window.matchMedia('(pointer:fine)').matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const tiltX = y * -5;
                const tiltY = x * 5;
                const isFeat = card.classList.contains('featured');
                const base = isFeat ? 'scale(1.05) ' : '';
                card.style.transform = base + 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-10px)';
            });
            card.addEventListener('mouseleave', () => {
                const isFeat = card.classList.contains('featured');
                card.style.transform = isFeat ? 'scale(1.05)' : '';
            });
        });
    }

    /* ===== Animate "How it Works" step numbers on scroll ===== */
    const howNums = document.querySelectorAll('.how-num');
    if (howNums.length) {
        const howObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const steps = document.querySelectorAll('.how-step');
                    steps.forEach((s, i) => {
                        setTimeout(() => {
                            s.style.opacity = '1';
                            s.style.transform = 'translateY(0)';
                        }, i * 150);
                    });
                    howObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.2 });
        howObs.observe(document.querySelector('.how-grid'));
    }

    /* Pre-set how steps for animation */
    document.querySelectorAll('.how-step').forEach(s => {
        s.style.opacity = '0';
        s.style.transform = 'translateY(30px)';
        s.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    });

    /* ===== Comparison table row hover highlight ===== */
    document.querySelectorAll('.comp-table tbody tr:not(.cat-row)').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(167,235,242,0.03)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = '';
        });
    });
});
