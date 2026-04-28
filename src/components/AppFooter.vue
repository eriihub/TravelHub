<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/favicon.ico" alt="logo" class="brand-icon" width="45" height="38" style="border-radius: 9px">
          <span class="brand-name">TravelHub</span>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">Acerca de nosotros</a>
          <a href="#" class="footer-link">Destinos</a>
          <a href="#" class="footer-link">Contacto</a>
          <a href="#" class="footer-link">Privacidad</a>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <p class="copyright">© {{ new Date().getFullYear() }} TravelHub. Todos los derechos reservados.</p>
        <div class="social-icons">
          <a href="#" aria-label="Twitter/X" class="social-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" class="social-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" class="social-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  position: relative;
  z-index: 10;
  margin-top: 4rem;
  padding: 4rem 2rem 2rem;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.03) 0%, #ffffff33 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-inner {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  opacity: 0.9;
  filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.85));
}

.brand-name {
  font-family: var(--font-display, 'Inter', sans-serif);
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--pure-white, #ffffff);
  letter-spacing: -0.02em;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--gray-400, #9ca3af);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--pure-white, #ffffff);
}

.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 50%, rgba(255, 255, 255, 0) 100%);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.copyright {
  color: var(--gray-400, #6b7280);
  font-size: 0.85rem;
}

.social-icons {
  display: flex;
  gap: 1.5rem;
}

.social-icon {
  color: var(--gray-400, #9ca3af);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.social-icon:hover {
  color: var(--pure-white, #ffffff);
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-links {
    flex-direction: column;
    gap: 1.2rem;
  }

  .footer-bottom {
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
  }
}
</style>
