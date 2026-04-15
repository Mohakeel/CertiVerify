const verificationData = [
  {
    name: "Alex Rivera",
    role: "Senior Product Designer",
    avatar: "https://i.pravatar.cc/38?img=11",
    status: "pending",
  },
  {
    name: "Sarah Chen",
    role: "Fullstack Engineer",
    avatar: "https://i.pravatar.cc/38?img=5",
    status: "verified",
  },
  {
    name: "Marcus Thorne",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/38?img=15",
    status: "pending",
  },
];

function renderVerificationList() {
  const container = document.getElementById("verificationList");

  container.innerHTML = verificationData
    .map(
      (person, index) => `
    <div class="verif-item">
      <div class="verif-left">
        <img class="verif-avatar" src="${person.avatar}" alt="${person.name}" />
        <div>
          <div class="verif-name">${person.name}</div>
          <div class="verif-role">${person.role}</div>
        </div>
      </div>
      <div class="verif-right">
        ${
          person.status === "verified"
            ? `
          <span class="badge badge-verified">Verified</span>
          <div class="verified-check">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        `
            : `
          <span class="badge badge-pending">Pending</span>
          <button class="verify-btn" onclick="handleVerify(${index})">Verify</button>
        `
        }
      </div>
    </div>
  `
    )
    .join("");
}

function handleVerify(index) {
  verificationData[index].status = "verified";
  renderVerificationList();
}

// Animate the impact number on load
function animateCount(element, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(start);
  }, 16);
}

document.addEventListener("DOMContentLoaded", () => {
  renderVerificationList();

  const impactNum = document.querySelector(".impact-number");
  if (impactNum) {
    const numberSpan = document.createElement("span");
    numberSpan.textContent = "0";
    const textNode = impactNum.querySelector(".impact-text");
    impactNum.innerHTML = "";
    impactNum.appendChild(numberSpan);
    impactNum.appendChild(
      Object.assign(document.createElement("span"), {
        className: "impact-text",
        textContent: "Applications Received",
      })
    );
    animateCount(numberSpan, 342, 1200);
  }
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
