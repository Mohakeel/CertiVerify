import { getJobs, logout, getName } from '../../frontend/api.js';

// ── Navbar name ──
const userNameEl = document.querySelector('.user-name');
if (userNameEl) {
  const stored = getName();
  if (stored) userNameEl.textContent = stored;
}

// ── Sign Out ──
document.getElementById('signOutBtn')?.addEventListener('click', async e => {
  e.preventDefault();
  await logout();
  window.location.href = '../Other_Frontend/Login.html';
});

// ── State ──
let allJobs = [];
let activeType = ''; // '', 'Full-time', 'Contract', 'Part-time'

// ── Filters ──
function getFilters() {
  const remote = document.getElementById('cb-remote')?.checked;
  const onsite = document.getElementById('cb-onsite')?.checked;
  const search = document.querySelector('.search-input')?.value.toLowerCase().trim() || '';
  return { remote, onsite, search };
}

function matchesLocation(job, remote, onsite) {
  if (remote && onsite) return true; // both checked = show all
  if (!remote && !onsite) return false; // none checked = show nothing
  const loc = (job.location || '').toLowerCase();
  const isRemote = loc.includes('remote');
  if (remote && isRemote) return true;
  if (onsite && !isRemote) return true;
  return false;
}

function applyFilters() {
  const { remote, onsite, search } = getFilters();
  return allJobs.filter(job => {
    const matchLoc  = matchesLocation(job, remote, onsite);
    const matchType = !activeType || (job.job_type || '').toLowerCase() === activeType.toLowerCase();
    const matchQ    = !search ||
      (job.title || '').toLowerCase().includes(search) ||
      (job.location || '').toLowerCase().includes(search) ||
      (job.description || '').toLowerCase().includes(search);
    return matchLoc && matchType && matchQ;
  });
}

// ── Render ──
function renderJobs() {
  const listings = document.getElementById('jobListings');
  if (!listings) return;
  const jobs = applyFilters();
  listings.innerHTML = '';

  if (jobs.length === 0) {
    listings.innerHTML = `<div style="padding:3rem;text-align:center;color:#9ca3af;font-size:15px;">No jobs match your filters.</div>`;
    return;
  }

  jobs.forEach(job => {
    const salary = job.salary_min && job.salary_max
      ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k`
      : job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k+` : 'Salary not listed';

    const loc = job.location || 'Remote';
    const isRemote = loc.toLowerCase().includes('remote');
    const locBadge = isRemote
      ? `<span class="tag">Remote</span>`
      : `<span class="tag">On-site</span>`;

    const card = document.createElement('div');
    card.className = 'job-card featured-top';
    card.innerHTML = `
      <div class="job-card-left">
        <div class="company-icon verified">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
      </div>
      <div class="job-card-body">
        <div class="job-card-header">
          <div class="job-title-row">
            <h3 class="job-title">${job.title}</h3>
            <span class="badge fulltime-badge">${job.job_type || 'Full-time'}</span>
          </div>
          <p class="salary">${salary} <span class="salary-period">yearly base</span></p>
        </div>
        <p class="company-meta">${loc}</p>
        <p class="job-desc">${(job.description || '').slice(0, 140)}${(job.description || '').length > 140 ? '...' : ''}</p>
        <div class="job-footer">
          ${locBadge}
          <a href="App_Job_Detail_Apply.html?job_id=${job.id}" class="view-details"
             onclick="localStorage.setItem('selected_job_id','${job.id}')">View Details →</a>
        </div>
      </div>`;
    listings.appendChild(card);
  });
}

// ── Filter listeners ──
document.getElementById('cb-remote')?.addEventListener('change', e => {
  e.target.closest('.checkbox-item').classList.toggle('checked', e.target.checked);
  renderJobs();
});
document.getElementById('cb-onsite')?.addEventListener('change', e => {
  e.target.closest('.checkbox-item').classList.toggle('checked', e.target.checked);
  renderJobs();
});

document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    activeType = this.textContent.trim() === 'All' ? '' : this.textContent.trim();
    renderJobs();
  });
});

document.querySelector('.search-input')?.addEventListener('input', () => renderJobs());

// ── Salary range (visual only) ──
const salaryRange = document.getElementById('salaryRange');
if (salaryRange) {
  salaryRange.addEventListener('input', function () {
    const labels = document.querySelectorAll('.range-labels span');
    const num = parseInt(this.value);
    if (labels[1]) labels[1].textContent = num >= 350000 ? '$350k+' : `$${Math.round(num / 1000)}k`;
  });
}

// ── Load ──
document.addEventListener('DOMContentLoaded', async () => {
  const listings = document.getElementById('jobListings');
  if (listings) listings.innerHTML = `<div style="padding:3rem;text-align:center;color:#9ca3af;">Loading jobs...</div>`;
  try {
    allJobs = await getJobs();
    renderJobs();
  } catch (err) {
    if (listings) listings.innerHTML = `<div style="padding:3rem;text-align:center;color:#dc2626;">Failed to load jobs: ${err.message}</div>`;
  }
});
