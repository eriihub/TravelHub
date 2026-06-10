<template>
  <Teleport to="body">
    <Transition name="modal-bg">
      <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')" id="auth-modal-backdrop">
        <Transition name="modal-card">
          <div v-if="isOpen" class="auth-modal glass-strong" role="dialog" aria-modal="true">

            <!-- Close -->
            <button class="modal-close" @click="$emit('close')" id="auth-close-btn" aria-label="Cerrar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- Brand -->
            <div class="modal-brand">
              <div class="brand-logo">
                <img src="/favicon.ico" alt="logo" class="brand-icon" width="48" height="33" style="border-radius: 9px">
              </div>
              <span class="brand-name">TravelHub</span>
              <span class="brand-beta">BETA</span>
            </div>

            <!-- Tabs -->
            <div class="auth-tabs">
              <button
                class="auth-tab"
                :class="{ active: view === 'login' }"
                @click="switchView('login')"
                id="tab-login"
              >Iniciar sesión</button>
              <button
                class="auth-tab"
                :class="{ active: view === 'register' }"
                @click="switchView('register')"
                id="tab-register"
              >Crear cuenta</button>
            </div>

            <!-- ══ LOGIN ══ -->
            <form v-if="view === 'login'" @submit.prevent="handleLogin" class="auth-form" novalidate id="login-form">

              <div class="field-group">
                <label class="field-label" for="login-email">Correo electrónico</label>
                <div class="field-wrap" :class="{ 'field-error-border': errors.email }">
                  <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input id="login-email" v-model="loginForm.email" type="email" class="field-input"
                    placeholder="tu@email.com" autocomplete="email" :disabled="loading" />
                </div>
                <span v-if="errors.email" class="field-error-msg">{{ errors.email }}</span>
              </div>

              <div class="field-group">
                <label class="field-label" for="login-password">
                  Contraseña
                  <button type="button" class="forgot-link" @click="switchView('forgot')" id="forgot-pass-btn">¿La olvidaste?</button>
                </label>
                <div class="field-wrap" :class="{ 'field-error-border': errors.password }">
                  <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input id="login-password" v-model="loginForm.password"
                    :type="showPass ? 'text' : 'password'" class="field-input"
                    placeholder="••••••••" autocomplete="current-password" :disabled="loading" />
                  <button type="button" class="toggle-pass" @click="showPass = !showPass">
                    <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.password" class="field-error-msg">{{ errors.password }}</span>
              </div>

              <div v-if="authError" class="alert-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {{ authError }}
              </div>

              <button type="submit" class="btn btn-primary btn-auth-submit" :disabled="loading" id="login-submit-btn">
                <span v-if="!loading">Entrar</span>
                <span v-else class="spinner-wrap"><span class="spinner"></span> Entrando…</span>
              </button>

              <p class="auth-switch-text">
                ¿Sin cuenta aún?
                <button type="button" class="switch-link" @click="switchView('register')">Regístrate gratis</button>
              </p>
            </form>

            <!-- ══ REGISTER ══ -->
            <form v-else-if="view === 'register'" @submit.prevent="handleRegister" class="auth-form" novalidate id="register-form">

              <div class="field-group">
                <label class="field-label" for="reg-name">Nombre</label>
                <div class="field-wrap" :class="{ 'field-error-border': errors.name }">
                  <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input id="reg-name" v-model="registerForm.name" type="text" class="field-input"
                    placeholder="Ana García" autocomplete="given-name" :disabled="loading" />
                </div>
                <span v-if="errors.name" class="field-error-msg">{{ errors.name }}</span>
              </div>

              <div class="field-group">
                <label class="field-label" for="reg-email">Correo electrónico</label>
                <div class="field-wrap" :class="{ 'field-error-border': errors.email }">
                  <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input id="reg-email" v-model="registerForm.email" type="email" class="field-input"
                    placeholder="tu@email.com" autocomplete="email" :disabled="loading" />
                </div>
                <span v-if="errors.email" class="field-error-msg">{{ errors.email }}</span>
              </div>

              <div class="field-group">
                <label class="field-label" for="reg-password">Contraseña</label>
                <div class="field-wrap" :class="{ 'field-error-border': errors.password }">
                  <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input id="reg-password" v-model="registerForm.password"
                    :type="showPass ? 'text' : 'password'" class="field-input"
                    placeholder="Mín. 8 caracteres" autocomplete="new-password" :disabled="loading" />
                  <button type="button" class="toggle-pass" @click="showPass = !showPass">
                    <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
                <!-- Strength bar -->
                <div class="pass-strength" v-if="registerForm.password.length > 0">
                  <div class="pass-strength-bar">
                    <div class="pass-strength-fill" :style="{ width: passStrength.pct + '%', opacity: passStrength.opacity }"></div>
                  </div>
                  <span class="pass-strength-label">{{ passStrength.label }}</span>
                </div>
                <span v-if="errors.password" class="field-error-msg">{{ errors.password }}</span>
              </div>

              <div v-if="authError" class="alert-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {{ authError }}
              </div>

              <div v-if="successMsg" class="alert-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ successMsg }}
              </div>

              <button type="submit" class="btn btn-primary btn-auth-submit" :disabled="loading" id="register-submit-btn">
                <span v-if="!loading">Crear cuenta gratis</span>
                <span v-else class="spinner-wrap"><span class="spinner"></span> Registrando…</span>
              </button>

              <p class="auth-switch-text">
                ¿Ya tienes cuenta?
                <button type="button" class="switch-link" @click="switchView('login')">Inicia sesión</button>
              </p>

              <p class="auth-terms">
                Al registrarte aceptas nuestros <a href="#" class="terms-link">Términos</a>
                y la <a href="#" class="terms-link">Política de privacidad</a>.
              </p>
            </form>

            <!-- ══ FORGOT PASSWORD ══ -->
            <form v-else-if="view === 'forgot'" @submit.prevent="handleForgot" class="auth-form" novalidate id="forgot-form">
              <p class="forgot-intro">Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>

              <div class="field-group">
                <label class="field-label" for="forgot-email">Correo electrónico</label>
                <div class="field-wrap" :class="{ 'field-error-border': errors.email }">
                  <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input id="forgot-email" v-model="forgotEmail" type="email" class="field-input"
                    placeholder="tu@email.com" autocomplete="email" :disabled="loading" />
                </div>
                <span v-if="errors.email" class="field-error-msg">{{ errors.email }}</span>
              </div>

              <div v-if="authError" class="alert-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {{ authError }}
              </div>

              <div v-if="successMsg" class="alert-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ successMsg }}
              </div>

              <button type="submit" class="btn btn-primary btn-auth-submit" :disabled="loading" id="forgot-submit-btn">
                <span v-if="!loading">Enviar enlace</span>
                <span v-else class="spinner-wrap"><span class="spinner"></span> Enviando…</span>
              </button>

              <p class="auth-switch-text">
                <button type="button" class="switch-link" @click="switchView('login')">← Volver al inicio de sesión</button>
              </p>
            </form>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { supabase } from '../lib/supabase.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'auth-success']);

