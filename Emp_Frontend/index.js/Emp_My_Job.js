import { getMyJobs, deleteJob, updateJob, logout, removeToken, removeRole } from '../../frontend/api.js';

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

document.addEventListener('DOMContentLoaded', async () => {
  const jobList = document.getElementById('jobList');

  // ── Tab filtering (works on both static and dynamic cards) ──
  function bindTabs() {
    const tabs     = document.querySelectorAll('.tab');
    const jobCards = document.querySelectorAll('.job-card');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        jobCards.forEach(card => {
          const status = card.getAttribute('data-status');
          card.style.display = (filter === 'all' || status === filter) ? 'flex' : 'none';
        });
      });
    });
  }

  // ── Search ──
  function bindSearch() {
    const searchInput = document.querySelector('.search-box input') || document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.job-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
  }

  // ── Render jobs from API ──
  function renderJobs(jobs) {
    if (!jobList) return;
    if (jobs.length === 0) {
      jobList.innerHTML = '<p style="color:#aaa;padding:24px;">No jobs posted yet.</p>';
      return;
    }

    jobList.innerHTML = jobs.map(job => {
      const statusLabel = job.status === 'OPEN' ? 'Active' : job.status === 'CLOSED' ? 'Closed' : job.status;
      const badgeClass  = job.status === 'OPEN' ? 'active-badge' : 'closed-badge';
      const salary = job.salary_min && job.salary_max
        ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k`
        : job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k+` : 'Salary not specified';
      return `
        <div class="job-card" data-status="${job.status === 'OPEN' ? 'active' : 'closed'}" data-id="${job.id}">
          <div class="job-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/></svg>
          </div>
          <div class="job-info">
            <div class="job-title-row">
              <h4 class="job-title">${job.title}</h4>
              <span class="status-badge ${badgeClass}">${statusLabel}</span>
            </div>
            <div class="job-meta">
              <span>📍 ${job.location || 'Remote'}</span>
              <span>💰 ${salary}</span>
              <span>🕐 ${job.job_type || 'Full-time'}</span>
            </div>
          </div>
          <div class="job-actions">
            <button class="btn-outline view-apps-btn" data-id="${job.id}">View Applications</button>
            <button class="icon-action toggle-status-btn" data-id="${job.id}" data-status="${job.status}" title="Toggle status">⟳</button>
            <button class="icon-action danger delete-btn" data-id="${job.id}" title="Delete">🗑</button>
          </div>
        </div>`;
    }).join('');

    // Bind delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id   = parseInt(btn.dataset.id);
        const card = btn.closest('.job-card');
        const title = card?.querySelector('.job-title')?.textContent || 'this job';
        if (!confirm(`Delete "${title}"?`)) return;
        try {
          await deleteJob(id);
          card.style.transition = 'opacity 0.3s';
          card.style.opacity    = '0';
          setTimeout(() => card.remove(), 300);
          showToast('Job deleted.');
        } catch (err) {
          showToast('Error: ' + err.message);
        }
      });
    });

    // Bind toggle status buttons
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id        = parseInt(btn.dataset.id);
        const curStatus = btn.dataset.status;
        const newStatus = curStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
        try {
          await updateJob(id, { status: newStatus });
          btn.dataset.status = newStatus;
          const badge = btn.closest('.job-card')?.querySelector('.status-badge');
          if (badge) {
            badge.textContent = newStatus === 'OPEN' ? 'Active' : 'Closed';
            badge.className   = `status-badge ${newStatus === 'OPEN' ? 'active-badge' : 'closed-badge'}`;
          }
          showToast(`Job status updated to ${newStatus}.`);
        } catch (err) {
          showToast('Error: ' + err.message);
        }
      });
    });

    // Bind view applications buttons
    document.querySelectorAll('.view-apps-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('selected_job_id', btn.dataset.id);
        window.location.href = 'Emp_Job_Application.html';
      });
    });

    bindTabs();
    bindSearch();
  }

  // ── Load jobs ──
  if (jobList) {
    jobList.innerHTML = '<p style="color:#aaa;padding:24px;">Loading...</p>';
    try {
      const jobs = await getMyJobs();
      renderJobs(jobs);
    } catch (err) {
      jobList.innerHTML = `<p style="color:#e04040;padding:24px;">Failed to load jobs: ${err.message}</p>`;
    }
  } else {
    // Static HTML page — just bind existing UI
    bindTabs();
    bindSearch();

    document.querySelectorAll('.icon-action.danger').forEach(btn => {
      btn.addEventListener('click', () => {
        const card  = btn.closest('.job-card');
        const title = card?.querySelector('.job-title')?.textContent || 'this job';
        if (confirm(`Delete "${title}"?`) && card) {
          card.style.transition = 'opacity 0.3s';
          card.style.opacity    = '0';
          setTimeout(() => card.remove(), 300);
        }
      });
    });
  }

  // ── Create New Listing ──
  const createBtn = document.querySelector('.btn-primary');
  if (createBtn) {
    createBtn.addEventListener('click', () => { window.location.href = 'Emp_Post_Job.html'; });
  }
});
