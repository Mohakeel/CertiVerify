// ========================
// ROLE SELECTOR
// ========================
const roleBtns = document.querySelectorAll('.role-btn');
let selectedRole = 'applicant';

roleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRole = btn.dataset.role;
  });
});

// ========================
// PASSWORD VISIBILITY TOGGLE
// ========================
const pwInput   = document.getElementById('password');
const togglePw  = document.getElementById('togglePw');
const eyeIcon   = document.getElementById('eyeIcon');

const eyeOpen = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`;
const eyeClosed = `
  <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

let pwVisible = false;

togglePw.addEventListener('click', () => {
  pwVisible = !pwVisible;
  pwInput.type = pwVisible ? 'text' : 'password';
  eyeIcon.innerHTML = pwVisible ? eyeClosed : eyeOpen;
});

// ========================
// PASSWORD STRENGTH
// ========================
const strengthBar   = document.getElementById('strengthBar');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthConfig = [
  { label: '',        color: '#dde0ec', pct: '0%'   },
  { label: 'Weak',    color: '#ef4444', pct: '25%'  },
  { label: 'Fair',    color: '#f97316', pct: '50%'  },
  { label: 'Good',    color: '#eab308', pct: '75%'  },
  { label: 'Strong',  color: '#22c55e', pct: '90%'  },
  { label: 'Perfect', color: '#16a34a', pct: '100%' },
];

pwInput.addEventListener('input', () => {
  const pw = pwInput.value;
  if (!pw) {
    strengthBar.classList.remove('visible');
    return;
  }
  strengthBar.classList.add('visible');
  const score = Math.min(getStrength(pw), 5);
  const cfg   = strengthConfig[score];
  strengthFill.style.width      = cfg.pct;
  strengthFill.style.background = cfg.color;
  strengthLabel.textContent     = cfg.label;
  strengthLabel.style.color     = cfg.color;
});

// ========================
// VALIDATION HELPERS
// ========================
function showError(inputEl, errorEl, msg) {
  inputEl.classList.add('error');
  inputEl.classList.remove('valid');
  errorEl.textContent = msg;
}

function showValid(inputEl, errorEl) {
  inputEl.classList.remove('error');
  inputEl.classList.add('valid');
  errorEl.textContent = '';
}

function clearState(inputEl, errorEl) {
  inputEl.classList.remove('error', 'valid');
  errorEl.textContent = '';
}

// ========================
// REAL-TIME VALIDATION
// ========================
const nameInput  = document.getElementById('fullName');
const nameError  = document.getElementById('nameError');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const pwError    = document.getElementById('pwError');

nameInput.addEventListener('blur', () => {
  const v = nameInput.value.trim();
  if (!v)             showError(nameInput, nameError, 'Full name is required.');
  else if (v.length < 2) showError(nameInput, nameError, 'Name must be at least 2 characters.');
  else                showValid(nameInput, nameError);
});

nameInput.addEventListener('input', () => {
  if (nameInput.classList.contains('error') && nameInput.value.trim().length >= 2) {
    showValid(nameInput, nameError);
  }
});

emailInput.addEventListener('blur', () => {
  const v = emailInput.value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!v)               showError(emailInput, emailError, 'Email address is required.');
  else if (!emailRx.test(v)) showError(emailInput, emailError, 'Please enter a valid email address.');
  else                  showValid(emailInput, emailError);
});

emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('error')) {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRx.test(emailInput.value.trim())) showValid(emailInput, emailError);
  }
});

pwInput.addEventListener('blur', () => {
  const v = pwInput.value;
  if (!v)              showError(pwInput, pwError, 'Password is required.');
  else if (v.length < 12) showError(pwInput, pwError, 'Password must be at least 12 characters.');
  else if (!/[^A-Za-z0-9]/.test(v)) showError(pwInput, pwError, 'Password must include at least one symbol.');
  else                 showValid(pwInput, pwError);
});

pwInput.addEventListener('input', () => {
  if (pwInput.classList.contains('error')) {
    const v = pwInput.value;
    if (v.length >= 12 && /[^A-Za-z0-9]/.test(v)) showValid(pwInput, pwError);
  }
});

// ========================
// FORM SUBMISSION
// ========================
const createBtn = document.getElementById('createBtn');
const btnText   = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const successOverlay = document.getElementById('successOverlay');

function validateAll() {
  let valid = true;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const name = nameInput.value.trim();
  if (!name || name.length < 2) {
    showError(nameInput, nameError, !name ? 'Full name is required.' : 'Name must be at least 2 characters.');
    valid = false;
  } else {
    showValid(nameInput, nameError);
  }

  const email = emailInput.value.trim();
  if (!email) {
    showError(emailInput, emailError, 'Email address is required.');
    valid = false;
  } else if (!emailRx.test(email)) {
    showError(emailInput, emailError, 'Please enter a valid email address.');
    valid = false;
  } else {
    showValid(emailInput, emailError);
  }

  const pw = pwInput.value;
  if (!pw) {
    showError(pwInput, pwError, 'Password is required.');
    valid = false;
  } else if (pw.length < 12) {
    showError(pwInput, pwError, 'Password must be at least 12 characters.');
    valid = false;
  } else if (!/[^A-Za-z0-9]/.test(pw)) {
    showError(pwInput, pwError, 'Password must include at least one symbol.');
    valid = false;
  } else {
    showValid(pwInput, pwError);
  }

  return valid;
}

createBtn.addEventListener('click', () => {
  if (!validateAll()) return;

  // Show spinner
  btnText.classList.add('hidden');
  btnSpinner.classList.remove('hidden');
  createBtn.disabled = true;

  // Simulate async account creation
  setTimeout(() => {
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
    createBtn.disabled = false;
    successOverlay.classList.add('active');
  }, 1800);
});

// Close success overlay on backdrop click
successOverlay.addEventListener('click', e => {
  if (e.target === successOverlay) successOverlay.classList.remove('active');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') successOverlay.classList.remove('active');
});

// ========================
// ENTER KEY SUBMIT
// ========================
[nameInput, emailInput, pwInput].forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') createBtn.click();
  });
});