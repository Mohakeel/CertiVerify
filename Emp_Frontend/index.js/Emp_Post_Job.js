document.addEventListener('DOMContentLoaded', function () {

  // ── Toast helper ──
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 350);
    }, 3000);
  }

  // ── Form validation ──
  function getFormData() {
    return {
      title:       document.getElementById('jobTitle').value.trim(),
      description: document.getElementById('jobDescription').value.trim(),
      location:    document.getElementById('jobLocation').value.trim(),
      jobType:     document.getElementById('jobType').value,
      salaryMin:   document.getElementById('salaryMin').value.trim(),
      salaryMax:   document.getElementById('salaryMax').value.trim(),
    };
  }

  function validateForm(data) {
    if (!data.title) {
      showToast('Please enter a job title.');
      document.getElementById('jobTitle').focus();
      return false;
    }
    if (!data.description) {
      showToast('Please add a job description.');
      document.getElementById('jobDescription').focus();
      return false;
    }
    if (!data.location) {
      showToast('Please enter a location.');
      document.getElementById('jobLocation').focus();
      return false;
    }
    if (data.salaryMin && data.salaryMax) {
      if (Number(data.salaryMin) > Number(data.salaryMax)) {
        showToast('Salary minimum cannot exceed salary maximum.');
        document.getElementById('salaryMin').focus();
        return false;
      }
    }
    return true;
  }

  // ── Create Job button ──
  var createBtn = document.getElementById('createJobBtn');
  if (createBtn) {
    createBtn.addEventListener('click', function () {
      var data = getFormData();
      if (!validateForm(data)) return;

      var credential = document.getElementById('credentialToggle').checked;
      var visibility = document.getElementById('visibilityToggle').checked;
      var aiMatcher  = document.getElementById('aiToggle').checked;

      console.log('New Job Posted:', {
        ...data,
        credentialRequired: credential,
        publicVisibility:   visibility,
        aiMatcher:          aiMatcher,
      });

      showToast('Job posted successfully!');
    });
  }

  // ── Save as Draft button ──
  var draftBtn = document.getElementById('saveDraftBtn');
  if (draftBtn) {
    draftBtn.addEventListener('click', function () {
      var data = getFormData();
      if (!data.title) {
        showToast('Please enter a job title to save a draft.');
        document.getElementById('jobTitle').focus();
        return;
      }
      console.log('Draft saved:', data);
      showToast('Draft saved successfully!');
    });
  }

  // ── Feature card click toggles their checkbox ──
  var featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'INPUT') return;
      var checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });

  // ── Salary: auto-correct if min > max on blur ──
  var salaryMin = document.getElementById('salaryMin');
  var salaryMax = document.getElementById('salaryMax');

  function swapIfNeeded() {
    var min = Number(salaryMin.value);
    var max = Number(salaryMax.value);
    if (min && max && min > max) {
      var temp = salaryMin.value;
      salaryMin.value = salaryMax.value;
      salaryMax.value = temp;
      showToast('Salary range was swapped to keep min below max.');
    }
  }

  if (salaryMin) salaryMin.addEventListener('blur', swapIfNeeded);
  if (salaryMax) salaryMax.addEventListener('blur', swapIfNeeded);

  // ── Top nav active link switching ──
  var topLinks = document.querySelectorAll('.top-nav-link');
  topLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      topLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  // ── Sidebar nav active link switching ──
  var navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');
    });
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
