/* ==========================================
   FADDIERATION — Services Page Scripts
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    /* Canvas */
    if (typeof initParticleCanvas === 'function') initParticleCanvas('svcParticles');

    /* Sticky tabs active tracking */
    const tabs = document.querySelectorAll('.svc-tab');
    const blocks = document.querySelectorAll('.svc-block[id]');

    if (tabs.length && blocks.length) {
        /* Click → scroll */
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.getElementById(tab.dataset.target);
                if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 140;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });

        /* Scroll → highlight */
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === entry.target.id));
                }
            });
        }, { threshold: 0.25, rootMargin: '-150px 0px -40% 0px' });
        blocks.forEach(b => obs.observe(b));
    }

    /* Sidebar navigation */
    const sidebarDots = document.querySelectorAll('.sidebar-dot');
    const sectionIds = Array.from(document.querySelectorAll('.sidebar-dot[data-section]')).map(dot => dot.dataset.section);
    const sectionElements = sectionIds.map(id => document.getElementById(id)).filter(el => el);

    if (sidebarDots.length && sectionElements.length) {
        /* Click → scroll */
        sidebarDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetId = dot.dataset.section;
                const target = document.getElementById(targetId);
                if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });

        /* Scroll → highlight active dot using scroll position */
        function updateActiveDot() {
            const scrollPos = window.scrollY + 200;
            let currentId = null;

            sectionElements.forEach(section => {
                if (section.offsetTop <= scrollPos) {
                    currentId = section.id;
                }
            });

            if (currentId) {
                sidebarDots.forEach(dot => {
                    dot.classList.toggle('active', dot.dataset.section === currentId);
                });
            }
        }

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveDot);
        });

        // Initial call
        updateActiveDot();
    }

    /* Animate revenue bars */
    const bars = document.querySelectorAll('.rev-bar');
    if (bars.length) {
        const obs2 = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    bars.forEach(b => { b.style.height = b.dataset.h; });
                    obs2.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        const chart = document.querySelector('.rev-chart');
        if (chart) obs2.observe(chart);
    }
});
