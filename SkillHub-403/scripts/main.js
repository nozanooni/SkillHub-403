// /* Name=Aseel Musaid Alamri, ID=2108290, Section=DAR, Date=20/3 */
/* Name=Shahenaz Abushanab , ID=2215050, Section=DAR, Date=20/3 */
/* Name=Raghad Abdullah Alzahrani , ID=2206740, Section=DAR, Date=20/3 */


// ===== MOBILE NAVIGATION TOGGLE =====
function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
}

// ===== ACTIVE NAV LINK =====
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav#main-nav ul li a');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      href === currentPage ||
      (currentPage === 'index.html' && href === '../index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.card, .info-card, .section-header, .page-hero, .table-wrapper');
  if (!targets.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ===== FEEDBACK FORM VALIDATION =====
function initFormValidation() {
  const form = document.getElementById('feedback-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const errors = [];

    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      nameError.classList.add('visible');
      errors.push('Name is required.');
      isValid = false;
    } else {
      nameInput.classList.remove('error');
      nameError.classList.remove('visible');
    }

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput.value.trim()) {
      emailInput.classList.add('error');
      emailError.classList.add('visible');
      emailError.textContent = 'Please enter your email address.';
      errors.push('Email is required.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      emailError.classList.add('visible');
      emailError.textContent = 'Please enter a valid email address.';
      errors.push('Email format is invalid.');
      isValid = false;
    } else {
      emailInput.classList.remove('error');
      emailError.classList.remove('visible');
    }

    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const ratingError = document.getElementById('rating-error');
    const ratingSelected = Array.from(ratingInputs).some(function (r) { return r.checked; });

    if (!ratingSelected) {
      ratingError.classList.add('visible');
      errors.push('Please select a rating.');
      isValid = false;
    } else {
      ratingError.classList.remove('visible');
    }

    if (!isValid) {
      alert('Please fix the following errors before submitting:\n\n• ' + errors.join('\n• '));
      return;
    }

    form.style.display = 'none';
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth' });
    }
  });

  ['name', 'email'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', function () {
      el.classList.remove('error');
      const errEl = document.getElementById(id + '-error');
      if (errEl) errEl.classList.remove('visible');
    });
  });
}

// ===== BUTTON RIPPLE EFFECT =====
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 10px; height: 10px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.5s linear;
        pointer-events: none;
        left: ${e.offsetX - 5}px;
        top: ${e.offsetY - 5}px;
      `;

      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `@keyframes ripple-anim { to { transform: scale(30); opacity: 0; } }`;
        document.head.appendChild(s);
      }

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(function () {
        ripple.remove();
      }, 500);
    });
  });
}

// ===== BOOKING MODAL =====
var currentWorkshop = {};

function openBookingModal(name, date, time, link) {
  currentWorkshop = { name: name, date: date, time: time, link: link };

  document.getElementById('info-name').textContent = '🎓 ' + name;
  document.getElementById('info-date').textContent = '📅 ' + date;
  document.getElementById('info-time').textContent = '🕐 ' + time;

  var linkEl = document.getElementById('info-link');
  linkEl.textContent = '🔗 ' + link;
  linkEl.href = link;

  document.getElementById('booking-form').reset();
  clearBookingErrors();

  document.getElementById('booking-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  var overlay = document.getElementById('booking-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function clearBookingErrors() {
  ['b-firstname', 'b-email'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('error');

    var err = document.getElementById(id + '-error');
    if (err) err.classList.remove('visible');
  });
}

function initBookingForm() {
  var form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;
    var errors = [];

    var firstNameInput = document.getElementById('b-firstname');
    var firstNameError = document.getElementById('b-firstname-error');
    if (!firstNameInput.value.trim()) {
      firstNameInput.classList.add('error');
      firstNameError.classList.add('visible');
      errors.push('First name is required.');
      isValid = false;
    } else {
      firstNameInput.classList.remove('error');
      firstNameError.classList.remove('visible');
    }

    var emailInput = document.getElementById('b-email');
    var emailError = document.getElementById('b-email-error');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput.value.trim()) {
      emailInput.classList.add('error');
      emailError.classList.add('visible');
      emailError.textContent = 'Email address is required.';
      errors.push('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      emailError.classList.add('visible');
      emailError.textContent = 'Please enter a valid email address.';
      errors.push('Email format is invalid.');
      isValid = false;
    } else {
      emailInput.classList.remove('error');
      emailError.classList.remove('visible');
    }

    if (!isValid) {
      alert('Please fix the following before confirming:\n\n• ' + errors.join('\n• '));
      return;
    }

    var firstName = firstNameInput.value.trim();
    var lastName = document.getElementById('b-lastname').value.trim();
    var email = emailInput.value.trim();
    var fullName = lastName ? firstName + ' ' + lastName : firstName;

    closeBookingModal();

    alert(
      '🎉 You have successfully reserved a seat in this workshop!\n\n' +
      '👤 Name: ' + fullName + '\n' +
      '📧 Email: ' + email + '\n' +
      '📌 Workshop: ' + currentWorkshop.name + '\n' +
      '📅 Date: ' + currentWorkshop.date + '\n' +
      '🕐 Time: ' + currentWorkshop.time + '\n' +
      '🔗 Link: ' + currentWorkshop.link + '\n\n' +
      '✉️ Check your email (' + email + ') for the workshop details and confirmation.'
    );
  });

  var fnField = document.getElementById('b-firstname');
  if (fnField) {
    fnField.addEventListener('input', function () {
      fnField.classList.remove('error');
      document.getElementById('b-firstname-error').classList.remove('visible');
    });
  }

  var emField = document.getElementById('b-email');
  if (emField) {
    emField.addEventListener('input', function () {
      emField.classList.remove('error');
      document.getElementById('b-email-error').classList.remove('visible');
    });
  }
}

document.addEventListener('click', function (e) {
  var overlay = document.getElementById('booking-overlay');
  if (overlay && e.target === overlay) {
    closeBookingModal();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeBookingModal();
  }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  setActiveNavLink();
  initScrollAnimations();
  initFormValidation();
  initRippleEffect();
  initBookingForm();
});