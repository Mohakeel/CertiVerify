// ==============================
// SIDEBAR - Active Nav Item
// ==============================
const navItems = document.querySelectorAll('.nav-item[data-page]');

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ==============================
// SIDEBAR - Sign Out
// ==============================
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      alert('You have been signed out.');
    }
  });
}

// ==============================
// SEARCH - Clear Button
// ==============================
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

searchInput.addEventListener('input', () => {
  if (searchInput.value.length > 0) {
    searchClear.classList.add('visible');
  } else {
    searchClear.classList.remove('visible');
  }
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.classList.remove('visible');
  searchInput.focus();
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    alert(`Searching for: "${searchInput.value.trim()}"`);
  }
  if (e.key === 'Escape') {
    searchInput.value = '';
    searchClear.classList.remove('visible');
  }
});

// ==============================
// NOTIFICATIONS DROPDOWN
// ==============================
const bellBtn = document.getElementById('bellBtn');
const notifDropdown = document.getElementById('notifDropdown');
const notifBadge = document.getElementById('notifBadge');
const markAllRead = document.getElementById('markAllRead');

bellBtn.addEventListener('click', e => {
  e.stopPropagation();
  notifDropdown.classList.toggle('open');
  avatarDropdown.classList.remove('open');
});

markAllRead.addEventListener('click', e => {
  e.stopPropagation();
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
  });
  notifBadge.classList.add('hidden');
  markAllRead.textContent = 'All read ✔';
  markAllRead.disabled = true;
});

// ==============================
// AVATAR DROPDOWN
// ==============================
const avatarBtn = document.getElementById('avatarBtn');
const avatarDropdown = document.getElementById('avatarDropdown');

avatarBtn.addEventListener('click', e => {
  e.stopPropagation();
  avatarDropdown.classList.toggle('open');
  notifDropdown.classList.remove('open');
});

// Avatar menu items
document.querySelectorAll('.avatar-menu li:not(.divider):not(.logout-item)').forEach(item => {
  item.addEventListener('click', () => {
    alert(`Navigating to: ${item.textContent.trim()}`);
    avatarDropdown.classList.remove('open');
  });
});

document.getElementById('dropdownSignOut').addEventListener('click', () => {
  if (confirm('Are you sure you want to sign out?')) {
    alert('You have been signed out.');
  }
  avatarDropdown.classList.remove('open');
});

// Settings btn
document.getElementById('settingsBtn').addEventListener('click', () => {
  alert('Opening settings...');
});

// ==============================
// CLOSE DROPDOWNS ON OUTSIDE CLICK
// ==============================
document.addEventListener('click', () => {
  notifDropdown.classList.remove('open');
  avatarDropdown.classList.remove('open');
});