const view = ref('login');
const loading = ref(false);
const authError = ref('');
const successMsg = ref('');
const showPass = ref(false);
const errors = reactive({});

const loginForm = reactive({ email: '', password: '' });
const registerForm = reactive({ name: '', email: '', password: '' });
const forgotEmail = ref('');

function clearState() {
  authError.value = '';
  successMsg.value = '';
  Object.keys(errors).forEach(k => delete errors[k]);
}

function switchView(v) {
  clearState();
  showPass.value = false;
  view.value = v;
}

watch(() => props.isOpen, (v) => {
  if (v) {
    switchView('login');
    loginForm.email = '';
    loginForm.password = '';
    registerForm.name = '';
    registerForm.email = '';
    registerForm.password = '';
    forgotEmail.value = '';
  }
});

// Password strength — monochrome scale
const passStrength = computed(() => {
  const p = registerForm.password;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const map = [
    { pct: 25, opacity: 0.35, label: 'Débil' },
    { pct: 50, opacity: 0.55, label: 'Regular' },
    { pct: 75, opacity: 0.78, label: 'Buena' },
    { pct: 100, opacity: 1, label: 'Fuerte' },
  ];
  return map[score > 0 ? score - 1 : 0];
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLogin() {
  clearState();
  let ok = true;
  if (!validateEmail(loginForm.email)) { errors.email = 'Introduce un email válido.'; ok = false; }
  if (loginForm.password.length < 6) { errors.password = 'Mínimo 6 caracteres.'; ok = false; }
  return ok;
}

function validateRegister() {
  clearState();
  let ok = true;
  if (!registerForm.name.trim()) { errors.name = 'Tu nombre es obligatorio.'; ok = false; }
  if (!validateEmail(registerForm.email)) { errors.email = 'Introduce un email válido.'; ok = false; }
  if (registerForm.password.length < 8) { errors.password = 'Mínimo 8 caracteres.'; ok = false; }
  return ok;
}

async function handleLogin() {
  if (!validateLogin()) return;
  loading.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (error) throw error;
    emit('auth-success', data.user);
    emit('close');
  } catch (e) {
    authError.value = translateError(e.message);
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  if (!validateRegister()) return;
  loading.value = true;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: { data: { full_name: registerForm.name } },
    });
    if (error) throw error;
    if (data.user && !data.session) {
      successMsg.value = '¡Cuenta creada! Revisa tu correo para confirmar el email.';
    } else {
      emit('auth-success', data.user);
      emit('close');
    }
  } catch (e) {
    authError.value = translateError(e.message);
  } finally {
    loading.value = false;
  }
}

async function handleForgot() {
  clearState();
  if (!validateEmail(forgotEmail.value)) { errors.email = 'Introduce un email válido.'; return; }
  loading.value = true;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.value, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
    successMsg.value = '¡Enlace enviado! Revisa tu bandeja de entrada.';
  } catch (e) {
    authError.value = translateError(e.message);
  } finally {
    loading.value = false;
  }
}

