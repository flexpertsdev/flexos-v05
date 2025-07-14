<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <NuxtLink to="/" class="logo">
            <div class="logo-icon">F</div>
            <span>FlexOS</span>
          </NuxtLink>
          <h1>{{ isResetting ? 'Set new password' : 'Reset password' }}</h1>
          <p>{{ isResetting ? 'Enter your new password below' : 'Enter your email to receive a reset link' }}</p>
        </div>

        <!-- Email form for requesting reset -->
        <form v-if="!isResetting && !success" @submit.prevent="handleResetRequest" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
              :disabled="loading"
            >
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="submit-button" :disabled="loading">
            <span v-if="loading">Sending reset link...</span>
            <span v-else>Send reset link</span>
          </button>
        </form>

        <!-- Success message for email sent -->
        <div v-if="!isResetting && success" class="success-state">
          <div class="success-icon">✓</div>
          <h2>Check your email</h2>
          <p>We've sent a password reset link to {{ email }}</p>
          <NuxtLink to="/auth/signin" class="back-link">
            Back to sign in
          </NuxtLink>
        </div>

        <!-- New password form -->
        <form v-if="isResetting" @submit.prevent="handlePasswordUpdate" class="auth-form">
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="Enter new password"
              required
              autocomplete="new-password"
              :disabled="loading"
              minlength="8"
            >
            <p class="input-hint">Must be at least 8 characters</p>
          </div>

          <div class="form-group">
            <label for="confirmNewPassword">Confirm New Password</label>
            <input
              id="confirmNewPassword"
              v-model="confirmNewPassword"
              type="password"
              placeholder="Confirm new password"
              required
              autocomplete="new-password"
              :disabled="loading"
            >
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="passwordSuccess" class="success-message">
            Password updated successfully! Redirecting to sign in...
          </div>

          <button type="submit" class="submit-button" :disabled="loading || passwordSuccess">
            <span v-if="loading">Updating password...</span>
            <span v-else>Update password</span>
          </button>
        </form>

        <div v-if="!success" class="auth-footer">
          Remember your password?
          <NuxtLink to="/auth/signin">Sign in</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Note: This page uses guest middleware to redirect if already authenticated

const { resetPassword, updatePassword } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const passwordSuccess = ref(false)
const isResetting = ref(false)

// Check if we have a recovery token in the URL
onMounted(() => {
  const hash = window.location.hash
  if (hash && hash.includes('type=recovery')) {
    isResetting.value = true
  }
})

const handleResetRequest = async () => {
  loading.value = true
  error.value = ''
  
  const { error: resetError } = await resetPassword(email.value)
  
  if (resetError) {
    error.value = resetError
    loading.value = false
  } else {
    success.value = true
    loading.value = false
  }
}

const handlePasswordUpdate = async () => {
  loading.value = true
  error.value = ''
  
  // Validate passwords match
  if (newPassword.value !== confirmNewPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }
  
  // Validate password length
  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    loading.value = false
    return
  }
  
  const { error: updateError } = await updatePassword(newPassword.value)
  
  if (updateError) {
    error.value = updateError
    loading.value = false
  } else {
    passwordSuccess.value = true
    loading.value = false
    
    // Redirect after success
    setTimeout(() => {
      router.push('/auth/signin')
    }, 2000)
  }
}
</script>

<style scoped>
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

.input-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: -0.25rem;
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

.success-state {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.success-state h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.success-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--primary-500);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link:hover {
  text-decoration: underline;
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