document.addEventListener('DOMContentLoaded', () => {

  // ── Animate progress bar on load
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressBar.style.width = '85%';
      }, 200);
    });
  }

  // ── Active nav item switching
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── Search input focus effect
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.15)';
      searchInput.parentElement.style.borderRadius = '8px';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.style.boxShadow = 'none';
    });
  }

  // ── New Application button pulse feedback
  const newAppBtn = document.querySelector('.new-app-btn');
  if (newAppBtn) {
    newAppBtn.addEventListener('click', () => {
      window.location.href = 'App_Job_Listning.html';
    });
  }

  // ── Manage Document button click
  const manageBtn = document.querySelector('.manage-btn');
  if (manageBtn) {
    const originalHTML = manageBtn.innerHTML;
    manageBtn.addEventListener('click', () => {
      manageBtn.textContent = 'Opening...';
      setTimeout(() => {
        manageBtn.innerHTML = originalHTML;
      }, 1500);
    });
  }

  // ── Stat card counter animation
  function animateCount(el, target, duration = 1000) {
    let start = 0;
    const step = target / (duration / 16);
    const update = () => {
      start = Math.min(start + step, target);
      el.textContent = String(Math.round(start)).padStart(2, '0');
      if (start < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const val = parseInt(el.textContent, 10);
    el.textContent = '00';
    setTimeout(() => animateCount(el, val, 900), 300);
  });

  // ── Feature item hover lift
  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach(item => {
    item.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-2px)';
      item.style.boxShadow = '0 4px 16px rgba(30, 64, 175, 0.08)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
      item.style.boxShadow = 'none';
    });
  });

  // ── Table row hover highlight
  const tableRows = document.querySelectorAll('.apps-table tbody tr');
  tableRows.forEach(row => {
    row.style.transition = 'background 0.12s ease';
    row.addEventListener('mouseenter', () => {
      row.style.background = '#f9fafb';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });

  // ── Notification bell badge toggle
  const bellBtn = document.querySelector('.icon-btn');
  if (bellBtn) {
    let hasAlert = true;
    bellBtn.addEventListener('click', () => {
      hasAlert = !hasAlert;
      bellBtn.style.color = hasAlert ? '#1e40af' : '#6b7280';
    });
  }

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
