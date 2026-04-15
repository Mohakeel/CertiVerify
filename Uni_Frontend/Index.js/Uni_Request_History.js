document.addEventListener('DOMContentLoaded', () => {

  // ── Dataset ──
  const dataset = [
    { id:1,  initials:'EJ', name:'Elena J. Sterling',  sid:'#9902-881',  degree:'B.Sc. Computer Science',       year:'2023', status:'VERIFIED',  hash:'0x7a2...b4e1', note:'' },
    { id:2,  initials:'MR', name:'Marcus Rodriguez',   sid:'#1105-224',  degree:'MBA International Finance',   year:'2021', status:'REJECTED',  hash:'',             note:'Incomplete transcript records for Semester 4' },
    { id:3,  initials:'SK', name:'Sarah Kapoor',       sid:'#8832-109',  degree:'Ph.D. Quantum Physics',       year:'2023', status:'VERIFIED',  hash:'0x4c9...f2d0', note:'' },
    { id:4,  initials:'TB', name:'Tobias Brenner',     sid:'#4402-911',  degree:'B.A. Digital Communications', year:'2024', status:'PENDING',   hash:'',             note:'Awaiting faculty approval' },
    { id:5,  initials:'AL', name:'Alicia Lim',         sid:'#3301-442',  degree:'M.Sc. Bioinformatics',        year:'2022', status:'VERIFIED',  hash:'0x1f8...e9c3', note:'' },
    { id:6,  initials:'JP', name:'James Park',         sid:'#7701-563',  degree:'B.Eng. Electrical',           year:'2023', status:'REJECTED',  hash:'',             note:'Missing graduation signature from Dean' },
    { id:7,  initials:'FO', name:'Fatima Omar',        sid:'#6620-887',  degree:'Ph.D. Astrophysics',          year:'2022', status:'VERIFIED',  hash:'0x9d1...a7b2', note:'' },
    { id:8,  initials:'NW', name:'Noah Williams',      sid:'#5510-114',  degree:'B.Sc. Mathematics',           year:'2024', status:'PENDING',   hash:'',             note:'Document upload pending' },
    { id:9,  initials:'CM', name:'Clara Meier',        sid:'#4409-330',  degree:'M.A. Political Science',      year:'2023', status:'VERIFIED',  hash:'0x3b5...c6f1', note:'' },
    { id:10, initials:'RK', name:'Raj Kumar',          sid:'#2208-775',  degree:'MBA Finance & Strategy',      year:'2021', status:'REJECTED',  hash:'',             note:'Duplicate application detected' },
    { id:11, initials:'YC', name:'Yuki Chen',          sid:'#1107-219',  degree:'B.A. Architecture',           year:'2024', status:'PENDING',   hash:'',             note:'Awaiting departmental clearance' },
    { id:12, initials:'PB', name:'Patrick Boateng',    sid:'#0906-661',  degree:'Ph.D. Environmental Science', year:'2022', status:'VERIFIED',  hash:'0x5e7...d3a8', note:'' },
  ];

  const PAGE_SIZE = 4;
  let currentPage = 1;
  let filtered = [...dataset];

  // ── Render ──
  function getFiltered() {
    const query  = document.getElementById('global-search').value.trim().toLowerCase();
    const year   = document.getElementById('year-filter').value;
    const status = document.getElementById('status-filter').value;

    return dataset.filter(r => {
      const matchQ = !query ||
        r.name.toLowerCase().includes(query) ||
        r.sid.toLowerCase().includes(query) ||
        r.hash.toLowerCase().includes(query) ||
        r.degree.toLowerCase().includes(query);
      const matchY = !year   || r.year === year;
      const matchS = !status || r.status === status;
      return matchQ && matchY && matchS;
    });
  }

  function renderTable() {
    filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const items = filtered.slice(start, start + PAGE_SIZE);
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2.5rem;color:#aaa;font-size:14px;">No records match your filters.</td></tr>`;
    } else {
      items.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="student-cell">
              <div class="stu-avatar">${r.initials}</div>
              <div>
                <div class="stu-name">${r.name}</div>
                <div class="stu-id">ID: ${r.sid}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="deg-name">${r.degree}</div>
            <div class="deg-year">Class of ${r.year}</div>
          </td>
          <td>${badgeHTML(r.status)}</td>
          <td>${vdataHTML(r)}</td>
          <td>${actionHTML(r)}</td>`;
        tbody.appendChild(tr);
      });
    }

    // Showing text
    const total = filtered.length;
    const end   = Math.min(start + PAGE_SIZE, total);
    const showEl = document.getElementById('showing-text');
    showEl.innerHTML = total === 0
      ? 'No records found'
      : `Showing <strong>${start + 1} – ${end}</strong> of ${total.toLocaleString()} records`;

    renderPagination(totalPages);
    bindActionBtns();
  }

  function badgeHTML(status) {
    const map = { VERIFIED:'badge-verified', REJECTED:'badge-rejected', PENDING:'badge-pending' };
    return `<span class="badge ${map[status]||''}">${status}</span>`;
  }

  function vdataHTML(r) {
    if (r.status === 'VERIFIED') {
      return `<div class="vdata-label blue">CERTIFICATE HASH</div>
              <div class="hash-pill">${r.hash}</div>`;
    }
    if (r.status === 'REJECTED') {
      return `<div class="vdata-label red">REJECTION REASON</div>
              <div class="rejection-text">${r.note}</div>`;
    }
    return `<div class="awaiting-text">${r.note || 'Awaiting processing'}</div>`;
  }

  function actionHTML(r) {
    if (r.status === 'VERIFIED')
      return `<button class="btn-view" data-id="${r.id}" title="View details">&#128065;</button>`;
    if (r.status === 'REJECTED')
      return `<button class="btn-notes" data-id="${r.id}" title="View notes">&#8801;&#9998;</button>`;
    return `<button class="btn-process" data-id="${r.id}">Process</button>`;
  }

  // ── Pagination ──
  function renderPagination(totalPages) {
    const pg = document.getElementById('pagination');
    pg.innerHTML = '';

    const prev = mkPgBtn('&#8249;', currentPage === 1);
    prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
    pg.appendChild(prev);

    const pages = paginationPages(currentPage, totalPages);
    pages.forEach(p => {
      if (p === '...') {
        const el = document.createElement('span');
        el.className = 'pg-ellipsis';
        el.textContent = '...';
        pg.appendChild(el);
      } else {
        const btn = mkPgBtn(p, false);
        if (p === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => { currentPage = p; renderTable(); });
        pg.appendChild(btn);
      }
    });

    const next = mkPgBtn('&#8250;', currentPage === totalPages);
    next.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderTable(); } });
    pg.appendChild(next);
  }

  function mkPgBtn(label, disabled) {
    const btn = document.createElement('button');
    btn.className = 'pg-btn';
    btn.innerHTML = label;
    btn.disabled = disabled;
    return btn;
  }

  function paginationPages(cur, total) {
    if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
    if (cur <= 3) return [1, 2, 3, '...', total];
    if (cur >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', cur - 1, cur, cur + 1, '...', total];
  }

  // ── Action button handlers ──
  function bindActionBtns() {
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.btn-notes').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.btn-process').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = dataset.find(x => x.id === parseInt(btn.dataset.id));
        if (r && confirm(`Process ${r.name}'s pending request?`)) {
          r.status = 'VERIFIED';
          r.hash   = '0x' + Math.random().toString(16).slice(2, 7) + '...' + Math.random().toString(16).slice(2, 6);
          renderTable();
          showToast(`✓ ${r.name}'s credential has been processed.`);
        }
      });
    });
  }

  // ── Detail Modal ──
  function openDetailModal(id) {
    const r = dataset.find(x => x.id === id);
    if (!r) return;
    document.getElementById('modal-title').textContent = r.name;
    document.getElementById('modal-body').innerHTML = `
      <div class="modal-row"><span class="modal-row-label">Student ID</span><span class="modal-row-value">${r.sid}</span></div>
      <div class="modal-row"><span class="modal-row-label">Degree</span><span class="modal-row-value">${r.degree}</span></div>
      <div class="modal-row"><span class="modal-row-label">Graduation Year</span><span class="modal-row-value">Class of ${r.year}</span></div>
      <div class="modal-row"><span class="modal-row-label">Status</span><span class="modal-row-value">${r.status}</span></div>
      ${r.hash ? `<div class="modal-row"><span class="modal-row-label">Certificate Hash</span><span class="modal-row-value" style="font-family:monospace;font-size:12px;">${r.hash}</span></div>` : ''}
      ${r.note ? `<div class="modal-row"><span class="modal-row-label">Notes</span><span class="modal-row-value" style="font-style:italic;max-width:240px;">${r.note}</span></div>` : ''}`;
    document.getElementById('modal-overlay').classList.add('show');
  }

  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.remove('show');
  });
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay'))
      document.getElementById('modal-overlay').classList.remove('show');
  });

  // ── Advanced Filter ──
  document.getElementById('filter-btn').addEventListener('click', () => {
    document.getElementById('adv-overlay').classList.add('show');
  });
  document.getElementById('adv-close').addEventListener('click', () => {
    document.getElementById('adv-overlay').classList.remove('show');
  });
  document.getElementById('adv-close-btn').addEventListener('click', () => {
    document.getElementById('adv-overlay').classList.remove('show');
  });
  document.getElementById('adv-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('adv-overlay'))
      document.getElementById('adv-overlay').classList.remove('show');
  });

  // ── Export CSV ──
  document.getElementById('export-btn').addEventListener('click', () => {
    const rows = [['Name','Student ID','Degree','Year','Status','Hash/Note']];
    filtered.forEach(r => rows.push([r.name, r.sid, r.degree, r.year, r.status, r.hash || r.note]));
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'all_requests.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully.');
  });

  // ── Search / Filters ──
  ['global-search','year-filter','status-filter'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => { currentPage = 1; renderTable(); });
  });

  document.getElementById('top-search').addEventListener('input', e => {
    document.getElementById('global-search').value = e.target.value;
    currentPage = 1;
    renderTable();
  });

  // ── Issue Certificate ──
  document.getElementById('issue-btn').addEventListener('click', () => {
    showToast('Certificate issuance workflow launched.');
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

  // ── Nav ──
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── Sign Out ──
  document.getElementById('sign-out').addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Sign out?')) showToast('Signed out successfully.');
  });

  // ── Toast ──
  function showToast(msg, duration = 2800) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  }

  // ── Init ──
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
