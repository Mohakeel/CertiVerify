// ---- Save / Cancel ----
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

const originalValues = {
  companyName: document.getElementById('companyName').value,
  industry: document.getElementById('industry').value,
  corpEmail: document.getElementById('corpEmail').value,
};

saveBtn.addEventListener('click', () => {
  const name = document.getElementById('companyName').value.trim();
  const email = document.getElementById('corpEmail').value.trim();

  if (!name) {
    alert('Company name is required.');
    return;
  }

  if (!email || !email.includes('@')) {
    alert('Please enter a valid corporate email address.');
    return;
  }

  saveBtn.textContent = '✔ Saved!';
  saveBtn.style.background = '#16a34a';
  saveBtn.disabled = true;

  // Update stored originals
  originalValues.companyName = name;
  originalValues.industry = document.getElementById('industry').value;
  originalValues.corpEmail = email;

  setTimeout(() => {
    saveBtn.textContent = 'Save Changes';
    saveBtn.style.background = '#1a3cdc';
    saveBtn.disabled = false;
  }, 2500);
});

cancelBtn.addEventListener('click', () => {
  document.getElementById('companyName').value = originalValues.companyName;
  document.getElementById('industry').value = originalValues.industry;
  document.getElementById('corpEmail').value = originalValues.corpEmail;
});

// ---- Nav Active State ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ---- Sign Out ----
document.querySelector('.signout').addEventListener('click', e => {
  e.preventDefault();
  if (confirm('Are you sure you want to sign out?')) {
    alert('Signed out successfully.');
  }
});

// ---- Topbar Icons ----
document.querySelector('.fa-bell').addEventListener('click', () => {
  alert('No new notifications.');
});

document.querySelector('.fa-gear').addEventListener('click', () => {
  alert('Opening settings...');
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
