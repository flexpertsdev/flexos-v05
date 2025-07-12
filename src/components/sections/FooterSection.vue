<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="copyright">© Flexperts 2025</span>
      </div>
      
      <div class="footer-center">
        <span>Built with 💚 by</span>
        <img 
          src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/flexpertsdev-pb6ym6/assets/hh0wb4fgqcrc/flexpertsLogoWhite.png" 
          alt="Flexperts" 
          class="footer-logo"
        >
      </div>
      
      <div class="footer-right">
        <a href="#legal" class="footer-link">Legal Stuff</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer doesn't need any reactive data or methods
</script>

<style scoped>
/* Footer */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  padding: 2rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left,
.footer-right {
  flex: 1;
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.footer-logo {
  height: 20px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.footer-logo:hover {
  opacity: 1;
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.footer-link {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: var(--text-secondary);
}

.footer-right {
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-left,
  .footer-right {
    text-align: center;
  }
  
  .footer-center {
    order: -1;
  }
}
</style>