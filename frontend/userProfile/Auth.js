/* ── userProfile/Auth.js ── */

const API = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
 if (getUser()) window.location.href = '../index.html';
});

function switchAuth(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-'   + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
  clearErrors();
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
async function handleLogin() {
  clearErrors();
  const identifier = document.getElementById('l-identifier').value.trim();
  const password   = document.getElementById('l-password').value;
  let ok = true;

  if (!identifier) { showErr('l-id-err'); ok = false; }
  if (!password)   { showErr('l-pw-err'); ok = false; }
  if (!ok) return;

  const btn = document.querySelector('#panel-login .btn-submit');
  btn.textContent = '⏳ Signing in…';
  btn.disabled = true;

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ identifier, password }),
    });
    const data = await res.json();

    if (!data.success) {
      showAlert('login-alert', '❌ ' + data.message);
      return;
    }

    localStorage.setItem('agri_token',        data.token);
    localStorage.setItem('agri_current_user', JSON.stringify(data.user));
    toast('✅ Welcome back, ' + data.user.name + '!');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);

  } catch {
    showAlert('login-alert', '❌ Cannot connect to server. Make sure backend is running.');
  } finally {
    btn.textContent = '🔑 Sign In';
    btn.disabled = false;
  }
}

// ── REGISTER ───────────────────────────────────────────────────────────────
async function handleRegister() {
  clearErrors();
  const name     = document.getElementById('r-name').value.trim();
  const phone    = document.getElementById('r-phone').value.trim();
  const email    = document.getElementById('r-email').value.trim();
  const district = document.getElementById('r-district').value.trim();
  const farmtype = document.getElementById('r-farmtype').value;
  const password = document.getElementById('r-password').value;
  const confirm  = document.getElementById('r-confirm').value;
  const terms    = document.getElementById('r-terms').checked;
  let ok = true;

  if (!name)                                         { showErr('r-name-err');  ok = false; }
  if (!phone || phone.replace(/\D/g,'').length < 10) { showErr('r-phone-err'); ok = false; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('r-email-err'); ok = false; }
  if (password.length < 6)                           { showErr('r-pw-err');   ok = false; }
  if (password !== confirm)                          { showErr('r-conf-err'); ok = false; }
  if (!terms)                                        { showErr('r-terms-err'); ok = false; }
  if (!ok) return;

  const btn = document.querySelector('#panel-register .btn-submit');
  btn.textContent = '⏳ Creating account…';
  btn.disabled = true;

  try {
    const res  = await fetch(`${API}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, phone, email, password, district, farmtype }),
    });
    const data = await res.json();

    if (!data.success) {
      showAlert('reg-alert', '⚠ ' + data.message);
      return;
    }

    localStorage.setItem('agri_token',        data.token);
    localStorage.setItem('agri_current_user', JSON.stringify(data.user));
    showAlert('reg-ok', '🎉 Account created! Redirecting…');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);

  } catch {
    showAlert('reg-alert', '❌ Cannot connect to server. Make sure backend is running.');
  } finally {
    btn.textContent = '🌱 Create Account';
    btn.disabled = false;
  }
}

function forgotPassword() {
  clearErrors();
  const id = document.getElementById('l-identifier').value.trim();
  if (!id) { showAlert('login-alert', '⚠ Enter your phone or email first.'); return; }
  toast('🔑 Password reset coming soon.');
}