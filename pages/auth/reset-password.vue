<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <NuxtLink to="/" class="logo">
            <div class="logo-icon">F</div>
            <span>FlexOS</span>
          </NuxtLink>
          <h1>Reset password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form @submit.prevent="handleReset" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
              :disabled="loading || success"
            >
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            Check your email for a password reset link!
          </div>

          <button type="submit" class="submit-button" :disabled="loading || success">
            <span v-if="loading">Sending...</span>
            <span v-else-if="success">Email sent</span>
            <span v-else>Send reset link</span>
          </button>
        </form>

        <div class="auth-footer">
          Remember your password?
          <NuxtLink to="/auth/signin">Sign in</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use guest middleware
definePageMeta({
  middleware: 'guest'
})

const client = useSupabaseClient()
const toast = useToast()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleReset = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  const { error: resetError } = await client.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/auth/update-password`
  })
  
  loading.value = false
  
  if (resetError) {
    error.value = resetError.message
  } else {
    success.value = true
    toast.success('Password reset link sent!')
  }
}
</script>

<style scoped>
/* Same base styles as other auth pages */
.auth-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--bg-primary);
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--primary-500);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: white;
}

.auth-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.auth-header p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.1);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid rgba(248, 81, 73, 0.3);
  color: var(--error);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.success-message {
  background: rgba(46, 160, 67, 0.1);
  border: 1px solid rgba(46, 160, 67, 0.3);
  color: var(--success);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.submit-button {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.auth-footer a {
  color: var(--primary-500);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
}
</style>