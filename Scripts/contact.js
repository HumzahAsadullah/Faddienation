/* ==========================================
   FADDIERATION — Contact Page Scripts
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    /* Canvas */
    if (typeof initParticleCanvas === 'function') initParticleCanvas('contactParticles');

    const form = document.getElementById('contactForm');
    const successState = document.querySelector('.success-state');
    const formWrap = document.querySelector('.contact-form-wrap');
    if (!form) return;

    /* Validation rules */
    const rules = {
        firstName: v => v.trim().length >= 2 ? '' : 'Min 2 characters',
        lastName:  v => v.trim().length >= 2 ? '' : 'Min 2 characters',
        phone:     v => /^\+?[\d\s\-()]{7,15}$/.test(v.trim()) ? '' : 'Enter valid phone',
        email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter valid email',
        service:   v => v ? '' : 'Select a service',
        budget:    v => v ? '' : 'Select a budget',
        project:   v => v.trim().length >= 10 ? '' : 'Min 10 characters',
    };

    /* Live validation */
    Object.keys(rules).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        field.addEventListener('blur', () => validateField(name, field));
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('has-error')) {
                validateField(name, field);
            }
        });
    });

    function validateField(name, field) {
        const err = rules[name](field.value);
        const group = field.closest('.form-group');
        const errEl = group.querySelector('.form-error');
        if (err) {
            group.classList.add('has-error');
            field.classList.add('error');
            if (errEl) errEl.textContent = err;
        } else {
            group.classList.remove('has-error');
            field.classList.remove('error');
        }
        return !err;
    }

    /* Submit */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        Object.keys(rules).forEach(name => {
            const field = form.querySelector(`[name="${name}"]`);
            if (field && !validateField(name, field)) valid = false;
        });

        if (!valid) return;

        /* Build WhatsApp message */
        const d = Object.fromEntries(new FormData(form));
        const msg = `*New Project Inquiry — Faddieration*%0A` +
            `━━━━━━━━━━━━━━━━━%0A` +
            `*Name:* ${d.firstName} ${d.lastName}%0A` +
            `*Phone:* ${d.phone}%0A` +
            `*Email:* ${d.email}%0A` +
            `*Service:* ${d.service}%0A` +
            `*Budget:* ${d.budget}%0A` +
            `━━━━━━━━━━━━━━━━━%0A` +
            `*Project Details:*%0A${d.project}%0A` +
            `━━━━━━━━━━━━━━━━━%0A` +
            `_Sent via Faddieration Contact Form_`;

        /* Show success */
        if (formWrap) formWrap.style.display = 'none';
        if (successState) successState.classList.add('show');

        /* Open WhatsApp */
        setTimeout(() => {
            window.open(`https://wa.me/923293915877?text=${msg}`, '_blank');
        }, 1200);
    });
});
