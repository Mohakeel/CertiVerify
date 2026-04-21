import { getEmpProfile, updateEmpProfile, logout, removeToken, removeRole, getName, setName } from '../../frontend/api.js';
import { initNotificationBell } from '../../frontend/notifications.js';
import { initAvatar, initAvatarUpload } from '../../frontend/avatar.js';

// ── Show stored name instantly ──
const userNameEl = document.querySelector('.user-name');
const storedName = getName();
if (userNameEl && storedName) userNameEl.textContent = storedName;

document.addEventListener('DOMContentLoaded', () => {
  initNotificationBell();
  initAvatar();
  initAvatarUpload();
});

// ── Toast ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e40af;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:9999;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

// ── Nav Active State ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ── Sign Out ──
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', async e => {
    e.preventDefault();
    await logout();
    window.location.href = '../Other_Frontend/Login.html';
  });
}

// ── Load profile ──
async function loadProfile() {
  try {
    const profile = await getEmpProfile();
    const nameEl  = document.getElementById('companyName');
    const indEl   = document.getElementById('industry');
    const emailEl = document.getElementById('corpEmail');

    if (nameEl  && profile.company_name)  nameEl.value  = profile.company_name;
    if (emailEl && profile.company_email) emailEl.value = profile.company_email;
    if (indEl   && profile.industry) {
      // Try to select matching option
      const opts = Array.from(indEl.options);
      const match = opts.find(o => o.value.toLowerCase() === (profile.industry || '').toLowerCase());
      if (match) indEl.value = match.value;
    }

    // Topbar — persist updated name
    if (userNameEl && profile.company_name) {
      userNameEl.textContent = profile.company_name;
      setName(profile.company_name);
    }
  } catch (err) {
    showToast('Failed to load profile: ' + err.message);
  }
}

// ── Save / Cancel ──
const saveBtn   = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

saveBtn.addEventListener('click', async () => {
  const name  = document.getElementById('companyName').value.trim();
  const email = document.getElementById('corpEmail').value.trim();
  const industry = document.getElementById('industry').value;

  if (!name)  { showToast('Company name is required.'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid corporate email address.'); return; }

  saveBtn.textContent = 'Saving...';
  saveBtn.disabled    = true;

  try {
    await updateEmpProfile({ company_name: name, company_email: email, industry });
    showToast('Profile saved successfully.');
    saveBtn.textContent = '✔ Saved!';
    saveBtn.style.background = '#16a34a';
    setTimeout(() => {
      saveBtn.textContent = 'Save Changes';
      saveBtn.style.background = '#1a3cdc';
      saveBtn.disabled = false;
    }, 2500);
  } catch (err) {
    showToast('Error: ' + err.message);
    saveBtn.textContent = 'Save Changes';
    saveBtn.disabled    = false;
  }
});

cancelBtn.addEventListener('click', () => { loadProfile(); });

loadProfile();
