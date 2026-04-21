/**
 * Shared avatar loader — call initAvatar() on DOMContentLoaded on every page.
 * On profile pages, also call initAvatarUpload() to enable click-to-upload.
 */
import { getMe, uploadAvatar, API_BASE } from './api.js';

let currentUserId = null;

export async function initAvatar() {
  try {
    const me = await getMe();
    currentUserId = me.id;

    if (me.has_avatar) {
      setAvatarImage(`${API_BASE}/auth/avatar/${me.id}?t=${Date.now()}`);
    }
  } catch (_) {}
}

function setAvatarImage(url) {
  // Replace all .avatar elements with an img
  document.querySelectorAll('.avatar').forEach(el => {
    el.style.backgroundImage = `url(${url})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.color = 'transparent'; // hide initials text
    el.style.fontSize = '0';
  });
}

/**
 * Call this on the profile page to make the avatar clickable for upload.
 * Wraps the .avatar element with an upload trigger.
 */
export function initAvatarUpload(onSuccess) {
  const avatarEl = document.querySelector('.avatar, .profile-avatar, .avatar-large');
  if (!avatarEl) return;

  // Style as clickable
  avatarEl.style.cursor = 'pointer';
  avatarEl.title = 'Click to change profile picture';

  // Add camera overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:absolute;bottom:0;left:0;right:0;
    background:rgba(0,0,0,0.45);
    color:#fff;font-size:11px;font-weight:600;
    text-align:center;padding:4px 0;
    border-radius:0 0 50% 50%;
    pointer-events:none;
  `;
  overlay.textContent = '📷';
  avatarEl.style.position = 'relative';
  avatarEl.style.overflow = 'hidden';
  avatarEl.appendChild(overlay);

  // Hidden file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp';
  input.style.display = 'none';
  document.body.appendChild(input);

  avatarEl.addEventListener('click', () => input.click());

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    // Preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarImage(objectUrl);

    try {
      await uploadAvatar(file);
      if (onSuccess) onSuccess();
    } catch (e) {
      alert('Failed to upload: ' + e.message);
    }
  });
}
