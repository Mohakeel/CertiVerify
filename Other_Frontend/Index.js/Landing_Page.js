// ===================== HAMBURGER MENU =====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===================== VERIFY BUTTON =====================
const verifyBtn = document.querySelector('.verify-input-row .btn-primary');
const verifyInput = document.querySelector('.verify-input-row input');

if (verifyBtn && verifyInput) {
  verifyBtn.addEventListener('click', () => {
    const value = verifyInput.value.trim();
    if (!value) {
      verifyInput.style.borderColor = '#e24b4a';
      verifyInput.placeholder = 'Please enter a credential hash';
      setTimeout(() => {
        verifyInput.style.borderColor = '';
        verifyInput.placeholder = 'e.g. 0x7f8e...92c1';
      }, 2000);
      return;
    }
    verifyBtn.textContent = '...';
    verifyBtn.disabled = true;
    setTimeout(() => {
      verifyBtn.textContent = '✓ Valid';
      verifyBtn.style.background = '#16a34a';
      setTimeout(() => {
        verifyBtn.textContent = 'Verify';
        verifyBtn.style.background = '';
        verifyBtn.disabled = false;
        verifyInput.value = '';
      }, 2500);
    }, 1200);
  });

  // Allow Enter key in input
  verifyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBtn.click();
  });
}

// ===================== SCROLL REVEAL ANIMATION =====================
const revealElements = document.querySelectorAll('.card, .feature-item, .hero-left, .verify-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// ===================== ACTIVE NAV ON SCROLL =====================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id') || '';
    }
  });
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});