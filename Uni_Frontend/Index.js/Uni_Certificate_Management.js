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

// ─── BULK CSV / XLS UPLOAD ───────────────────────────────────────────

(function () {
  const bulkDropZone    = document.getElementById('bulkDropZone');
  const bulkFileInput   = document.getElementById('bulkFileInput');
  const browseBulkBtn   = document.getElementById('browseBulkBtn');
  const bulkFileInfo    = document.getElementById('bulkFileInfo');
  const bulkPreview     = document.getElementById('bulkPreview');
  const bulkPreviewCount= document.getElementById('bulkPreviewCount');
  const bulkPreviewHead = document.getElementById('bulkPreviewHead');
  const bulkPreviewBody = document.getElementById('bulkPreviewBody');
  const bulkClearBtn    = document.getElementById('bulkClearBtn');
  const bulkImportBtn   = document.getElementById('bulkImportBtn');
  const templateBtn     = document.getElementById('downloadTemplateBtn');

  const bulkModal      = document.getElementById('bulkModal');
  const bulkModalIcon  = document.getElementById('bulkModalIcon');
  const bulkModalTitle = document.getElementById('bulkModalTitle');
  const bulkModalDesc  = document.getElementById('bulkModalDesc');
  const bulkModalOk    = document.getElementById('bulkModalOk');

  function showBulkModal(icon, title, desc) {
    bulkModalIcon.textContent  = icon;
    bulkModalTitle.textContent = title;
    bulkModalDesc.textContent  = desc;
    bulkModal.classList.add('show');
  }
  bulkModalOk.addEventListener('click', () => bulkModal.classList.remove('show'));

  // Download template
  templateBtn.addEventListener('click', () => {
    const csv = 'Student Name,Student ID,Degree Program,Graduation Year,Certificate Hash\n'
              + 'Jane Smith,STU-001,B.Sc. Computer Science,2024,\n'
              + 'John Doe,STU-002,M.A. Economics,2024,\n';
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: 'certificate_upload_template.csv'
    });
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('📥 Template downloaded');
  });

  // Browse
  browseBulkBtn.addEventListener('click', e => { e.stopPropagation(); bulkFileInput.click(); });
  bulkDropZone.addEventListener('click', () => bulkFileInput.click());

  // Drag & drop
  bulkDropZone.addEventListener('dragover', e => { e.preventDefault(); bulkDropZone.classList.add('dragover'); });
  bulkDropZone.addEventListener('dragleave', () => bulkDropZone.classList.remove('dragover'));
  bulkDropZone.addEventListener('drop', e => {
    e.preventDefault();
    bulkDropZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleBulkFile(e.dataTransfer.files[0]);
  });

  bulkFileInput.addEventListener('change', () => {
    if (bulkFileInput.files[0]) handleBulkFile(bulkFileInput.files[0]);
  });

  // Clear
  bulkClearBtn.addEventListener('click', () => {
    bulkFileInput.value = '';
    bulkFileInfo.textContent = '';
    bulkPreview.style.display = 'none';
    bulkPreviewHead.innerHTML = '';
    bulkPreviewBody.innerHTML = '';
  });

  // Import
  bulkImportBtn.addEventListener('click', () => {
    const rows = bulkPreviewBody.querySelectorAll('tr').length;
    if (!rows) return;
    showBulkModal('✅', 'Import Successful',
      `${rows} certificate record${rows !== 1 ? 's' : ''} have been queued for blockchain minting. Track progress in the table above.`
    );
  });

  function handleBulkFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      showBulkModal('⚠️', 'Unsupported File', 'Please upload a .csv, .xls, or .xlsx file.');
      return;
    }
    bulkFileInfo.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = e => parseAndRender(e.target.result);
      reader.readAsText(file);
    } else {
      renderExcelPlaceholder(file.name);
    }
  }

  function parseAndRender(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      showBulkModal('⚠️', 'Empty File', 'The CSV file has no data rows.');
      return;
    }
    const headers = lines[0].split(',').map(h => h.trim());
    const rows    = lines.slice(1).map(l => l.split(',').map(c => c.trim()));

    bulkPreviewHead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    const display = rows.slice(0, 10);
    bulkPreviewBody.innerHTML = display.map(row =>
      '<tr>' + headers.map((_, i) => `<td>${row[i] ?? ''}</td>`).join('') + '</tr>'
    ).join('');

    const total = rows.length;
    bulkPreviewCount.textContent = `${total} record${total !== 1 ? 's' : ''} found${total > 10 ? ' (showing first 10)' : ''}`;
    bulkPreview.style.display = 'block';
  }

  function renderExcelPlaceholder(filename) {
    const headers = ['Student Name', 'Student ID', 'Degree Program', 'Graduation Year', 'Certificate Hash'];
    bulkPreviewHead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    bulkPreviewBody.innerHTML = `<tr><td colspan="${headers.length}" style="text-align:center;color:#888;padding:1.5rem;">
      Excel preview not available in browser — <strong>${filename}</strong> is ready to import.
    </td></tr>`;
    bulkPreviewCount.textContent = 'Excel file loaded';
    bulkPreview.style.display = 'block';
  }
})();
