import { getJobDetail, applyForJob, getApplicantProfile, logout, removeToken, removeRole, getName, setName } from '../../frontend/api.js';
import { initNotificationBell } from '../../frontend/notifications.js';
import { initAvatar } from '../../frontend/avatar.js';

// ── Nav active state ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Resume section ──
const uploadZone   = document.getElementById('uploadZone');
const fileInput    = document.getElementById('fileInput');
const browseBtn    = document.getElementById('browseBtn');
const fileNameEl   = document.getElementById('fileName');
const aiScoreSub   = document.getElementById('aiScoreSub');
const useExisting  = document.getElementById('useExisting');
const useNew       = document.getElementById('useNew');
const existingBox  = document.getElementById('existingResumeBox');
const uploadNewRow = document.getElementById('uploadNewRow');

let hasExistingResume = false;

// Toggle upload zone based on radio
function updateResumeUI() {
  if (useNew?.checked) {
    uploadZone.style.display = '';
  } else {
    uploadZone.style.display = 'none';
    if (fileNameEl) fileNameEl.textContent = '';
  }
}

useExisting?.addEventListener('change', updateResumeUI);
useNew?.addEventListener('change', updateResumeUI);

// Load existing resume from profile
async function loadExistingResume() {
  try {
    const profile = await getApplicantProfile();

    // Fill name and email
    const nameEl  = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    if (nameEl  && profile.full_name) nameEl.value  = profile.full_name;
    if (emailEl && profile.email)     emailEl.value = profile.email;

    // Navbar name
    const userNameEl = document.querySelector('.user-name');
    if (userNameEl && profile.full_name) { userNameEl.textContent = profile.full_name; setName(profile.full_name); }

    if (profile.resume_path) {
      hasExistingResume = true;
      const filename = profile.resume_path.split(/[\\/]/).pop();
      document.getElementById('existingResumeName').textContent = filename;
      existingBox.style.display = '';
      // Default: use existing, hide upload zone
      uploadZone.style.display = 'none';
    } else {
      // No resume — show upload directly, hide radio options
      existingBox.style.display = 'none';
      uploadNewRow.style.display = 'none';
      uploadZone.style.display = '';
    }
  } catch (e) {
    // Not logged in or error — show upload zone
    existingBox.style.display = 'none';
    uploadNewRow.style.display = 'none';
    uploadZone.style.display = '';
  }
}

// File upload handlers
browseBtn?.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
uploadZone?.addEventListener('click', () => fileInput.click());
fileInput?.addEventListener('change', function() { handleFile(this.files[0]); });

uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file) return;
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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
  setTimeout(() => {
    const score = Math.floor(Math.random() * 15) + 82;
    aiScoreSub.textContent = `Match score: ${score}% — Strong fit for this role!`;
  }, 1800);
}

// ── Error message helper ──
function showError(msg) {
  let errEl = document.querySelector('.apply-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'apply-error';
    errEl.style.cssText = 'color:#dc2626;font-size:13px;margin-top:8px;';
    const applyBtn = document.getElementById('applyBtn');
    applyBtn.parentNode.insertBefore(errEl, applyBtn.nextSibling);
  }
  errEl.textContent = msg;
}

// ── Apply button ──
const applyBtn = document.getElementById('applyBtn');
let jobId = null;

applyBtn.addEventListener('click', async () => {
  const coverLetter = document.getElementById('coverLetter')?.value?.trim() || '';
  const consent     = document.getElementById('consent')?.checked;

  if (!consent) { showError('Please consent to the background check to proceed.'); return; }
  if (!jobId)   { showError('No job selected. Please go back to job listings.'); return; }

  applyBtn.textContent = 'Submitting...';
  applyBtn.disabled    = true;
  showError('');

  try {
    await applyForJob(jobId, coverLetter);
    applyBtn.innerHTML = 'Application Submitted! ✓';
    applyBtn.classList.add('success');
    applyBtn.disabled = true;
  } catch (err) {
    showError(err.message || 'Failed to submit application.');
    applyBtn.textContent = 'Apply Now';
    applyBtn.disabled    = false;
  }
});

// ── Consent checkbox ──
const consentCb = document.getElementById('consent');
consentCb.addEventListener('change', function() { applyBtn.style.opacity = this.checked ? '1' : '0.7'; });
applyBtn.style.opacity = '0.7';

// ── Sign Out ──
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', async e => {
    e.preventDefault();
    try { await logout(); } catch (_) {}
    removeToken();
    removeRole();
    window.location.href = '../Other_Frontend/Login.html';
  });
}

// ── Load job detail ──
async function loadJobDetail() {
  // Get job_id from URL params or localStorage
  const params = new URLSearchParams(window.location.search);
  jobId = parseInt(params.get('job_id') || localStorage.getItem('selected_job_id'));

  if (!jobId) return; // Use static content

  try {
    const job = await getJobDetail(jobId);

    // Populate job header
    const titleEl = document.querySelector('.job-title');
    if (titleEl) titleEl.textContent = job.title || 'Job Detail';

    const metaItems = document.querySelectorAll('.meta-item');
    if (metaItems[0]) metaItems[0].innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${job.location || 'Remote'}`;
    if (metaItems[1]) {
      const salary = job.salary_min && job.salary_max
        ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k /yr`
        : 'Salary not specified';
      metaItems[1].innerHTML = `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> ${salary}`;
    }
    if (metaItems[2]) metaItems[2].innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${job.job_type || 'Full-time'}`;

    // Description
    const descEl = document.querySelector('.section-body');
    if (descEl && job.description) descEl.textContent = job.description;

    // Breadcrumb
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = job.title || 'Job Detail';
  } catch (err) {
    console.warn('Job detail load error:', err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNotificationBell();
  initAvatar();
  loadExistingResume();
  loadJobDetail();
});
