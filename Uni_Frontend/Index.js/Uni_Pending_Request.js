document.addEventListener('DOMContentLoaded', () => {

  // ── Data ──
  const allRequests = [
    { id: 1, initials: 'AM', name: 'Alexander Mitchell', sid: '2024-88421', degree: 'B.S. Computer Science',    faculty: 'Faculty of Engineering',  year: 2024, date: 'Oct 24, 2023', priority: false },
    { id: 2, initials: 'SN', name: 'Sarah Nguyen',       sid: '2024-71290', degree: 'M.A. International Law',  faculty: 'Law School',              year: 2023, date: 'Oct 25, 2023', priority: true  },
    { id: 3, initials: 'DT', name: 'David Thompson',     sid: '2024-99124', degree: 'Ph.D. Biomedical Science', faculty: 'School of Medicine',     year: 2024, date: 'Oct 25, 2023', priority: true  },
    { id: 4, initials: 'LK', name: 'Laura Kim',          sid: '2024-55312', degree: 'B.A. Economics',          faculty: 'Faculty of Commerce',     year: 2024, date: 'Oct 26, 2023', priority: false },
    { id: 5, initials: 'RJ', name: 'Ryan Johnson',       sid: '2024-44201', degree: 'M.Sc. Data Science',      faculty: 'Faculty of Computing',    year: 2025, date: 'Oct 26, 2023', priority: false },
    { id: 6, initials: 'MP', name: 'Maria Petrova',      sid: '2024-33109', degree: 'Ph.D. Neuroscience',      faculty: 'School of Medicine',      year: 2024, date: 'Oct 27, 2023', priority: true  },
    { id: 7, initials: 'TC', name: 'Thomas Clarke',      sid: '2024-22876', degree: 'B.Eng. Civil Engineering', faculty: 'Faculty of Engineering', year: 2023, date: 'Oct 27, 2023', priority: false },
    { id: 8, initials: 'AF', name: 'Aisha Farooq',       sid: '2024-11543', degree: 'M.A. Philosophy',         faculty: 'Faculty of Arts',         year: 2024, date: 'Oct 28, 2023', priority: false },
  ];

  const PAGE_SIZE = 3;
  let currentPage = 1;
  let activeFilter = 'all';
  let requests = [...allRequests];
  let pendingAction = null;

  // ── Stats ──
  const queueEl    = document.getElementById('stat-queue');
  const approvalsEl = document.getElementById('stat-approvals');
  const flaggedEl  = document.getElementById('stat-flagged');

  function updateStats() {
    queueEl.textContent    = requests.length;
    flaggedEl.textContent  = requests.filter(r => r.priority).length;
  }

  // ── Render Table ──
  function getFilteredRequests() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    let filtered = activeFilter === 'high'
      ? requests.filter(r => r.priority)
      : [...requests];
    if (query) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.degree.toLowerCase().includes(query) ||
        r.faculty.toLowerCase().includes(query) ||
        r.sid.includes(query)
      );
    }
    return filtered;
  }

  function renderTable() {
    const filtered = getFilteredRequests();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:#aaa;">No requests found.</td></tr>`;
    } else {
      pageItems.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="student-cell">
              <div class="stu-avatar">${req.initials}</div>
              <div>
                <div class="stu-name">${req.name}</div>
                <div class="stu-id">ID: ${req.sid}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="deg-name">${req.degree}</div>
            <div class="deg-faculty">${req.faculty}</div>
          </td>
          <td>${req.year}</td>
          <td>${req.date}</td>
          <td>
            <div class="action-cell">
              <button class="btn-reject" data-id="${req.id}">Reject</button>
              <button class="btn-approve" data-id="${req.id}">Approve</button>
            </div>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    // Update footer
    const total = filtered.length;
    const end = Math.min(start + PAGE_SIZE, total);
    document.getElementById('showing-text').textContent =
      total === 0
        ? 'No requests found'
        : `Showing ${start + 1} to ${end} of ${total} requests`;

    document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;

    // Bind action buttons
    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', () => openModal('approve', parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', () => openModal('reject', parseInt(btn.dataset.id)));
    });
  }

  // ── Modal ──
  function openModal(type, reqId) {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    pendingAction = { type, reqId };

    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-icon').textContent = type === 'approve' ? '✅' : '❌';
    document.getElementById('modal-title').textContent =
      type === 'approve' ? `Approve ${req.name}?` : `Reject ${req.name}?`;
    document.getElementById('modal-desc').textContent =
      type === 'approve'
        ? `This will approve the ${req.degree} credential for ${req.name} and issue a verified certificate.`
        : `This will reject the ${req.degree} credential for ${req.name}. The student will be notified.`;

    const confirmBtn = document.getElementById('modal-confirm');
    confirmBtn.textContent = type === 'approve' ? 'Approve' : 'Reject';
    confirmBtn.style.background = type === 'approve' ? '#3b35c3' : '#d64040';

    overlay.classList.add('show');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
    pendingAction = null;
  }

  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  document.getElementById('modal-confirm').addEventListener('click', () => {
    if (!pendingAction) return;
    const { type, reqId } = pendingAction;
    const req = requests.find(r => r.id === reqId);
    closeModal();

    requests = requests.filter(r => r.id !== reqId);

    if (type === 'approve') {
      const approvals = parseInt(approvalsEl.textContent);
      approvalsEl.textContent = approvals + 1;
      showToast(`✓ ${req.name}'s credential approved.`);
    } else {
      showToast(`✗ ${req.name}'s credential rejected.`);
    }

    updateStats();
    renderTable();
  });

  // ── Pagination ──
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderTable(); }
  });
  document.getElementById('next-btn').addEventListener('click', () => {
    const total = Math.ceil(getFilteredRequests().length / PAGE_SIZE);
    if (currentPage < total) { currentPage++; renderTable(); }
  });

  // ── Filter Tabs ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      currentPage = 1;
      renderTable();
    });
  });

  // ── Search ──
  document.getElementById('search-input').addEventListener('input', () => {
    currentPage = 1;
    renderTable();
  });

  // ── Batch ──
  document.getElementById('batch-btn').addEventListener('click', () => {
    const btn = document.getElementById('batch-btn');
    btn.textContent = '⏳ Processing...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '✨ Initialize AI Batch';
      btn.disabled = false;
      showToast('AI Batch verification initialized successfully.');
    }, 2000);
  });

  // ── Handbook ──
  document.getElementById('handbook-link').addEventListener('click', e => {
    e.preventDefault();
    showToast('Opening Registrar Handbook...');
  });

  // ── Bell ──
  const bellBtn = document.getElementById('bell-btn');
  const dot = document.createElement('span');
  dot.style.cssText = `position:absolute;top:2px;right:2px;width:7px;height:7px;background:#e04040;border-radius:50%;display:block;`;
  bellBtn.appendChild(dot);
  bellBtn.addEventListener('click', () => {
    dot.style.display = dot.style.display === 'none' ? 'block' : 'none';
    showToast('Notifications cleared.');
  });

  // ── Sign Out ──
  document.getElementById('sign-out').addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) showToast('Signed out successfully.');
  });

  // ── Nav highlight ──
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── Toast ──
  function showToast(msg, duration = 2800) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  // ── Init ──
  updateStats();
  renderTable();
});

// Sign out
const signOutBtnUni = document.getElementById('signOutBtn');
if (signOutBtnUni) {
  signOutBtnUni.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      window.location.href = '../Other_Frontend/Login.html';
    }
  });
}
