import { getVerificationRequests, logout, removeToken, removeRole } from '../../frontend/api.js';

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

// ── Helpers ──
function getHashCell(req) {
  if (req.status === 'VERIFIED' && req.cert_hash) {
    return `<span class="hash-code">${req.cert_hash}</span>`;
  } else if (req.status === 'PENDING') {
    return `<span class="hash-pending">Verification in progress...</span>`;
  } else {
    return `<span class="hash-error">Record Mismatch / Rejected</span>`;
  }
}

function getActionButton(req) {
  if (req.status === 'REJECTED') {
    return `<button class="action-btn warn" title="Error" data-idx="${req.id}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </button>`;
  }
  return `<button class="action-btn" title="View" data-idx="${req.id}">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  </button>`;
}

function statusBadgeClass(status) {
  if (status === 'VERIFIED') return 'badge-verified';
  if (status === 'PENDING')  return 'badge-pending';
  return 'badge-rejected';
}

let allRequests = [];

function renderTable(requests) {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:#aaa;">No verification requests yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = requests.map((req, index) => {
    const initials = (req.student_name || 'UN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `
      <tr style="cursor:pointer;" onclick="showDetail(${index})">
        <td>
          <div class="student-cell">
            <div class="student-avatar av-blue">${initials}</div>
            <div>
              <div class="student-name">${req.student_name || '—'}</div>
              <div class="student-year">Year ${req.year || '—'}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="cred-name">${req.degree || '—'}</div>
          <div class="cred-inst">Verification Request #${req.id}</div>
        </td>
        <td><span class="status-badge ${statusBadgeClass(req.status)}">${req.status}</span></td>
        <td>${getHashCell(req)}</td>
        <td>${getActionButton(req)}</td>
      </tr>`;
  }).join('');
}

window.showDetail = function(index) {
  const req = allRequests[index];
  if (!req) return;
  const detailId = document.querySelector('.detail-id');
  if (detailId) detailId.textContent = `● ID: VR-${req.id}`;

  const names = document.querySelectorAll('.detail-name');
  const subs  = document.querySelectorAll('.detail-sub');
  if (names[0]) names[0].textContent = req.student_name || '—';
  if (subs[0])  subs[0].textContent  = `Degree: ${req.degree || '—'}`;
  if (names[1]) names[1].textContent = `University #${req.university_id}`;
  if (subs[1])  subs[1].textContent  = `Year: ${req.year || '—'}`;

  const remarks = document.querySelector('.remarks-box');
  if (remarks) {
    remarks.textContent = req.cert_hash
      ? `Certificate hash: ${req.cert_hash}. Status: ${req.status}.`
      : `Status: ${req.status}. Submitted on ${req.created_at ? new Date(req.created_at).toLocaleDateString() : '—'}.`;
  }

  document.getElementById('detailSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ── Pagination (static UI) ──
let currentPage = 1;
const totalPages = 3;

function updatePageButtons() {
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.getElementById('page' + i);
    if (btn) btn.classList.toggle('active', i === currentPage);
  }
  const info = document.querySelector('.page-info');
  if (info) info.textContent = `Showing ${(currentPage - 1) * 3 + 1}–${Math.min(currentPage * 3, allRequests.length)} of ${allRequests.length} requests`;
}

window.changePage = function(delta) {
  const next = currentPage + delta;
  if (next >= 1 && next <= totalPages) { currentPage = next; updatePageButtons(); }
};
window.setPage = function(n) { currentPage = n; updatePageButtons(); };

// ── Load data ──
document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('tableBody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:#aaa;">Loading...</td></tr>`;

  try {
    allRequests = await getVerificationRequests();
    renderTable(allRequests);
    updatePageButtons();
  } catch (err) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:#e04040;">Failed to load: ${err.message}</td></tr>`;
  }
});
