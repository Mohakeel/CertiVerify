// ─── DATA ───────────────────────────────────────────────────────────
const allCerts = [
  { initials: 'JA', color: '#dbeafe', textColor: '#1e40af', name: 'James Anderson', hash: '0x71c...3e21', degree: 'MBA Global Finance', classOf: 'Class of 2023', status: 'verified' },
  { initials: 'SK', color: '#ede9fe', textColor: '#5b21b6', name: 'Sarah Kurosawa',  hash: '0x92b...ff1a', degree: 'B.Eng. Robotics',    classOf: 'Class of 2024', status: 'pending'  },
  { initials: 'LW', color: '#d1fae5', textColor: '#065f46', name: 'Liam Walker',      hash: '0x44d...88c2', degree: 'M.A. Modern Literature', classOf: 'Class of 2022', status: 'verified' },
  { initials: 'AM', color: '#fce7f3', textColor: '#9d174d', name: 'Aisha Mwangi',    hash: '0x31e...a0f4', degree: 'B.Sc. Data Science',  classOf: 'Class of 2023', status: 'verified' },
  { initials: 'CR', color: '#fef3c7', textColor: '#92400e', name: 'Carlos Rivera',   hash: '0x88a...c2e1', degree: 'Ph.D. Bioinformatics', classOf: 'Class of 2021', status: 'pending'  },
  { initials: 'YT', color: '#e0f2fe', textColor: '#0369a1', name: 'Yuki Tanaka',     hash: '0x5d9...b7a3', degree: 'B.Arch. Urban Design', classOf: 'Class of 2024', status: 'verified' },
];

const PAGE_SIZE = 3;
let currentPage = 1;
let filteredCerts = [...allCerts];

// ─── RENDER TABLE ────────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('tableBody');
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = filteredCerts.slice(start, start + PAGE_SIZE);

  tbody.innerHTML = slice.map(c => `
    <tr>
      <td>
        <div class="student-cell">
          <div class="stu-avatar" style="background:${c.color};color:${c.textColor}">${c.initials}</div>
          <div>
            <div class="stu-name">${c.name}</div>
            <div class="stu-hash">HASH: ${c.hash}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="deg-name">${c.degree}</div>
        <div class="deg-class">${c.classOf}</div>
      </td>
      <td><span class="badge ${c.status}">${c.status === 'verified' ? 'Verified' : 'Pending'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn" title="View" onclick="showToast('Viewing ${c.name}')"><i class="fa-regular fa-eye"></i></button>
          <button class="action-btn" title="Edit" onclick="showToast('Editing ${c.name}')"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="action-btn del" title="Delete" onclick="deleteCert('${c.hash}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  document.getElementById('showingLabel').textContent =
    `Showing ${Math.min(slice.length, PAGE_SIZE)} of ${filteredCerts.length.toLocaleString()} certificates`;

  updatePagination();
}

// ─── PAGINATION ──────────────────────────────────────────────────────
function updatePagination() {
  const totalPages = Math.max(1, Math.ceil(filteredCerts.length / PAGE_SIZE));
  document.querySelectorAll('.pg-btn[data-page]').forEach(btn => {
    const p = parseInt(btn.dataset.page);
    btn.classList.toggle('active', p === currentPage);
    btn.style.display = p <= totalPages ? '' : 'none';
  });
}

document.querySelectorAll('.pg-btn[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    currentPage = parseInt(btn.dataset.page);
    renderTable();
  });
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; renderTable(); }
});
document.getElementById('nextBtn').addEventListener('click', () => {
  const total = Math.ceil(filteredCerts.length / PAGE_SIZE);
  if (currentPage < total) { currentPage++; renderTable(); }
});

// ─── SEARCH ──────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  filteredCerts = allCerts.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.hash.toLowerCase().includes(q) ||
    c.degree.toLowerCase().includes(q)
  );
  currentPage = 1;
  renderTable();
});

// ─── DELETE ──────────────────────────────────────────────────────────
function deleteCert(hash) {
  const idx = filteredCerts.findIndex(c => c.hash === hash);
  if (idx === -1) return;
  filteredCerts.splice(idx, 1);
  const ai = allCerts.findIndex(c => c.hash === hash);
  if (ai !== -1) allCerts.splice(ai, 1);
  const total = Math.ceil(filteredCerts.length / PAGE_SIZE);
  if (currentPage > total) currentPage = Math.max(1, total);
  renderTable();
  showToast('Certificate removed');
}

// ─── FILE UPLOAD ─────────────────────────────────────────────────────
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileNameEl = document.getElementById('fileName');

browseBtn.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) {
    fileNameEl.textContent = '📎 ' + fileInput.files[0].name;
  }
});

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) fileNameEl.textContent = '📎 ' + file.name;
});

// ─── MINT FORM ───────────────────────────────────────────────────────
document.getElementById('mintBtn').addEventListener('click', () => {
  const name = document.getElementById('studentName').value.trim();
  const deg  = document.getElementById('degreeProgram').value.trim();
  const year = document.getElementById('gradYear').value.trim();

  if (!name || !deg || !year) {
    showToast('⚠️ Please fill all fields');
    return;
  }

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = [
    { bg: '#dbeafe', text: '#1e40af' }, { bg: '#ede9fe', text: '#5b21b6' },
    { bg: '#d1fae5', text: '#065f46' }, { bg: '#fce7f3', text: '#9d174d' },
    { bg: '#fef3c7', text: '#92400e' }, { bg: '#e0f2fe', text: '#0369a1' },
  ];
  const c = colors[Math.floor(Math.random() * colors.length)];
  const hash = '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6);

  const newCert = { initials, color: c.bg, textColor: c.text, name, hash, degree: deg, classOf: `Class of ${year}`, status: 'pending' };
  allCerts.unshift(newCert);
  filteredCerts = [...allCerts];
  currentPage = 1;
  renderTable();

  document.getElementById('studentName').value = '';
  document.getElementById('degreeProgram').value = '';
  document.getElementById('gradYear').value = '';
  fileNameEl.textContent = '';

  showToast(`✅ Certificate minted for ${name}`);
});

// ─── FAB ─────────────────────────────────────────────────────────────
document.getElementById('fabBtn').addEventListener('click', () => {
  document.getElementById('studentName').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── EXPORT CSV ──────────────────────────────────────────────────────
document.getElementById('exportBtn').addEventListener('click', () => {
  const rows = [['Name', 'Hash', 'Degree', 'Class', 'Status'],
    ...filteredCerts.map(c => [c.name, c.hash, c.degree, c.classOf, c.status])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'certificates.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV exported');
});

// ─── TOAST ───────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── INIT ─────────────────────────────────────────────────────────────
renderTable();

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
