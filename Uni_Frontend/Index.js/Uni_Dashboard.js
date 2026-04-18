document.addEventListener('DOMContentLoaded', () => {

  // ── Sign Out ──
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out?')) {
        window.location.href = '../Other_Frontend/Login.html';
      }
    });
  }

  // ── Administrative Action cards → navigate ──
  document.querySelectorAll('.action-card[data-href]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const href = card.getAttribute('data-href');
      if (href) window.location.href = href;
    });
    // subtle press feedback
    card.addEventListener('mousedown', () => (card.style.transform = 'scale(0.97)'));
    card.addEventListener('mouseup',   () => (card.style.transform = ''));
    card.addEventListener('mouseleave',() => (card.style.transform = ''));
  });

  // ── Issue New Certificate button ──
  const issueBtn = document.querySelector('.btn-issue');
  if (issueBtn) {
    issueBtn.addEventListener('click', () => {
      window.location.href = 'Uni_Certificate_Management.html';
    });
  }

  // ── View All → All Requests History ──
  // (handled by href="Uni_Request_History.html" in HTML — no JS needed)

  // ── Progress bar animated fill on load ──
  document.querySelectorAll('.progress-fill').forEach(fill => {
    const target = fill.classList.contains('full') ? '100%' : '82%';
    fill.style.width = '0%';
    fill.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => (fill.style.width = target), 300);
  });

  // ── Notification bell badge ──
  const bell = document.querySelector('#notifBtn');
  if (bell) {
    bell.style.position = 'relative';
    const dot = document.createElement('span');
    dot.style.cssText = `
      position:absolute;top:4px;right:4px;
      width:8px;height:8px;
      background:#e04040;border-radius:50%;
      display:block;pointer-events:none;
    `;
    bell.appendChild(dot);
  }

  // ── Simulate live pending count ──
  const pendingNum = document.querySelector('.stat-card:first-child .stat-number');
  if (pendingNum) {
    let count = parseInt(pendingNum.textContent.replace(/,/g, ''));
    setInterval(() => {
      if (Math.random() > 0.7) {
        count++;
        pendingNum.textContent = count.toLocaleString();
        pendingNum.style.color = '#e05c00';
        setTimeout(() => (pendingNum.style.color = ''), 800);
      }
    }, 8000);
  }

  // ────────────────────────────────────────────
  // ── Bulk CSV / XLS Upload ──
  // ────────────────────────────────────────────

  const dropZone       = document.getElementById('uploadDropZone');
  const fileInput      = document.getElementById('uploadFileInput');
  const browseBtn      = document.getElementById('browseUploadBtn');
  const fileInfo       = document.getElementById('uploadFileInfo');
  const previewSection = document.getElementById('uploadPreview');
  const previewCount   = document.getElementById('previewCount');
  const previewHead    = document.getElementById('previewHead');
  const previewBody    = document.getElementById('previewBody');
  const clearBtn       = document.getElementById('clearUploadBtn');
  const importBtn      = document.getElementById('importBtn');
  const templateBtn    = document.getElementById('downloadTemplateBtn');

  // Modal
  const importModal      = document.getElementById('importModal');
  const importModalIcon  = document.getElementById('importModalIcon');
  const importModalTitle = document.getElementById('importModalTitle');
  const importModalDesc  = document.getElementById('importModalDesc');
  const importModalOk    = document.getElementById('importModalOk');

  // Toast
  const toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Modal helpers
  function showModal(icon, title, desc) {
    importModalIcon.textContent  = icon;
    importModalTitle.textContent = title;
    importModalDesc.textContent  = desc;
    importModal.classList.add('show');
  }
  importModalOk.addEventListener('click', () => importModal.classList.remove('show'));

  // Download template CSV
  templateBtn.addEventListener('click', () => {
    const headers = 'Student Name,Student ID,Degree Program,Graduation Year,Certificate Hash\n';
    const sample  = 'Jane Smith,STU-001,B.Sc. Computer Science,2024,\nJohn Doe,STU-002,M.A. Economics,2024,\n';
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'certificate_upload_template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Template downloaded');
  });

  // Browse button
  browseBtn.addEventListener('click', e => {
    e.stopPropagation();
    fileInput.click();
  });

  // Click on drop zone also opens file picker
  dropZone.addEventListener('click', () => fileInput.click());

  // Drag & drop
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  // Clear
  clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.textContent = '';
    previewSection.style.display = 'none';
    previewHead.innerHTML = '';
    previewBody.innerHTML = '';
  });

  // Import button
  importBtn.addEventListener('click', () => {
    const rowCount = previewBody.querySelectorAll('tr').length;
    if (!rowCount) return;
    showModal('✅', 'Import Successful',
      `${rowCount} certificate record${rowCount > 1 ? 's' : ''} have been queued for blockchain verification. You can track progress in Certificate Management.`
    );
  });

  // ── File handler ──
  function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      showModal('⚠️', 'Unsupported File', 'Please upload a .csv, .xls, or .xlsx file.');
      return;
    }
    fileInfo.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = e => parseCSV(e.target.result);
      reader.readAsText(file);
    } else {
      // XLS/XLSX: show a placeholder preview since SheetJS isn't loaded
      renderPlaceholderPreview(file.name);
    }
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      showModal('⚠️', 'Empty File', 'The CSV file has no data rows.');
      return;
    }
    const headers = lines[0].split(',').map(h => h.trim());
    const rows    = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
    renderPreview(headers, rows);
  }

  function renderPreview(headers, rows) {
    // Head
    previewHead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    // Body — show max 10 rows
    const display = rows.slice(0, 10);
    previewBody.innerHTML = display.map(row =>
      '<tr>' + headers.map((_, i) => `<td>${row[i] ?? ''}</td>`).join('') + '</tr>'
    ).join('');

    const total = rows.length;
    previewCount.textContent = `${total} record${total !== 1 ? 's' : ''} found${total > 10 ? ' (showing first 10)' : ''}`;
    previewSection.style.display = 'block';
  }

  function renderPlaceholderPreview(filename) {
    const headers = ['Student Name', 'Student ID', 'Degree Program', 'Graduation Year', 'Certificate Hash'];
    previewHead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    previewBody.innerHTML = `
      <tr><td colspan="${headers.length}" style="text-align:center;color:#888;padding:1.5rem;">
        Excel preview not available in browser — file <strong>${filename}</strong> is ready to import.
      </td></tr>`;
    previewCount.textContent = 'Excel file loaded';
    previewSection.style.display = 'block';
  }

});
