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

    /* Modal */
    const modal = document.querySelector('.port-modal');
    const modalInner = document.querySelector('.port-modal-inner');
    const closeBtn = document.querySelector('.port-modal-close');
    const prevBtn = document.querySelector('.port-modal-prev');
    const nextBtn = document.querySelector('.port-modal-next');

    let filteredItems = [];

    // Include both initial and more items for modal
    const allItems = items.length ? items : document.querySelectorAll('.port-item');
    filteredItems = Array.from(allItems);

    function updateModalContent(item) {
        const title = item.querySelector('.overlay h4')?.textContent || '';
        const thumb = item.querySelector('.thumb');
        const img = thumb?.querySelector('img');
        const thumbIcon = thumb?.querySelector('.thumb-icon')?.innerHTML || '';
        const thumbLabel = thumb?.querySelector('.thumb-label')?.textContent || '';
        const bg = thumb?.style.background || '';

        let mediaContent = '';
        if (img && img.src) {
            mediaContent = `<img src="${img.src}" alt="${title}" class="port-modal-img">`;
        } else {
            mediaContent = `
                <div class="port-modal-bg" style="background: ${bg};">
                    <div class="port-modal-content">
                        <span class="port-modal-icon">${thumbIcon}</span>
                        <span class="port-modal-label">${thumbLabel}</span>
                    </div>
                </div>
            `;
        }

        modalInner.innerHTML = `
            <button class="port-modal-close">&times;</button>
            ${mediaContent}
            <div class="port-modal-title">${title}</div>
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

    /* Show More Button */
    const showMoreBtn = document.getElementById('show-more-btn');
    const allPortItems = document.querySelectorAll('.port-item');
    let visibleCount = 12; // Initially show 12 items
    let isExpanded = false;

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                // Show more items (next 8)
                const itemsToShow = Array.from(allPortItems).slice(visibleCount, visibleCount + 8);
                itemsToShow.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('show');
                        item.style.transitionDelay = (index * 0.1) + 's';
                    }, index * 50);
                });

                // Update state
                visibleCount += 8;
                isExpanded = true;

                // Change button text
                showMoreBtn.textContent = 'Show Less';

                // Reset transition delays
                setTimeout(() => {
                    itemsToShow.forEach(item => {
                        item.style.transitionDelay = '0s';
                    });
                }, 1000);

            } else {
                // Hide extra items
                const itemsToHide = Array.from(allPortItems).slice(12);
                itemsToHide.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.remove('show');
                        item.style.transitionDelay = (index * 0.05) + 's';
                    }, index * 30);
                });

                // Update state
                visibleCount = 12;
                isExpanded = false;

                // Change button text
                showMoreBtn.textContent = 'Show More Projects';

                // Reset transition delays
                setTimeout(() => {
                    itemsToHide.forEach(item => {
                        item.style.transitionDelay = '0s';
                    });
                }, 500);
            }
        });
    }
});
