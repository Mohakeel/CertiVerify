import { getJobs, logout, getName } from '../../frontend/api.js';

// ── Navbar name ──
const userNameEl = document.querySelector('.user-name');
if (userNameEl) {
  const stored = getName();
  if (stored) userNameEl.textContent = stored;
}

// ── Sign Out ──
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', async e => {
    e.preventDefault();
    await logout();
    window.location.href = '../Other_Frontend/Login.html';
  });
}

// ── Salary range filter ──
const salaryRange = document.getElementById('salaryRange');
if (salaryRange) {
  const labels = document.querySelectorAll('.range-labels span');
  salaryRange.addEventListener('input', function() {
    const num = parseInt(this.value);
    if (labels[1]) labels[1].textContent = num >= 350000 ? '$350k+' : `$${Math.round(num / 1000)}k`;
  });
}

// ── Pill filter toggle ──
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', function() {
    const group = this.closest('.filter-group');
    group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Checkbox toggle style ──
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', function() {
    const label = this.closest('.checkbox-item');
    label.classList.toggle('checked', this.checked);
  });
});

// ── Nav item active state ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Apply Now / New Application buttons ──
const applyBtn = document.querySelector('.btn-apply');
if (applyBtn) applyBtn.addEventListener('click', () => { window.location.href = 'App_Job_Detail_Apply.html'; });

const newAppBtn = document.querySelector('.new-app-btn');
if (newAppBtn) newAppBtn.addEventListener('click', () => { window.location.href = 'App_Job_Detail_Apply.html'; });

// ── Load jobs from API and render dynamic listing ──
let allJobs = [];

function renderJobCards(jobs) {
  const listings = document.querySelector('.listings');
  if (!listings) return;

  // Keep the featured static cards, append API jobs below
  const existingDynamic = listings.querySelectorAll('.api-job-card');
  existingDynamic.forEach(el => el.remove());

  if (jobs.length === 0) return;

  const container = document.createElement('div');
  container.className = 'api-jobs-section';
  container.innerHTML = `<h3 style="margin:24px 0 12px;font-size:16px;color:#374151;">Live Job Listings (${jobs.length})</h3>`;

  jobs.forEach(job => {
    const salary = job.salary_min && job.salary_max
      ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k`
      : job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k+` : 'Salary not specified';

    const card = document.createElement('div');
    card.className = 'job-card small-card api-job-card';
    card.dataset.title    = (job.title || '').toLowerCase();
    card.dataset.location = (job.location || '').toLowerCase();
    card.dataset.type     = (job.job_type || '').toLowerCase();
    card.innerHTML = `
      <div class="small-card-top">
        <div class="company-icon">
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <span class="badge fulltime-badge">${job.job_type || 'Full-time'}</span>
      </div>
      <h3 class="job-title">${job.title}</h3>
      <p class="company-meta small">📍 ${job.location || 'Remote'}</p>
      <p class="job-desc small">${(job.description || '').slice(0, 100)}${job.description && job.description.length > 100 ? '...' : ''}</p>
      <div class="small-card-footer">
        <span class="salary small">${salary}</span>
        <a href="App_Job_Detail_Apply.html?job_id=${job.id}" class="view-details small" onclick="localStorage.setItem('selected_job_id','${job.id}')">Apply ›</a>
      </div>`;
    container.appendChild(card);
  });

  listings.appendChild(container);
}

// ── Client-side search on loaded data ──
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    document.querySelectorAll('.api-job-card').forEach(card => {
      const text = (card.dataset.title + ' ' + card.dataset.location + ' ' + card.dataset.type);
      card.style.display = !query || text.includes(query) ? '' : 'none';
    });
  });
}

// ── Load ──
document.addEventListener('DOMContentLoaded', async () => {
  try {
    allJobs = await getJobs();
    renderJobCards(allJobs);
  } catch (err) {
    console.warn('Jobs load error:', err.message);
  }
});
