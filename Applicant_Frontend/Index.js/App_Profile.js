document.addEventListener('DOMContentLoaded', () => {

  // ── Animated counter utility
  function animateCount(el, target, suffix = '', duration = 1200) {
    let start = 0;
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // ── Identity Score counter
  const scoreEl = document.getElementById('scoreNum');
  if (scoreEl) animateCount(scoreEl, 98, '', 1400);

  // ── Stats banner counters
  const credEl  = document.getElementById('credNum');
  const matchEl = document.getElementById('matchNum');
  const privEl  = document.getElementById('privNum');

  setTimeout(() => {
    if (credEl)  animateCount(credEl,  12, '',  1000);
    if (matchEl) animateCount(matchEl,  4, '',  1000);
    if (privEl)  animateCount(privEl, 100, '%', 1200);
  }, 300);

  // ── Nav switching
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(n => {
        n.classList.remove('active');
        const ind = n.querySelector('.nav-indicator');
        if (ind) ind.remove();
      });
      item.classList.add('active');
    });
  });

  // ── Form state tracking
  const emailInput = document.getElementById('emailInput');
  const nameInput  = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');

  const originalValues = {
    email: emailInput?.value,
    name:  nameInput?.value,
    phone: phoneInput?.value
  };

  // ── Save Changes
  const saveBtn = document.getElementById('saveBtn');
  const toast   = document.getElementById('toast');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Update stored originals
      originalValues.email = emailInput?.value;
      originalValues.name  = nameInput?.value;
      originalValues.phone = phoneInput?.value;

      // Button feedback
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;

      setTimeout(() => {
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;

        // Show toast
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2800);
        }
      }, 900);
    });
  }

  // ── Cancel — restore original values
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = originalValues.email;
      if (nameInput)  nameInput.value  = originalValues.name;
      if (phoneInput) phoneInput.value = originalValues.phone;

      // Brief flash on inputs
      [emailInput, nameInput, phoneInput].forEach(inp => {
        if (!inp) return;
        inp.style.background = '#fef9c3';
        setTimeout(() => { inp.style.background = ''; }, 600);
      });
    });
  }

  // ── Search focus ring
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.12)';
      searchInput.parentElement.style.borderRadius = '8px';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.style.boxShadow = 'none';
    });
  }

  // ── Feature card hover lift on records
  const recordItems = document.querySelectorAll('.record-item');
  recordItems.forEach(item => {
    item.style.transition = 'background 0.12s';
    item.addEventListener('mouseenter', () => {
      item.style.background = '#f9fafb';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '';
    });
  });

  // ── Status mini card subtle hover
  const statusMinis = document.querySelectorAll('.status-mini');
  statusMinis.forEach(card => {
    card.style.transition = 'transform 0.15s, box-shadow 0.15s';
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = '0 4px 14px rgba(124,58,237,0.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

});

// Sign out
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      window.location.href = '../Other_Frontend/Login.html';
    }
  });
}
