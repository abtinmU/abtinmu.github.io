'use strict';

// Keep the shared header and the selected article in sync.
const navigationLinks = [...document.querySelectorAll('[data-nav-link]')];
const pages = [...document.querySelectorAll('[data-page]')];
const pageTitle = document.getElementById('page-title');
const content = document.querySelector('.main-content');
const titles = { about: 'About me', resume: 'Resume', publications: 'Publications', contact: 'Contact' };

navigationLinks.forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', event => {
    const key = button.textContent.trim().toLowerCase();
    const selected = pages.find(page => page.dataset.page === key);
    if (!selected || selected.classList.contains('active')) return;
    pages.forEach(page => page.classList.toggle('active', page === selected));
    navigationLinks.forEach(link => {
      link.classList.toggle('active', link === button);
      link.setAttribute('aria-pressed', String(link === button));
    });
    pageTitle.textContent = titles[key];
    // On smaller screens, bring the article into view below the profile.
    if (window.matchMedia('(max-width: 899px)').matches) {
      content.scrollIntoView({ block: 'start', behavior: 'auto' });
    } else if (content.getBoundingClientRect().top < 0) {
      content.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
    if (event.detail === 0) pageTitle.focus({ preventScroll: true });
  });
});

// One validation path and inline feedback; retain entered text after a failure.
const form = document.getElementById('contactForm');
const fields = [...form.querySelectorAll('[data-form-input]')];
const submitButton = form.querySelector('[data-form-btn]');
const buttonLabel = submitButton.querySelector('span');
const status = form.querySelector('.form-status');
let sending = false;
const isValid = () => fields.every(field => field.value.trim() && field.validity.valid);
const updateButton = () => { submitButton.disabled = sending || !isValid(); };
fields.forEach(field => field.addEventListener('input', () => {
  status.textContent = '';
  delete status.dataset.state;
  updateButton();
}));
updateButton();

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  if (!isValid()) {
    form.reportValidity();
    status.dataset.state = 'error';
    status.textContent = 'Please complete all fields and enter a valid email address.';
    updateButton();
    return;
  }
  const data = new FormData();
  data.append('subject', `New message: ${form.elements.title.value.trim()}`);
  data.append('fullname', form.elements.fullname.value.trim());
  data.append('email', form.elements.email.value.trim());
  data.append('message', form.elements.message.value.trim());
  sending = true;
  fields.forEach(field => { field.disabled = true; });
  form.setAttribute('aria-busy', 'true');
  buttonLabel.textContent = 'Sending…';
  status.textContent = 'Sending your message…';
  delete status.dataset.state;
  updateButton();
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.dataset.state = 'success';
    status.textContent = 'Thank you—your message has been sent.';
  } catch {
    status.dataset.state = 'error';
    status.textContent = 'Your message could not be sent. Please try again; your text has been kept.';
  } finally {
    sending = false;
    fields.forEach(field => { field.disabled = false; });
    form.removeAttribute('aria-busy');
    buttonLabel.textContent = 'Send Message';
    updateButton();
  }
});
