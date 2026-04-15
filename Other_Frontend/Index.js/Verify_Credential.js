// ========================
// VERIFY BUTTON & MODAL
// ========================
const verifyBtn = document.getElementById('verifyBtn');
const credentialInput = document.getElementById('credentialInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalLoader = document.getElementById('modalLoader');

function openModal(title, message, loading = false) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalLoader.classList.toggle('hidden', !loading);
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

verifyBtn.addEventListener('click', () => {
  const val = credentialInput.value.trim();
  if (!val) {
    openModal('Input Required', 'Please enter a Credential Hash or Student ID to verify.', false);
    return;
  }

  openModal('Verifying Credential…', 'Querying the distributed ledger. Please wait.', true);

  // Simulated async verification
  setTimeout(() => {
    const isValid = val.length >= 6; // demo logic
    if (isValid) {
      modalLoader.classList.add('hidden');
      modalTitle.textContent = '✓ Credential Verified';
      modalMessage.textContent = `The credential "${val}" has been successfully authenticated on the blockchain ledger.`;
    } else {
      modalLoader.classList.add('hidden');
      modalTitle.textContent = '✗ Verification Failed';
      modalMessage.textContent = 'No matching record was found. Please check the hash or Student ID and try again.';
    }
  }, 2200);
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ========================
// HAMBURGER MENU TOGGLE
// ========================
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');
  const isOpen = navLinks.style.display === 'flex';

  if (isOpen) {
    navLinks.style.display = 'none';
    navActions.style.display = 'none';
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '64px';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = '#fff';
    navLinks.style.padding = '20px 24px';
    navLinks.style.borderBottom = '1px solid #e5e7eb';
    navLinks.style.gap = '18px';
    navLinks.style.zIndex = '200';

    navActions.style.display = 'flex';
    navActions.style.flexDirection = 'column';
    navActions.style.position = 'absolute';
    navActions.style.top = navLinks.offsetHeight + 64 + 'px';
    navActions.style.left = '0';
    navActions.style.width = '100%';
    navActions.style.background = '#fff';
    navActions.style.padding = '16px 24px 24px';
    navActions.style.gap = '12px';
    navActions.style.zIndex = '200';
    navActions.style.borderBottom = '1px solid #e5e7eb';
  }
});

// ========================
// SCROLL REVEAL (STEPS + SECURITY)
// ========================
const revealEls = document.querySelectorAll('.step-card, .compliance-item, .security-title');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ${i * 0.08}s ease, transform 0.55s ${i * 0.08}s ease`;
  observer.observe(el);
});

// ========================
// ENTER KEY ON INPUT
// ========================
credentialInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') verifyBtn.click();
});