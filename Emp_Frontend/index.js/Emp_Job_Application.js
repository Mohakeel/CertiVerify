// ─── Data ─────────────────────────────────────
const allApplicants = [
  {
    id: 1,
    initials: 'ES',
    avClass: 'es',
    name: 'Elena Sorvino',
    email: 'elena.s@example.com',
    cover: '"Driven by data accuracy and strategic foreca...',
    date: 'Oct 14, 2023',
    status: 'Pending',
    photo: null,
    tab: ['all']
  },
  {
    id: 2,
    initials: 'MT',
    avClass: null,
    name: 'Marcus Thorne',
    email: 'm.thorne@globalnet.io',
    cover: '"As a Senior Analyst with 8 years of experienc...',
    date: 'Oct 13, 2023',
    status: 'Accepted',
    photo: 'https://i.pravatar.cc/38?img=15',
    tab: ['all', 'shortlisted']
  },
  {
    id: 3,
    initials: 'JL',
    avClass: 'jl',
    name: 'Jillian Lee',
    email: 'lee.jill@analytics.co',
    cover: '"My methodology focuses on qualitative storyt...',
    date: 'Oct 12, 2023',
    status: 'Reviewed',
    photo: null,
    tab: ['all', 'verified']
  },
  {
    id: 4,
    initials: 'RB',
    avClass: 'rb',
    name: 'Richard Brooks',
    email: 'richard.b@freelance.org',
    cover: '"I\'m transitioning from a marketing role where I...',
    date: 'Oct 11, 2023',
    status: 'Rejected',
    photo: null,
    tab: ['all']
  }
];

let currentTab = 'all';
let currentStatusFilter = 'All';
let currentPage = 1;
let activeRowIndex = null;

// ─── Render Table ─────────────────────────────────────
function getFilteredData() {
  return allApplicants.filter(a => {
    const tabMatch = a.tab.includes(currentTab);
    const statusMatch = currentStatusFilter === 'All' || a.status === currentStatusFilter;
    return tabMatch && statusMatch;
  });
}

function statusBadgeHTML(status) {
  const map = {
    'Pending':  '<span class="badge badge-pending">Pending</span>',
    'Accepted': '<span class="badge badge-accepted">Accepted</span>',
    'Rejected': '<span class="badge badge-rejected">Rejected</span>',
    'Reviewed': `<span class="reviewed-wrapper">Reviewed
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </span>`
  };
  return map[status] || `<span class="badge">${status}</span>`;
}

function avatarHTML(a) {
  if (a.photo) {
    return `<div class="ap-av"><img src="${a.photo}" alt="${a.name}"/></div>`;
  }
  return `<div class="ap-av ${a.avClass}">${a.initials}</div>`;
}

function renderTable() {
  const data = getFilteredData();
  const tbody = document.getElementById('tableBody');

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:#aaa;">No applicants found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((a, i) => `
    <tr onclick="selectRow(${i})" oncontextmenu="openContext(event, ${i}); return false;">
      <td>
        <div class="applicant-cell">
          ${avatarHTML(a)}
          <div>
            <div class="ap-name">${a.name}</div>
            <div class="ap-email">${a.email}</div>
          </div>
        </div>
      </td>
      <td><span class="cover-snippet">${a.cover}</span></td>
      <td><span class="date-cell">${a.date}</span></td>
      <td>${statusBadgeHTML(a.status)}</td>
      <td>
        <div class="action-cell">
          <button class="act-btn" title="View" onclick="event.stopPropagation(); showToast('Viewing ${a.name}\'s profile')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="act-btn" title="More" onclick="event.stopPropagation(); openContext(event, ${i})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="5" r="1" fill="currentColor"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updatePageInfo(data.length);
}

function updatePageInfo(count) {
  const end = Math.min(currentPage * 4, 42);
  const start = (currentPage - 1) * 4 + 1;
  document.getElementById('showRange').textContent = `${start}-${Math.min(start + count - 1, end)}`;
}

// ─── Tabs ─────────────────────────────────────
function switchTab(el, tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentTab = tab;
  currentPage = 1;
  renderTable();
}

// ─── Status Filter ─────────────────────────────────────
let statusDropOpen = false;

function toggleStatusDrop() {
  statusDropOpen = !statusDropOpen;
  document.getElementById('statusDropdown').classList.toggle('open', statusDropOpen);
}

function filterStatus(e, status) {
  e.stopPropagation();
  currentStatusFilter = status;
  document.getElementById('statusLabel').textContent = `Status: ${status}`;
  statusDropOpen = false;
  document.getElementById('statusDropdown').classList.remove('open');
  renderTable();
}

document.addEventListener('click', function(e) {
  const sel = document.getElementById('statusSelect');
  if (!sel.contains(e.target)) {
    statusDropOpen = false;
    document.getElementById('statusDropdown').classList.remove('open');
  }
  const ctx = document.getElementById('contextMenu');
  if (!ctx.contains(e.target)) {
    ctx.classList.remove('open');
  }
});

// ─── Pagination ─────────────────────────────────────
function setPage(n) {
  currentPage = n;
  [1,2,3].forEach(i => {
    const btn = document.getElementById(`pg${i}`);
    btn.classList.toggle('active', i === n);
  });
  renderTable();
}

function changePage(delta) {
  const next = currentPage + delta;
  if (next >= 1 && next <= 3) setPage(next);
}

// ─── Row Selection ─────────────────────────────────────
function selectRow(index) {
  activeRowIndex = index;
  const rows = document.querySelectorAll('#tableBody tr');
  rows.forEach((r, i) => {
    r.style.background = i === index ? '#f0f4ff' : '';
  });
}

// ─── Context Menu ─────────────────────────────────────
function openContext(e, index) {
  e.stopPropagation();
  activeRowIndex = index;
  const menu = document.getElementById('contextMenu');
  menu.style.top = `${e.clientY}px`;
  menu.style.left = `${Math.min(e.clientX, window.innerWidth - 180)}px`;
  menu.classList.add('open');
}

function ctxAction(action) {
  const data = getFilteredData();
  if (activeRowIndex === null || !data[activeRowIndex]) return;

  const applicant = data[activeRowIndex];
  const original = allApplicants.find(a => a.id === applicant.id);

  const messages = {
    view: `Viewing ${applicant.name}'s full profile`,
    accept: `${applicant.name} has been accepted`,
    reject: `${applicant.name} has been rejected`,
    shortlist: `${applicant.name} added to shortlist`
  };

  if (action === 'accept' && original) original.status = 'Accepted';
  if (action === 'reject' && original) original.status = 'Rejected';
  if (action === 'shortlist' && original && !original.tab.includes('shortlisted')) {
    original.tab.push('shortlisted');
  }

  document.getElementById('contextMenu').classList.remove('open');
  showToast(messages[action]);
  renderTable();
}

// ─── Toast ─────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Init ─────────────────────────────────────
renderTable();

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
