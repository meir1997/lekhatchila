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
const revealTargets = document.querySelectorAll('.section-head, .card, .goals-list li, .join-form');
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

// Join form — simple mailto handoff for now (no backend yet)
function handleJoin(event) {
    event.preventDefault();
    const form = event.target;
    const status = form.querySelector('.form-status');
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    const body = [
        `שם: ${name}`,
        `דוא״ל: ${email}`,
        phone ? `טלפון: ${phone}` : null,
        '',
        message,
    ].filter(Boolean).join('\n');

    const subject = encodeURIComponent('הצטרפות לתנועת לכתחילה');
    const mailto = `mailto:info@lekhatchila.co.il?subject=${subject}&body=${encodeURIComponent(body)}`;

    status.textContent = 'תודה! פותחים עבורך את תוכנת המייל לשליחת הפנייה.';
    window.location.href = mailto;
    return false;
}
window.handleJoin = handleJoin;
