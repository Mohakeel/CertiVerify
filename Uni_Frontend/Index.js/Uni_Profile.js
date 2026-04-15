document.addEventListener('DOMContentLoaded', () => {

  // ── Toast helper ──
  function showToast(msg, duration = 2800) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  // ── Animate trust bar on load ──
  const trustFill = document.getElementById('trust-fill');
  if (trustFill) {
    setTimeout(() => (trustFill.style.width = '99.9%'), 400);
  }

  // ── Store original field values for reset ──
  const uniNameInput  = document.getElementById('uni-name');
  const adminEmailInput = document.getElementById('admin-email');

  const originalValues = {
    name:  uniNameInput  ? uniNameInput.value  : '',
    email: adminEmailInput ? adminEmailInput.value : ''
  };

  // ── Update Profile ──
  const updateBtn = document.getElementById('update-btn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      const name  = uniNameInput  ? uniNameInput.value.trim()  : '';
      const email = adminEmailInput ? adminEmailInput.value.trim() : '';

      if (!name) {
        showToast('University name cannot be empty.');
        uniNameInput && uniNameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        adminEmailInput && adminEmailInput.focus();
        return;
      }

      updateBtn.textContent = '&#10003; Saved!';
      updateBtn.style.background = '#28a86a';
      showToast('Profile updated successfully.');

      setTimeout(() => {
        updateBtn.innerHTML = '&#128190; Update Profile';
        updateBtn.style.background = '';
      }, 2500);
    });
  }

  // ── Reset Changes ──
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (uniNameInput)    uniNameInput.value    = originalValues.name;
      if (adminEmailInput) adminEmailInput.value = originalValues.email;
      showToast('Changes reset to original values.');
    });
  }

  // ── Change Seal (file picker) ──
  const changeSealBtn = document.querySelector('.btn-change-seal');
  if (changeSealBtn) {
    changeSealBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type   = 'file';
      input.accept = 'image/png, image/svg+xml, image/jpeg';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const sealRing = document.querySelector('.seal-ring');
          if (sealRing) {
            sealRing.innerHTML = `<img src="${ev.target.result}"
              style="width:82px;height:82px;border-radius:50%;object-fit:cover;" alt="Seal" />`;
          }
          showToast('Institutional seal updated.');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  // ── Add Department ──
  const addDeptBtn = document.getElementById('add-dept-btn');
  if (addDeptBtn) {
    addDeptBtn.addEventListener('click', () => {
      const name = prompt('Enter new department name:');
      if (!name || !name.trim()) return;

      const grid = document.querySelector('.dept-grid');
      const colors = ['blue', 'purple'];
      const color  = colors[Math.floor(Math.random() * colors.length)];

      const card = document.createElement('div');
      card.className = 'dept-card';
      card.innerHTML = `
        <div class="dept-accent ${color}"></div>
        <div class="dept-info">
          <div class="dept-name">${name.trim()}</div>
          <div class="dept-count">00 Active Registrars</div>
        </div>`;

      grid.insertBefore(card, addDeptBtn);
      showToast(`"${name.trim()}" department added.`);
    });
  }

  // ── Nav highlighting ──
  const navItems = document.querySelectorAll('.nav-item, .tnav-link');
  navItems.forEach(item => {
    item.addEventListener('click', e => {
      const group = item.classList.contains('tnav-link')
        ? document.querySelectorAll('.tnav-link')
        : document.querySelectorAll('.nav-item');
      group.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── Bell notification dot ──
  const bellBtn = document.getElementById('bell-btn');
  if (bellBtn) {
    const dot = document.createElement('span');
    dot.style.cssText = `
      position:absolute; top:2px; right:2px;
      width:7px; height:7px;
      background:#e04040; border-radius:50%; display:block;`;
    bellBtn.appendChild(dot);

    bellBtn.addEventListener('click', () => {
      dot.style.display = dot.style.display === 'none' ? 'block' : 'none';
      showToast('Notifications marked as read.');
    });
  }

  // ── Contact Support ──
  const supportLink = document.getElementById('support-link');
  if (supportLink) {
    supportLink.addEventListener('click', e => {
      e.preventDefault();
      showToast('Connecting to registrar support...');
    });
  }

  // ── Sign Out ──
  const signOut = document.querySelector('.sign-out');
  if (signOut) {
    signOut.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out?')) {
        showToast('Signed out successfully.');
      }
    });
  }

});

// Sign out
const signOutBtnUni = document.getElementById('signOutBtn');
if (signOutBtnUni) {
  signOutBtnUni.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      window.location.href = '../Other_Frontend/Login.html';
    }
  });
}
