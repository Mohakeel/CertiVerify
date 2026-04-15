document.addEventListener('DOMContentLoaded', () => {

  // ── Active nav highlighting ──
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── Action card click ripple ──
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => (card.style.transform = ''), 180);
    });
  });

  // ── Issue New Certificate button ──
  const issueBtn = document.querySelector('.btn-issue');
  if (issueBtn) {
    issueBtn.addEventListener('click', () => {
      alert('Certificate issuance workflow launched.');
    });
  }

  // ── Simulate live pending count update ──
  const pendingNumber = document.querySelector('.stat-card:first-child .stat-number');
  if (pendingNumber) {
    let count = parseInt(pendingNumber.textContent.replace(',', ''));
    setInterval(() => {
      const delta = Math.random() > 0.7 ? 1 : 0;
      if (delta) {
        count += delta;
        pendingNumber.textContent = count.toLocaleString();
        pendingNumber.style.color = '#e05c00';
        setTimeout(() => (pendingNumber.style.color = ''), 800);
      }
    }, 8000);
  }

  // ── Progress bar animated fill on load ──
  const fills = document.querySelectorAll('.progress-fill');
  fills.forEach(fill => {
    const target = fill.classList.contains('full') ? '100%' : '82%';
    fill.style.width = '0%';
    fill.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => (fill.style.width = target), 300);
  });

  // ── Notification bell badge ──
  const bell = document.querySelector('.icon-btn');
  if (bell) {
    bell.style.position = 'relative';
    const dot = document.createElement('span');
    dot.style.cssText = `
      position: absolute; top: 2px; right: 2px;
      width: 8px; height: 8px;
      background: #e04040; border-radius: 50%;
      display: block;
    `;
    bell.appendChild(dot);
  }

  // ── View All button ──
  const viewAll = document.querySelector('.view-all');
  if (viewAll) {
    viewAll.addEventListener('click', e => {
      e.preventDefault();
      alert('Navigating to full verification activity log.');
    });
  }

  // ── Sign Out ──
  const signOut = document.querySelector('.sidebar-footer a:last-child');
  if (signOut) {
    signOut.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out?')) {
        alert('Signed out successfully.');
      }
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
