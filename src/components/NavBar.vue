<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <!-- Brand -->
      <div class="navbar-brand">
        <div class="brand-logo">
          <img src="/favicon.ico" alt="logo" class="brand-icon" width="48" height="33" style="border-radius: 11px">
        </div>
        <span class="brand-name">TravelHub</span>
        <span class="brand-beta">BETA</span>
      </div>

      <!-- Links desktop -->
      <div class="navbar-links">
        <a href="#search" class="nav-link" :class="{ active: activeSection === 'search' }">Buscar</a>
        <a href="#results" class="nav-link" :class="{ active: activeSection === 'results' }">Resultados</a>
        <a href="#search" class="nav-link" @click.prevent="$emit('open-kit')">Mi Kit</a>

        <div class="lang-selector" @click.stop="desktopLangOpen = !desktopLangOpen" tabindex="0"
          @blur="desktopLangOpen = false">
          <div class="lang-select">
            {{ currentLang.toUpperCase() }}
          </div>
          <Transition name="dropdown">
            <div class="lang-dropdown glass-strong" v-if="desktopLangOpen">
              <div class="lang-option" @mousedown.prevent="setLang('es')">ES</div>
              <div class="lang-option" @mousedown.prevent="setLang('en')">EN</div>
              <div class="lang-option" @mousedown.prevent="setLang('fr')">FR</div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Actions (desktop only) -->
      <div class="navbar-actions">
        <!-- Favoritos -->
        <button v-if="favCount > 0" class="nav-icon-btn" title="Favoritos" @click="$emit('open-favs')"
          id="nav-favs-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.85">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span class="nav-icon-count">{{ favCount }}</span>
        </button>

        <!-- Comparar -->
        <button v-if="compareCount > 0" class="nav-icon-btn compare-active" title="Comparar seleccionados"
          @click="$emit('open-compare')" id="nav-compare-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="3" y="3" width="8" height="18" rx="1" />
            <rect x="13" y="3" width="8" height="18" rx="1" />
          </svg>
          <span class="nav-icon-count">{{ compareCount }}</span>
        </button>

        <!-- Auth: Not logged in (desktop) -->
        <button v-if="!user" class="nav-login-btn nav-auth-desktop" @click="$emit('open-auth')" id="nav-login-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          Entrar
        </button>

        <!-- Auth: Logged in user avatar (desktop) -->
        <div v-else class="user-menu nav-auth-desktop" @click.stop="userMenuOpen = !userMenuOpen"
          tabindex="0" @blur="userMenuOpen = false" id="nav-user-menu">
          <div class="user-avatar">
            <span class="user-initial">{{ userInitial }}</span>
          </div>
          <Transition name="dropdown">
            <div class="user-dropdown glass-strong" v-if="userMenuOpen">
              <div class="user-dropdown-header">
                <div class="user-avatar-lg">{{ userInitial }}</div>
                <div class="user-dropdown-info">
                  <div class="user-dropdown-name">{{ userName }}</div>
                  <div class="user-dropdown-email">{{ user.email }}</div>
                </div>
              </div>
              <div class="divider" style="margin: 0 10px;"></div>
              <button class="user-dropdown-item" @mousedown.prevent="handleSignOut" id="nav-signout-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Mobile menu btn -->
      <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile nav -->
    <Transition name="mobile-nav">
      <div v-if="mobileOpen" class="mobile-nav glass-strong">
        <a href="#search" class="mobile-link" style="border-top-left-radius: 8px; border-top-right-radius: 8px"
          @click="mobileOpen = false">✈ &nbsp; Buscar</a>
        <a href="#results" class="mobile-link" @click="mobileOpen = false">✔ &nbsp; Resultados</a>
        <button class="mobile-link" @click="$emit('open-kit'); mobileOpen = false"><span class="star-align">★</span>
          &nbsp; Mi Kit ({{ kitCount }})</button>

        <!-- Auth en menú móvil -->
        <button v-if="!user" class="mobile-link mobile-link-auth"
          @click="$emit('open-auth'); mobileOpen = false" id="mobile-login-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          &nbsp; Entrar
        </button>
        <button v-else class="mobile-link mobile-link-auth" @mousedown.prevent="handleSignOut" id="mobile-signout-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          &nbsp; Cerrar sesión ({{ userName }})
        </button>

        <div class="mobile-lang-wrap" @click.stop="mobileLangOpen = !mobileLangOpen" tabindex="0"
          @blur="mobileLangOpen = false">
          <div class="lang-select mobile-lang">
            {{ currentLangName }}
          </div>
          <Transition name="dropdown">
            <div class="lang-dropdown glass-strong mobile-dropdown" v-if="mobileLangOpen">
              <div class="lang-option" @mousedown.prevent="setLang('es')">Español</div>
              <div class="lang-option" @mousedown.prevent="setLang('en')">English</div>
              <div class="lang-option" @mousedown.prevent="setLang('fr')">Français</div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuth } from '../composables/useAuth.js';

defineProps({
  kitCount: { type: Number, default: 0 },
  favCount: { type: Number, default: 0 },
  compareCount: { type: Number, default: 0 },
});
defineEmits(['open-kit', 'open-favs', 'open-compare', 'open-auth']);

