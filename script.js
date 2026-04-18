'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     Navigation: transparent ↔ solid on scroll
  ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');

  function updateNav() {
    if (!header) return;
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-solid', scrolled);
    header.classList.toggle('is-transparent', !scrolled);
  }

  if (header) {
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  /* ------------------------------------------------------------------
     Hamburger menu toggle
  ------------------------------------------------------------------ */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    function closeMobileMenu() {
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Menü öffnen');
      document.body.style.overflow = '';
      menuToggle.focus();
    }

    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) {
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        menuToggle.focus();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  /* ------------------------------------------------------------------
     Google Maps click-to-load
  ------------------------------------------------------------------ */
  const loadMapBtn = document.getElementById('load-map-btn');

  if (loadMapBtn) {
    loadMapBtn.addEventListener('click', function () {
      const container = document.getElementById('map-container');
      if (!container) return;

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.6!2d11.0652!3d49.4530!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479f580e38f1f4a7%3A0x0!2sAdlerstra%C3%9Fe%2022%2C%2090403%20N%C3%BCrnberg!5e0!3m2!1sde!2sde!4v1000000000000!5m2!1sde!2sde';
      iframe.width = '100%';
      iframe.height = '450';
      iframe.style.border = '0';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('title', 'Standort Casa Fiora auf Google Maps');

      container.parentElement.style.minHeight = 'auto';
      container.replaceChildren(iframe);
    });
  }

  /* ------------------------------------------------------------------
     Form validation (reservation / contact forms)
  ------------------------------------------------------------------ */
  document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      let valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        const row = field.closest('.form-row') || field.closest('.form-checkbox');
        clearError(row);

        if (field.type === 'checkbox' && !field.checked) {
          showError(row, 'Bitte bestätigen Sie die Datenschutzerklärung.');
          valid = false;
        } else if (field.value.trim() === '') {
          showError(row, 'Dieses Feld ist erforderlich.');
          valid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          showError(row, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
          valid = false;
        }
      });

      if (!valid) {
        e.preventDefault();
        const firstError = form.querySelector('.form-row.has-error, .form-checkbox.has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      /* Netlify AJAX submission */
      e.preventDefault();

      const formData = new FormData(form);
      const body = new URLSearchParams(formData).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      })
        .then(function (res) {
          if (res.ok) {
            form.style.display = 'none';
            const success = form.parentElement.querySelector('.form-success');
            if (success) success.classList.add('is-visible');
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          showGlobalError(form, 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
        });
    });
  });

  function showError(row, msg) {
    if (!row) return;
    row.classList.add('has-error');
    const field = row.querySelector('input, select, textarea');
    let el = row.querySelector('.form-error');
    if (!el) {
      el = document.createElement('span');
      el.className = 'form-error';
      el.setAttribute('role', 'alert');
      if (field) el.id = (field.id || field.name) + '-error';
      row.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    if (field && el.id) {
      field.setAttribute('aria-invalid', 'true');
      const parts = (field.getAttribute('aria-describedby') || '')
        .split(' ').filter(function (p) { return p && p !== el.id; });
      parts.push(el.id);
      field.setAttribute('aria-describedby', parts.join(' '));
    }
  }

  function clearError(row) {
    if (!row) return;
    row.classList.remove('has-error');
    const el = row.querySelector('.form-error');
    if (el) el.style.display = 'none';
    const field = row.querySelector('input, select, textarea');
    if (field) {
      field.removeAttribute('aria-invalid');
      if (el && el.id) {
        const parts = (field.getAttribute('aria-describedby') || '')
          .split(' ').filter(function (p) { return p && p !== el.id; });
        if (parts.length) field.setAttribute('aria-describedby', parts.join(' '));
        else field.removeAttribute('aria-describedby');
      }
    }
  }

  function showGlobalError(form, msg) {
    let el = form.querySelector('.form-global-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error form-global-error';
      el.setAttribute('role', 'alert');
      form.insertBefore(el, form.querySelector('button[type="submit"]'));
    }
    el.textContent = msg;
    el.style.display = 'block';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ------------------------------------------------------------------
     Clear form errors on field input
  ------------------------------------------------------------------ */
  document.querySelectorAll('.form-row input, .form-row select, .form-row textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      clearError(field.closest('.form-row'));
    });
  });

  document.querySelectorAll('.form-checkbox input[type="checkbox"]').forEach(function (field) {
    field.addEventListener('change', function () {
      clearError(field.closest('.form-checkbox'));
    });
  });

});
