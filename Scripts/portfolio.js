/* ==========================================
   FADDIERATION — Portfolio Page Scripts
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    /* Canvas */
    if (typeof initParticleCanvas === 'function') initParticleCanvas('portParticles');

    /* Filter tabs */
    const tabs = document.querySelectorAll('.port-tab');
    const items = document.querySelectorAll('.port-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.cat;

            items.forEach((item, i) => {
                // Clear any pending hide timeout
                if (item.hasAttribute('data-hide-timeout')) {
                    clearTimeout(parseInt(item.getAttribute('data-hide-timeout')));
                    item.removeAttribute('data-hide-timeout');
                }

                const match = cat === 'all' || item.dataset.cat === cat;
                if (!match) {
                    // Exit animation without delay
                    item.style.transitionDelay = '0s';
                    item.classList.add('hiding');
                    // After transition ends, remove from layout
                    const t = setTimeout(() => {
                        item.classList.add('is-hidden');
                        item.removeAttribute('data-hide-timeout');
                    }, 500);
                    item.setAttribute('data-hide-timeout', t);
                } else {
                    // Bring back into layout
                    item.classList.remove('is-hidden');
                    // Staggered entrance
                    item.style.transitionDelay = (i * 0.05) + 's';
                    // Animate in on next frame
                    requestAnimationFrame(() => {
                        item.classList.remove('hiding');
                    });
                }
            });

            // Reset transition delays after animations
            setTimeout(() => {
                items.forEach(item => { item.style.transitionDelay = '0s'; });
            }, 600);
        });
    });

    /* Show More Button */
    const showMoreBtn = document.getElementById('showMoreProjects');
    const moreProjectsSection = document.getElementById('more-projects');
    const moreProjectsGrid = document.getElementById('moreProjectsGrid');

    if (showMoreBtn && moreProjectsSection) {
        showMoreBtn.addEventListener('click', () => {
            // Fade in more projects
            moreProjectsSection.style.display = 'block';
            moreProjectsSection.style.opacity = '0';
            
            // Trigger reflow
            moreProjectsSection.offsetHeight;
            
            moreProjectsSection.style.transition = 'opacity 0.6s ease';
            moreProjectsSection.style.opacity = '1';
            
            // Hide button after reveal
            showMoreBtn.style.opacity = '0';
            showMoreBtn.style.transform = 'translateY(10px)';
            setTimeout(() => {
                showMoreBtn.style.display = 'none';
            }, 400);

            // Reveal items with stagger
            const moreItems = moreProjectsGrid.querySelectorAll('.port-item');
            moreItems.forEach((item, i) => {
                item.style.transitionDelay = (i * 0.1) + 's';
                item.classList.add('revealed');
            });
        });
    }

    /* Modal */
    const modal = document.querySelector('.port-modal');
    const modalInner = document.querySelector('.port-modal-inner');
    const closeBtn = document.querySelector('.port-modal-close');
    const prevBtn = document.querySelector('.port-modal-prev');
    const nextBtn = document.querySelector('.port-modal-next');

    let filteredItems = [];
    let currentIndex = 0;

    // Include both initial and more items for modal
    const allItems = items.length ? items : document.querySelectorAll('.port-item');
    const filteredItems = Array.from(allItems);

    function updateModalContent(item) {
        const title = item.querySelector('.overlay h4')?.textContent || '';
        const bg = item.querySelector('.thumb')?.style.background || '';

        modalInner.innerHTML = `
            <button class="port-modal-close">&times;</button>
            <div style="
                width: 100vw; 
                height: 100vh; 
                background: ${bg};
                display: flex; 
                align-items: center; 
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
            ">
                <span style="font-family:var(--font-heading);font-size:3rem;opacity:0.2;text-align:center;">${title}</span>
            </div>
        `;
    }

    function openModalAtIndex(index) {
        currentIndex = index;
        const item = filteredItems[currentIndex];
        updateModalContent(item);
        modal.classList.add('open');
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % filteredItems.length;
        updateModalContent(filteredItems[currentIndex]);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        updateModalContent(filteredItems[currentIndex]);
    }

    if (modal) {
        // Get all visible items for modal navigation
        function getVisibleItems() {
            return Array.from(document.querySelectorAll('.port-item:not(.is-hidden)'));
        }

        allItems.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                filteredItems = getVisibleItems();
                const index = filteredItems.indexOf(item);
                openModalAtIndex(index >= 0 ? index : 0);
            });
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showNext();
            });
        }

        // Close button
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('port-modal-close')) {
                modal.classList.remove('open');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('open')) return;
            if (e.key === 'Escape') modal.classList.remove('open');
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });

        // Update visible items when filter changes
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                setTimeout(() => {
                    filteredItems = getVisibleItems();
                }, 650);
            });
        });
    }
});
