// Nav active state
document.querySelectorAll('.nav-item').forEach(function (item) {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item').forEach(function (i) {
      i.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// File upload – drag and drop
var uploadZone = document.getElementById('uploadZone');
var fileInput = document.getElementById('fileInput');
var browseBtn = document.getElementById('browseBtn');
var fileNameEl = document.getElementById('fileName');
var aiScoreSub = document.getElementById('aiScoreSub');

browseBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  fileInput.click();
});

uploadZone.addEventListener('click', function () {
  fileInput.click();
});

fileInput.addEventListener('change', function () {
  handleFile(this.files[0]);
});

uploadZone.addEventListener('dragover', function (e) {
  e.preventDefault();
  this.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', function () {
  this.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', function (e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  var file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file) return;
  var allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
    fileNameEl.textContent = 'Please upload a PDF or DOCX file.';
    fileNameEl.style.color = '#dc2626';
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    fileNameEl.textContent = 'File exceeds 10MB limit.';
    fileNameEl.style.color = '#dc2626';
    return;
  }
  fileNameEl.textContent = file.name + ' — ready to upload';
  fileNameEl.style.color = '#1e40af';
  simulateMatchScore();
}

function simulateMatchScore() {
  aiScoreSub.textContent = 'Calculating your match score...';
  setTimeout(function () {
    var score = Math.floor(Math.random() * 15) + 82;
    aiScoreSub.textContent = 'Match score: ' + score + '% — Strong fit for this role!';
  }, 1800);
}

// Apply button
var applyBtn = document.getElementById('applyBtn');

applyBtn.addEventListener('click', function () {
  var name = document.getElementById('fullName').value.trim();
  var email = document.getElementById('email').value.trim();
  var consent = document.getElementById('consent').checked;

  if (!name) {
    alert('Please enter your full name.');
    return;
  }
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!consent) {
    alert('Please consent to the background check to proceed.');
    return;
  }

  applyBtn.textContent = 'Submitting...';
  applyBtn.disabled = true;

  setTimeout(function () {
    applyBtn.innerHTML = 'Application Submitted!';
    applyBtn.classList.add('success');
    applyBtn.disabled = false;
    setTimeout(function () {
      applyBtn.innerHTML = 'Apply Now <svg viewBox="0 0 24 24" class="btn-icon" style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      applyBtn.classList.remove('success');
    }, 3000);
  }, 1500);
});

// Consent checkbox enables apply button style
var consentCb = document.getElementById('consent');
consentCb.addEventListener('change', function () {
  applyBtn.style.opacity = this.checked ? '1' : '0.7';
});
applyBtn.style.opacity = '0.7';

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