function translateError(msg) {
  const map = {
    'Invalid login credentials': 'Email o contraseña incorrectos.',
    'Email not confirmed': 'Confirma tu email antes de iniciar sesión.',
    'User already registered': 'Este email ya está registrado.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'El email no es válido.',
  };
  return map[msg] || msg || 'Ha ocurrido un error. Inténtalo de nuevo.';
}
</script>

<style scoped>
/* ── Backdrop ──────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
}

/* ── Card — usa glass-strong del sistema ───────────────── */
.auth-modal {
  position: relative;
  width: 100%;
  max-width: 420px;
  border-radius: var(--radius-lg);
  padding: 36px 32px 28px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 32px 80px rgba(0, 0, 0, 0.85);
}

/* ── Close ─────────────────────────────────────────────── */
.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--gray-400);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--pure-white);
}

/* ── Brand — idéntica a NavBar ─────────────────────────── */
.modal-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 26px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-sm);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--pure-white);
}

.brand-beta {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--gray-400);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

/* ── Tabs ──────────────────────────────────────────────── */
.auth-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 3px;
  margin-bottom: 24px;
}

.auth-tab {
  flex: 1;
  padding: 9px;
  border-radius: 8px;
  font-size: 0.83rem;
  font-weight: 600;
  color: var(--gray-500);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  font-family: var(--font-body);
}

.auth-tab.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--pure-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* ── Form ──────────────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-400);
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 0.02em;
}

/* Field wrap — usa misma estética que inputs de la app */
.field-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-sm);
  padding: 0 13px;
  transition: all var(--dur-fast) var(--ease-out);
}

.field-wrap:focus-within {
  border-color: rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.11);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.07);
}

.field-wrap.field-error-border {
  border-color: rgba(255, 100, 100, 0.5);
}

.field-icon {
  color: var(--gray-500);
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--pure-white);
  font-size: 0.875rem;
  padding: 13px 0;
  font-family: var(--font-body);
}

.field-input::placeholder {
  color: var(--gray-600);
}

.field-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-pass {
  background: transparent;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  display: flex;
  transition: color var(--dur-fast) ease;
  padding: 0;
}

.toggle-pass:hover {
  color: var(--gray-300);
}

.field-error-msg {
  font-size: 0.73rem;
  color: rgba(255, 130, 130, 0.9);
}

.forgot-link {
  background: transparent;
  border: none;
  color: var(--gray-400);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: color var(--dur-fast) ease;
  padding: 0;
  font-family: var(--font-body);
}

.forgot-link:hover {
  color: var(--pure-white);
}

/* ── Password strength — monocromo ────────────────────── */
.pass-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 3px;
}

.pass-strength-bar {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.pass-strength-fill {
  height: 100%;
  background: var(--pure-white);
  border-radius: var(--radius-full);
  transition: all 0.4s var(--ease-out);
}

.pass-strength-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gray-400);
  min-width: 42px;
  text-align: right;
}

/* ── Alerts ────────────────────────────────────────────── */
.alert-error,
.alert-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.4;
}

.alert-error {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 100, 100, 0.3);
  color: rgba(255, 160, 160, 0.95);
}

.alert-success {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--gray-300);
}

/* ── Submit — btn-primary del sistema global ───────────── */
.btn-auth-submit {
  width: 100%;
  justify-content: center;
  padding: 13px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 2px;
}

.btn-auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.spinner-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: var(--pure-black);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Footer texts ──────────────────────────────────────── */
.auth-switch-text {
  text-align: center;
  font-size: 0.8rem;
  color: var(--gray-500);
}

.switch-link {
  background: transparent;
  border: none;
  color: var(--gray-300);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--dur-fast) ease;
  padding: 0;
  font-size: inherit;
  font-family: var(--font-body);
}

.switch-link:hover {
  color: var(--pure-white);
}

.auth-terms {
  text-align: center;
  font-size: 0.7rem;
  color: var(--gray-600);
  line-height: 1.5;
}

.terms-link {
  color: var(--gray-400);
  text-decoration: none;
  transition: color var(--dur-fast) ease;
}

.terms-link:hover {
  color: var(--pure-white);
}

.forgot-intro {
  font-size: 0.83rem;
  color: var(--gray-400);
  line-height: 1.55;
}

/* ── Transitions ───────────────────────────────────────── */
.modal-bg-enter-active,
.modal-bg-leave-active {
  transition: opacity var(--dur-base) var(--ease-smooth);
}
.modal-bg-enter-from,
.modal-bg-leave-to {
  opacity: 0;
}

.modal-card-enter-active {
  transition: all var(--dur-base) var(--ease-spring);
}
.modal-card-leave-active {
  transition: all 0.2s var(--ease-smooth);
}
.modal-card-enter-from {
  opacity: 0;
  transform: scale(0.93) translateY(20px);
}
.modal-card-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(10px);
}

/* ── Mobile ─────────────────────────────────────────────── */
@media (max-width: 500px) {
  .auth-modal {
    padding: 28px 18px 22px;
    border-radius: var(--radius-md);
    max-height: 92vh;
    overflow-y: auto;
  }
}
</style>
