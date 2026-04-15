// Salary range filter
const salaryRange = document.getElementById('salaryRange');

function formatSalary(val) {
  const num = parseInt(val);
  if (num >= 350000) return '$350k+';
  return '$' + Math.round(num / 1000) + 'k';
}

if (salaryRange) {
  const labels = document.querySelectorAll('.range-labels span');

  salaryRange.addEventListener('input', function () {
    if (labels[1]) {
      labels[1].textContent = formatSalary(this.value);
    }
  });
}

// Pill filter toggle
document.querySelectorAll('.pill').forEach(function (pill) {
  pill.addEventListener('click', function () {
    const group = this.closest('.filter-group');
    group.querySelectorAll('.pill').forEach(function (p) {
      p.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// Checkbox toggle style
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(function (cb) {
  cb.addEventListener('change', function () {
    const label = this.closest('.checkbox-item');
    if (this.checked) {
      label.classList.add('checked');
    } else {
      label.classList.remove('checked');
    }
  });
});

// Nav item active state
document.querySelectorAll('.nav-item').forEach(function (item) {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item').forEach(function (i) {
      i.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// Apply Now button
const applyBtn = document.querySelector('.btn-apply');
if (applyBtn) {
  applyBtn.addEventListener('click', function () {
    window.location.href = 'App_Job_Detail_Apply.html';
  });
}

// New Application button
const newAppBtn = document.querySelector('.new-app-btn');
if (newAppBtn) {
  newAppBtn.addEventListener('click', function () {
    window.location.href = 'App_Job_Detail_Apply.html';
  });
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
