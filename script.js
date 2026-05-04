// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
    toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal
const revealTargets = document.querySelectorAll('.section-head, .card, .goals-list li, .form-group');
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
} else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
}

// Join form — submit to Google Forms backend
(function () {
    const form = document.getElementById('joinForm');
    if (!form) return;

    const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSf9Df2_dqLbGU6WtCn6fNhIQeL3EwhCqGLJHprdpQD4Z6SWTA/formResponse';
    const DATE_ENTRY  = 'entry.217176796'; // תאריך לידה — date split into _year/_month/_day

    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Build URL-encoded body manually so checkbox arrays send multiple values
        const body = new URLSearchParams();
        // Skip the local "birthdate" field — split it into 3 sub-fields
        const formData = new FormData(form);
        for (const [name, value] of formData.entries()) {
            if (!value) continue;
            if (name === 'birthdate') {
                // value is YYYY-MM-DD
                const [year, month, day] = value.split('-');
                if (year && month && day) {
                    body.append(`${DATE_ENTRY}_year`, year);
                    body.append(`${DATE_ENTRY}_month`, String(parseInt(month, 10)));
                    body.append(`${DATE_ENTRY}_day`, String(parseInt(day, 10)));
                }
                continue;
            }
            body.append(name, value);
        }

        submitBtn.disabled = true;
        const originalLabel = submitBtn.querySelector('.btn-label').textContent;
        submitBtn.querySelector('.btn-label').textContent = 'שולח...';
        status.className = 'form-status';
        status.textContent = '';

        try {
            await fetch(FORM_ACTION, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            });
            // no-cors gives an opaque response — we can't read status, but submission succeeded if no network error
            status.className = 'form-status is-success';
            status.textContent = 'תודה! ההרשמה התקבלה. נחזור אליך בקרוב.';
            form.reset();
            submitBtn.querySelector('.btn-label').textContent = 'נשלח ✓';
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-label').textContent = originalLabel;
            }, 4000);
        } catch (err) {
            console.error('Form submit failed', err);
            status.className = 'form-status is-error';
            status.textContent = 'אירעה שגיאה. נסו שוב או שלחו לנו מייל.';
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-label').textContent = originalLabel;
        }
    });
})();
