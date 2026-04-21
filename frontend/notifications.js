/**
 * Shared notification bell component
 * Usage: import and call initNotificationBell() on DOMContentLoaded
 */
import { getNotifications, getUnreadCount, markAllRead, markOneRead } from './api.js';

export async function initNotificationBell() {
  // Find bell button by id or fallback to first .icon-btn in topbar
  const bellBtn = document.getElementById('notifBtn') 
    || document.querySelector('.topbar .icon-btn, .topbar-right .icon-btn');
  if (!bellBtn) return;

  // Set the id so subsequent lookups work
  bellBtn.id = 'notifBtn';

  // Create badge
  const badge = document.createElement('span');
  badge.id = 'notif-badge';
  badge.style.cssText = `
    position:absolute;top:2px;right:2px;
    background:#e04040;color:#fff;
    font-size:10px;font-weight:700;
    border-radius:50%;width:16px;height:16px;
    display:none;align-items:center;justify-content:center;
    line-height:1;
  `;
  bellBtn.style.position = 'relative';
  bellBtn.appendChild(badge);

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.id = 'notif-dropdown';
  dropdown.style.cssText = `
    position:absolute;top:calc(100% + 8px);right:0;
    width:320px;background:#fff;border:1px solid #e5e7eb;
    border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);
    z-index:1000;display:none;overflow:hidden;
  `;
  dropdown.innerHTML = `
    <div style="padding:14px 16px;border-bottom:1px solid #f0f2f7;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:14px;font-weight:700;color:#111827;">Notifications</span>
      <button id="markAllReadBtn" style="font-size:12px;color:#1e40af;background:none;border:none;cursor:pointer;font-weight:600;">Mark all read</button>
    </div>
    <div id="notif-list" style="max-height:340px;overflow-y:auto;"></div>
  `;

  // Attach dropdown to topbar-right or body
  const topbarRight = document.querySelector('.topbar-right') || document.body;
  topbarRight.style.position = 'relative';
  topbarRight.appendChild(dropdown);

  // Load count
  async function refreshCount() {
    try {
      const { count } = await getUnreadCount();
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    } catch (_) {}
  }

  // Load notifications
  async function loadNotifications() {
    const list = document.getElementById('notif-list');
    list.innerHTML = '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:13px;">Loading...</div>';
    try {
      const notifs = await getNotifications();
      if (notifs.length === 0) {
        list.innerHTML = '<div style="padding:24px;text-align:center;color:#9ca3af;font-size:13px;">No notifications yet</div>';
        return;
      }
      list.innerHTML = notifs.map(n => `
        <div class="notif-item" data-id="${n.id}" style="
          padding:12px 16px;border-bottom:1px solid #f0f2f7;cursor:pointer;
          background:${n.is_read ? '#fff' : '#f0f4ff'};
          transition:background 0.15s;
        ">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;
              background:${n.type === 'success' ? '#16a34a' : n.type === 'warning' ? '#d97706' : '#1e40af'};
              opacity:${n.is_read ? '0.3' : '1'};"></div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:${n.is_read ? '500' : '700'};color:#111827;margin-bottom:2px;">${n.title}</div>
              <div style="font-size:12px;color:#6b7280;line-height:1.4;">${n.message}</div>
              <div style="font-size:11px;color:#9ca3af;margin-top:4px;">${timeAgo(n.created_at)}</div>
            </div>
          </div>
        </div>
      `).join('');

      // Mark individual as read on click
      list.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', async () => {
          const id = parseInt(item.dataset.id);
          item.style.background = '#fff';
          item.querySelector('div > div') && (item.querySelector('[style*="border-radius:50%"]').style.opacity = '0.3');
          await markOneRead(id);
          refreshCount();
        });
      });
    } catch (e) {
      list.innerHTML = '<div style="padding:20px;text-align:center;color:#e04040;font-size:13px;">Failed to load</div>';
    }
  }

  // Toggle dropdown
  bellBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) await loadNotifications();
  });

  // Mark all read
  document.addEventListener('click', async (e) => {
    if (e.target.id === 'markAllReadBtn') {
      await markAllRead();
      badge.style.display = 'none';
      await loadNotifications();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!bellBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  // Initial count load
  await refreshCount();

  // Poll every 30 seconds
  setInterval(refreshCount, 30000);
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
