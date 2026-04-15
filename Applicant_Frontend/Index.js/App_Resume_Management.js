document.addEventListener('DOMContentLoaded', () => {

  // ── Nav switching
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', e => {
      navItems.forEach(n => {
        n.classList.remove('active');
        const ind = n.querySelector('.nav-indicator');
        if (ind) ind.remove();
      });
      item.classList.add('active');
    });
  });

  // ── Zoom controls
  let zoomLevel = 1;
  const pdfMock = document.getElementById('pdfMock');
  const MIN_ZOOM = 0.6;
  const MAX_ZOOM = 1.4;
  const STEP = 0.1;

  document.getElementById('zoomIn')?.addEventListener('click', () => {
    if (zoomLevel < MAX_ZOOM) {
      zoomLevel = Math.min(MAX_ZOOM, +(zoomLevel + STEP).toFixed(1));
      applyZoom();
    }
  });

  document.getElementById('zoomOut')?.addEventListener('click', () => {
    if (zoomLevel > MIN_ZOOM) {
      zoomLevel = Math.max(MIN_ZOOM, +(zoomLevel - STEP).toFixed(1));
      applyZoom();
    }
  });

  function applyZoom() {
    if (pdfMock) {
      pdfMock.style.transform = `scale(${zoomLevel})`;
      pdfMock.style.transformOrigin = 'top center';
    }
    // Update zoom button states
    document.getElementById('zoomIn').style.opacity  = zoomLevel >= MAX_ZOOM ? '0.4' : '1';
    document.getElementById('zoomOut').style.opacity = zoomLevel <= MIN_ZOOM ? '0.4' : '1';
  }

  // ── Upload Resume button → triggers hidden file input
  const uploadBtn  = document.getElementById('uploadBtn');
  const fileInput  = document.getElementById('fileInput');
  const fileNameEl = document.getElementById('fileName');

  uploadBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Update filename display
    if (fileNameEl) fileNameEl.textContent = file.name;

    // Brief upload feedback on button
    uploadBtn.textContent = 'Uploading...';
    uploadBtn.disabled = true;
    setTimeout(() => {
      uploadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Upload Resume`;
      uploadBtn.disabled = false;

      // Flash the preview card
      const card = document.getElementById('previewCard');
      if (card) {
        card.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.2)';
        setTimeout(() => { card.style.boxShadow = ''; }, 1000);
      }
    }, 1400);
  });

  // ── View Full Document
  document.getElementById('viewBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('viewBtn');
    btn.style.background = '#eff3ff';
    btn.style.color = '#1e40af';
    setTimeout(() => {
      btn.style.background = '';
      btn.style.color = '';
    }, 800);
    // In a real app: window.open(documentUrl, '_blank');
  });

  // ── Download PDF
  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('downloadBtn');
    btn.textContent = 'Downloading...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download PDF
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>`;
      btn.disabled = false;
    }, 1200);
  });

  // ── Update Existing File
  document.getElementById('updateBtn')?.addEventListener('click', () => {
    fileInput?.click();
  });

  // ── Delete Resume → open modal
  const modalOverlay = document.getElementById('modalOverlay');

  document.getElementById('deleteBtn')?.addEventListener('click', () => {
    modalOverlay?.classList.add('show');
  });

  document.getElementById('modalCancel')?.addEventListener('click', () => {
    modalOverlay?.classList.remove('show');
  });

  document.getElementById('modalConfirm')?.addEventListener('click', () => {
    // Reset file name
    if (fileNameEl) fileNameEl.textContent = 'No file uploaded';
    modalOverlay?.classList.remove('show');

    // Brief red flash on preview card
    const card = document.getElementById('previewCard');
    if (card) {
      card.style.boxShadow = '0 0 0 3px rgba(226,75,74,0.2)';
      setTimeout(() => { card.style.boxShadow = ''; }, 1000);
    }
  });

  // Close modal on overlay click
  modalOverlay?.addEventListener('click', e => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
  });

  // ── Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modalOverlay?.classList.remove('show');
  });

  // ── Search focus ring
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.12)';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.style.boxShadow = '';
    });
  }

  // ── Version item hover
  document.querySelectorAll('.version-item').forEach(item => {
    item.style.transition = 'opacity 0.15s';
    item.addEventListener('mouseenter', () => item.style.opacity = '0.75');
    item.addEventListener('mouseleave', () => item.style.opacity = '1');
    item.style.cursor = 'pointer';
  });

  // ── Doc buttons hover lift
  document.querySelectorAll('.doc-btn, .mgmt-btn').forEach(btn => {
    btn.style.transition = 'background 0.15s, border-color 0.15s, transform 0.12s';
    btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.98)');
    btn.addEventListener('mouseup',   () => btn.style.transform = '');
    btn.addEventListener('mouseleave',() => btn.style.transform = '');
  });

});

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
