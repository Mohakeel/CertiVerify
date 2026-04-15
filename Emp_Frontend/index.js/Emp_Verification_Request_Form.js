// ─── Dropdown ─────────────────────────────────────
let dropdownOpen = false;

function toggleDropdown() {
  dropdownOpen = !dropdownOpen;
  const menu = document.getElementById('dropdownMenu');
  const wrapper = document.getElementById('institutionSelect');
  menu.classList.toggle('open', dropdownOpen);
  wrapper.classList.toggle('open', dropdownOpen);
}

function selectInstitution(name) {
  const valueEl = document.getElementById('selectValue');
  valueEl.textContent = name;
  valueEl.classList.add('selected');
  dropdownOpen = false;
  document.getElementById('dropdownMenu').classList.remove('open');
  document.getElementById('institutionSelect').classList.remove('open');
  updateProgress();
}

// Close dropdown on outside click
document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('institutionSelect');
  if (!wrapper.contains(e.target)) {
    dropdownOpen = false;
    document.getElementById('dropdownMenu').classList.remove('open');
    wrapper.classList.remove('open');
  }
});

// ─── Progress Bar ─────────────────────────────────────
function updateProgress() {
  const institution = document.getElementById('selectValue').classList.contains('selected');
  const name = document.getElementById('studentName').value.trim();
  const degree = document.getElementById('degreeProgram').value.trim();
  const year = document.getElementById('gradYear').value.trim();

  const filled = [institution, name !== '', degree !== '', year.length === 4].filter(Boolean).length;
  const percent = (filled / 4) * 100;

  document.querySelector('.form-progress-fill').style.width = percent + '%';
}

// Listen for input changes
['studentName', 'degreeProgram', 'gradYear'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateProgress);
});

// Only allow numbers in graduation year
document.getElementById('gradYear').addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '');
  updateProgress();
});

// ─── Form Validation & Submit ─────────────────────────────────────
function handleSubmit() {
  const institution = document.getElementById('selectValue').classList.contains('selected');
  const name = document.getElementById('studentName').value.trim();
  const degree = document.getElementById('degreeProgram').value.trim();
  const year = document.getElementById('gradYear').value.trim();

  // Highlight empty fields
  highlightField('studentName', name === '');
  highlightField('degreeProgram', degree === '');
  highlightField('gradYear', year.length !== 4);

  if (!institution) {
    document.getElementById('institutionSelect').style.borderColor = '#e74c3c';
  } else {
    document.getElementById('institutionSelect').style.borderColor = '';
  }

  if (!institution || !name || !degree || year.length !== 4) {
    shakeForm();
    return;
  }

  // All filled — show success toast
  showToast();
  resetForm();
}

function highlightField(id, isError) {
  const wrapper = document.getElementById(id).closest('.input-wrapper');
  if (isError) {
    wrapper.style.borderColor = '#e74c3c';
    wrapper.style.background = '#fff8f8';
  } else {
    wrapper.style.borderColor = '';
    wrapper.style.background = '';
  }
}

function shakeForm() {
  const card = document.querySelector('.form-card');
  card.style.transition = 'transform 0.08s';
  const moves = ['-6px', '6px', '-4px', '4px', '0px'];
  let i = 0;
  const interval = setInterval(() => {
    card.style.transform = `translateX(${moves[i]})`;
    i++;
    if (i >= moves.length) {
      clearInterval(interval);
      card.style.transform = '';
    }
  }, 80);
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function resetForm() {
  document.getElementById('studentName').value = '';
  document.getElementById('degreeProgram').value = '';
  document.getElementById('gradYear').value = '';

  const valueEl = document.getElementById('selectValue');
  valueEl.textContent = 'Search or Select Institution';
  valueEl.classList.remove('selected');

  document.querySelectorAll('.input-wrapper').forEach(w => {
    w.style.borderColor = '';
    w.style.background = '';
  });
  document.getElementById('institutionSelect').style.borderColor = '';
  document.querySelector('.form-progress-fill').style.width = '0%';
}

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
