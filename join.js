// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Submit form to Google Forms backend, then swap to thank-you view
(function () {
    const form = document.getElementById('joinForm');
    if (!form) return;

    const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSf9Df2_dqLbGU6WtCn6fNhIQeL3EwhCqGLJHprdpQD4Z6SWTA/formResponse';
    const DATE_ENTRY  = 'entry.217176796';

    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formView   = document.getElementById('formView');
    const thanksView = document.getElementById('thanksView');
    const thanksName = document.getElementById('thanksName');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const body = new URLSearchParams();
        const formData = new FormData(form);
        let firstName = '';
        for (const [name, value] of formData.entries()) {
            if (!value) continue;
            if (name === 'birthdate') {
                const [y, m, d] = value.split('-');
                if (y && m && d) {
                    body.append(`${DATE_ENTRY}_year`, y);
                    body.append(`${DATE_ENTRY}_month`, String(parseInt(m, 10)));
                    body.append(`${DATE_ENTRY}_day`, String(parseInt(d, 10)));
                }
                continue;
            }
            if (name === 'entry.1166605822') firstName = String(value).trim();
            body.append(name, value);
        }

        submitBtn.disabled = true;
        const labelEl = submitBtn.querySelector('.btn-label');
        const originalLabel = labelEl.textContent;
        labelEl.textContent = 'שולח...';
        status.className = 'form-status';
        status.textContent = '';

        try {
            await fetch(FORM_ACTION, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            });
            // Swap views
            if (firstName && thanksName) thanksName.textContent = firstName;
            formView.hidden = true;
            thanksView.hidden = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Form submit failed', err);
            status.className = 'form-status is-error';
            status.textContent = 'אירעה שגיאה. נסו שוב או שלחו לנו מייל.';
            submitBtn.disabled = false;
            labelEl.textContent = originalLabel;
        }
    });
})();
