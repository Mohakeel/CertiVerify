document.addEventListener('DOMContentLoaded', function () {

  // ── Tab filtering ──
  const tabs = document.querySelectorAll('.tab');
  const jobCards = document.querySelectorAll('.job-card');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      jobCards.forEach(function (card) {
        const status = card.getAttribute('data-status');
        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'active' && status === 'active') {
          card.style.display = 'flex';
        } else if (filter === 'closed' && status === 'closed') {
          card.style.display = 'flex';
        } else if (filter === 'draft' && status === 'draft') {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── Pagination buttons ──
  const pageBtns = document.querySelectorAll('.page-btn');

  pageBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.textContent === '‹' || btn.textContent === '›') return;
      pageBtns.forEach(function (b) { b.classList.remove('active-page'); });
      btn.classList.add('active-page');
    });
  });

  // ── Delete button confirmation ──
  const deleteButtons = document.querySelectorAll('.icon-action.danger');

  deleteButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.job-card');
      const title = card ? card.querySelector('.job-title') : null;
      const jobName = title ? title.textContent : 'this job';
      const confirmed = window.confirm('Are you sure you want to delete "' + jobName + '"?');
      if (confirmed && card) {
        card.style.transition = 'opacity 0.3s';
        card.style.opacity = '0';
        setTimeout(function () { card.remove(); }, 300);
      }
    });
  });

  // ── Create New Listing button ──
  const createBtn = document.querySelector('.btn-primary');
  if (createBtn) {
    createBtn.addEventListener('click', function () {
      alert('Create New Listing clicked! Connect your form or routing here.');
    });
  }

  // ── View Applications / View Report buttons ──
  const viewBtns = document.querySelectorAll('.btn-outline');

  viewBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.job-card');
      const title = card ? card.querySelector('.job-title') : null;
      const jobName = title ? title.textContent : 'this job';
      alert('Opening applications for: ' + jobName);
    });
  });

  // ── Search input live filter ──
  const searchInput = document.querySelector('.search-box input');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.toLowerCase().trim();

      jobCards.forEach(function (card) {
        const titleEl = card.querySelector('.job-title');
        const metaEl  = card.querySelector('.job-meta');
        const text = ((titleEl ? titleEl.textContent : '') + ' ' + (metaEl ? metaEl.textContent : '')).toLowerCase();
        card.style.display = text.includes(query) ? 'flex' : 'none';
      });
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
