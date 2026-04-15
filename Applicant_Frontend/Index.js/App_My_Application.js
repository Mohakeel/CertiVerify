// ── Nav active state
document.querySelectorAll('.nav-item').forEach(function (item) {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item').forEach(function (i) { i.classList.remove('active'); });
    this.classList.add('active');
  });
});

// ── Filter tabs
var filterTabs = document.querySelectorAll('.filter-tab');
var appCards = document.querySelectorAll('.app-card');

var statusMap = {
  all: null,
  pending: ['pending', 'review'],
  archived: ['rejected']
};

filterTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    filterTabs.forEach(function (t) { t.classList.remove('active'); });
    this.classList.add('active');

    var filter = this.getAttribute('data-filter');
    var allowed = statusMap[filter];
    var visibleCount = 0;

    appCards.forEach(function (card) {
      var status = card.getAttribute('data-status');
      if (!allowed || allowed.includes(status)) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    var emptyState = document.getElementById('emptyState');
    emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
  });
});

// ── Search filter
var searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function () {
  var query = this.value.toLowerCase().trim();
  var visibleCount = 0;

  appCards.forEach(function (card) {
    var title = card.querySelector('.app-title').textContent.toLowerCase();
    var meta = card.querySelector('.app-meta').textContent.toLowerCase();
    var quote = card.querySelector('.app-quote') ? card.querySelector('.app-quote').textContent.toLowerCase() : '';

    if (title.includes(query) || meta.includes(query) || quote.includes(query)) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  var emptyState = document.getElementById('emptyState');
  emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
});

// ── Withdraw modal
var modalOverlay = document.getElementById('modalOverlay');
var modalConfirm = document.getElementById('modalConfirm');
var modalCancel = document.getElementById('modalCancel');
var pendingWithdrawId = null;

document.querySelectorAll('.withdraw-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    pendingWithdrawId = this.getAttribute('data-id');
    modalOverlay.classList.add('active');
  });
});

modalCancel.addEventListener('click', function () {
  modalOverlay.classList.remove('active');
  pendingWithdrawId = null;
});

modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
    pendingWithdrawId = null;
  }
});

modalConfirm.addEventListener('click', function () {
  if (!pendingWithdrawId) return;

  var card = document.querySelector('.app-card[data-id="' + pendingWithdrawId + '"]');
  if (card) {
    card.classList.add('withdrawing');
    setTimeout(function () {
      card.style.transition = 'all 0.3s ease';
      card.style.maxHeight = card.offsetHeight + 'px';
      card.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        card.style.maxHeight = '0';
        card.style.opacity = '0';
        card.style.padding = '0';
        card.style.marginBottom = '0';
        card.style.borderWidth = '0';
      });
      setTimeout(function () {
        card.remove();
        updateCardBorders();
        updateCount();
      }, 320);
    }, 100);
  }

  modalOverlay.classList.remove('active');
  pendingWithdrawId = null;
});

function updateCardBorders() {
  var remaining = document.querySelectorAll('.app-card');
  remaining.forEach(function (c) {
    c.style.borderRadius = '';
  });
  if (remaining.length === 0) {
    document.getElementById('emptyState').style.display = 'flex';
    return;
  }
  remaining[0].style.borderRadius = remaining.length === 1 ? '12px' : '12px 12px 0 0';
  if (remaining.length > 1) {
    remaining[remaining.length - 1].style.borderRadius = '0 0 12px 12px';
  }
}

function updateCount() {
  var remaining = document.querySelectorAll('.app-card').length;
  var allTab = document.querySelector('.filter-tab[data-filter="all"]');
  if (allTab) allTab.textContent = 'All (' + remaining + ')';
}

// ── Browse All Listings button
document.querySelector('.btn-browse').addEventListener('click', function () {
  window.location.href = 'App_Job_Listning.html';
});

// ── New Application button
document.getElementById('newAppBtn').addEventListener('click', function () {
  window.location.href = 'App_Job_Listning.html';
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
