const tableData = [
  {
    name: "Alexander Vance",
    year: "Class of 2023",
    initials: "AV",
    avatarClass: "av-blue",
    credential: "M.S. Computer Science",
    institution: "Stanford University",
    status: "VERIFIED",
    statusClass: "badge-verified",
    hash: "0x71C9...2b3E",
    hashType: "hash",
  },
  {
    name: "Elena Rodriguez",
    year: "Class of 2024",
    initials: "ER",
    avatarClass: "av-green",
    credential: "MBA Finance",
    institution: "Wharton School",
    status: "PENDING",
    statusClass: "badge-pending",
    hash: "Verification in progress...",
    hashType: "pending",
  },
  {
    name: "Julian Blackwood",
    year: "Class of 2022",
    initials: "JB",
    avatarClass: "av-orange",
    credential: "B.A. Economics",
    institution: "London School of Economics",
    status: "REJECTED",
    statusClass: "badge-rejected",
    hash: "Record Mismatch",
    hashType: "error",
  },
];

const detailData = [
  {
    id: "VR-99281-STN",
    student: "Alexander Vance",
    studentSub: "Verified via National ID & Bio-auth",
    institution: "Stanford University",
    institutionSub: "School of Engineering",
    remarks:
      '"This credential was issued on May 22, 2023. The transaction is confirmed on the mainnet with 1,200+ block confirmations. All metadata signatures match the institution\'s master key."',
  },
  {
    id: "VR-88172-WRT",
    student: "Elena Rodriguez",
    studentSub: "Verification via National ID pending",
    institution: "Wharton School",
    institutionSub: "School of Business",
    remarks:
      '"Verification is currently in progress. The credential has been submitted to Wharton\'s registrar office. Awaiting official confirmation from the institution\'s verification node."',
  },
  {
    id: "VR-77034-LSE",
    student: "Julian Blackwood",
    studentSub: "Identity verified, credential mismatch",
    institution: "London School of Economics",
    institutionSub: "Department of Economics",
    remarks:
      '"A record mismatch was detected. The submitted transcript does not align with LSE\'s official records for the stated graduation year. Manual review has been escalated."',
  },
];

let currentPage = 1;
const totalPages = 3;

function getActionButton(row) {
  if (row.hashType === "error") {
    return `<button class="action-btn warn" title="Error">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </button>`;
  }
  return `<button class="action-btn" title="View">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  </button>`;
}

function getHashCell(row) {
  if (row.hashType === "hash") {
    return `<span class="hash-code">${row.hash}</span>`;
  } else if (row.hashType === "pending") {
    return `<span class="hash-pending">${row.hash}</span>`;
  } else {
    return `<span class="hash-error">${row.hash}</span>`;
  }
}

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = tableData
    .map(
      (row, index) => `
    <tr style="cursor:pointer;" onclick="showDetail(${index})">
      <td>
        <div class="student-cell">
          <div class="student-avatar ${row.avatarClass}">${row.initials}</div>
          <div>
            <div class="student-name">${row.name}</div>
            <div class="student-year">${row.year}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="cred-name">${row.credential}</div>
        <div class="cred-inst">${row.institution}</div>
      </td>
      <td><span class="status-badge ${row.statusClass}">${row.status}</span></td>
      <td>${getHashCell(row)}</td>
      <td>${getActionButton(row)}</td>
    </tr>
  `
    )
    .join("");
}

function showDetail(index) {
  const d = detailData[index];
  document.querySelector(".detail-id").textContent = "● ID: " + d.id;
  document.querySelectorAll(".detail-name")[0].textContent = d.student;
  document.querySelectorAll(".detail-sub")[0].textContent = d.studentSub;
  document.querySelectorAll(".detail-name")[1].textContent = d.institution;
  document.querySelectorAll(".detail-sub")[1].textContent = d.institutionSub;
  document.querySelector(".remarks-box").textContent = d.remarks;

  document.getElementById("detailSection").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function updatePageButtons() {
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.getElementById("page" + i);
    if (btn) {
      btn.classList.toggle("active", i === currentPage);
    }
  }
  document.querySelector(".page-info").textContent =
    `Showing ${(currentPage - 1) * 3 + 1}–${Math.min(currentPage * 3, 42)} of 42 requests`;
}

function changePage(delta) {
  const next = currentPage + delta;
  if (next >= 1 && next <= totalPages) {
    currentPage = next;
    updatePageButtons();
  }
}

function setPage(n) {
  currentPage = n;
  updatePageButtons();
}

renderTable();
updatePageButtons();

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