const { user, signOut } = useAuth();
const userMenuOpen = ref(false);

const userInitial = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email || '?';
  return name.charAt(0).toUpperCase();
});

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'Usuario';
});

async function handleSignOut() {
  userMenuOpen.value = false;
  await signOut();
}

const isScrolled = ref(false);
const mobileOpen = ref(false);
const activeSection = ref('search');
const currentLang = ref('es');
const desktopLangOpen = ref(false);
const mobileLangOpen = ref(false);

const currentLangName = computed(() => {
  if (currentLang.value === 'es') return 'Español';
  if (currentLang.value === 'en') return 'English';
  if (currentLang.value === 'fr') return 'Français';
  return 'Español';
});

function setLang(lang) {
  currentLang.value = lang;
  desktopLangOpen.value = false;
  mobileLangOpen.value = false;
}

function onScroll() {
  isScrolled.value = window.scrollY > 60;

  const resultsEl = document.getElementById('results');
  if (resultsEl && window.scrollY >= (resultsEl.offsetTop - 300)) {
    activeSection.value = 'results';
  } else {
    activeSection.value = 'search';
  }
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 2rem;
  height: 68px;
  transition: background var(--dur-base) var(--ease-smooth),
    border-color var(--dur-base) var(--ease-smooth),
    box-shadow var(--dur-base) var(--ease-smooth);
  /* Starts transparent */
  background: transparent;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(6, 6, 6, 0.82);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-bottom-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.navbar-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  position: relative;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-logo {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-sm);
  transition: all var(--dur-base) var(--ease-out);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
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
  align-self: center;
}

/* Nav links */
.navbar-links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 6px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-link {
  color: var(--gray-400);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  transition: all var(--dur-fast) var(--ease-out);
  letter-spacing: 0.02em;
}

.nav-link:hover,
.nav-link.active {
  color: var(--pure-white);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.13);
}

.nav-icon-btn.compare-active {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.nav-icon-count {
  position: absolute;
  top: -3px;
  right: -3px;
  background: var(--pure-white);
  color: var(--pure-black);
  font-size: 0.65rem;
  font-weight: 800;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Login button — mismo estilo glass que el resto del navbar */
.nav-login-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 24px 13px 24px;
  /*padding: 8px 18px;*/
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pure-white);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-login-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

/* User avatar — glass B&W */
.user-menu {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--dur-fast) ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.user-menu:hover .user-avatar {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
}

.user-initial {
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: rgba(12, 12, 16, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  z-index: 200;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 12px;
}

.user-avatar-lg {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.user-dropdown-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.user-dropdown-email {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
  margin-top: 2px;
}



.user-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.83rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) ease;
  text-align: left;
}

.user-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--pure-white);
}

/* Mobile */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--pure-white);
  border-radius: 2px;
  transition: all var(--dur-fast) ease;
}

.mobile-nav {
  position: absolute;
  top: 68px;
  /*left: 0;*/
  right: 0;
  /*padding: 12px 20px 20px;*/
  padding: 5px 5px 5px 5px;
  display: flex;
  flex-direction: column;
  /*gap: 4px;*/
  gap: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  width: 30vh;
  height: 40vh;
  border-radius: 16px;
}

.mobile-link {
  display: block;
  color: var(--pure-white);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 22px 16px;
  border-bottom: solid #fff 2px;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background var(--dur-fast) ease;
  border-top: none;
  border-left: none;
}

.mobile-link:hover {
  background: rgba(255, 255, 255, 0.07);
}

/* Transitions */
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: all var(--dur-base) var(--ease-out);
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.lang-selector {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 10px;
}

.lang-select {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--pure-white);
  padding: 6px 28px 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all var(--dur-fast) ease;
  user-select: none;
}

.lang-selector:focus,
.mobile-lang-wrap:focus {
  outline: none;
}

.lang-dropdown {
  position: absolute;
  top: 130%;
  right: 0;
  width: 100%;
  background: rgba(20, 20, 25, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
}

.mobile-dropdown {
  top: auto;
  bottom: 120%;
  width: 100%;
}

.lang-option {
  padding: 10px 0;
  color: var(--pure-white);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) ease;
  text-align: center;
}

.lang-option:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--pure-white);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s var(--ease-out);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-dropdown.dropdown-enter-from,
.mobile-dropdown.dropdown-leave-to {
  transform: translateY(8px);
}

.lang-selector::after,
.mobile-lang-wrap::after {
  content: "▼";
  font-size: 0.55rem;
  color: var(--pure-white);
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.7;
}

.mobile-lang-wrap {
  position: relative;
  margin-top: auto;
  margin-bottom: 10px;
}

.mobile-lang {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: var(--radius-md);
  border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 700px) {
  .navbar-links {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .navbar {
    padding: 0 1rem;
  }

  /* Oculta el botón Entrar/avatar de la barra en móvil */
  .nav-auth-desktop {
    display: none !important;
  }
}

/* Auth en menú móvil */
.mobile-link-auth {
  display: flex;
  align-items: center;
}
</style>
