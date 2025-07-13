<template>
  <div class="account-page">
    <AppHeader
      title="Account Settings"
      subtitle="Manage your profile and preferences"
      :showBackButton="true"
      backPath="/dashboard"
    />

    <div class="account-container">
      <nav class="account-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>

      <div class="account-content">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <h2>Profile Information</h2>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="profile.username"
                type="text"
                placeholder="Choose a username"
                pattern="^[a-zA-Z0-9_-]+$"
              >
              <p class="form-hint">Letters, numbers, hyphens and underscores only</p>
            </div>

            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input
                id="fullName"
                v-model="profile.full_name"
                type="text"
                placeholder="Your full name"
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                :value="user?.email"
                type="email"
                disabled
              >
              <p class="form-hint">Email cannot be changed</p>
            </div>

            <div class="form-group">
              <label for="company">Company</label>
              <input
                id="company"
                v-model="profile.company"
                type="text"
                placeholder="Your company name"
              >
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                v-model="profile.bio"
                placeholder="Tell us about yourself"
                rows="4"
              ></textarea>
            </div>

            <div v-if="profileError" class="error-message">
              {{ profileError }}
            </div>

            <div v-if="profileSuccess" class="success-message">
              Profile updated successfully!
            </div>

            <div class="form-actions">
              <button type="submit" class="save-button" :disabled="profileLoading">
                <span v-if="profileLoading">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <h2>Security Settings</h2>
          <form @submit.prevent="updatePasswordHandler" class="security-form">
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                id="newPassword"
                v-model="security.newPassword"
                type="password"
                placeholder="Enter new password"
                minlength="8"
                required
              >
              <p class="form-hint">Must be at least 8 characters</p>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                v-model="security.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
              >
            </div>

            <div v-if="securityError" class="error-message">
              {{ securityError }}
            </div>

            <div v-if="securitySuccess" class="success-message">
              Password updated successfully!
            </div>

            <div class="form-actions">
              <button type="submit" class="save-button" :disabled="securityLoading">
                <span v-if="securityLoading">Updating...</span>
                <span v-else>Update Password</span>
              </button>
            </div>
          </form>

          <div class="danger-zone">
            <h3>Danger Zone</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button @click="showDeleteConfirm = true" class="danger-button">
              Delete Account
            </button>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="tab-content">
          <h2>Preferences</h2>
          <form @submit.prevent="updatePreferences" class="preferences-form">
            <div class="form-group">
              <label for="theme">Theme</label>
              <select id="theme" v-model="preferences.theme">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div class="form-group">
              <label for="language">Language</label>
              <select id="language" v-model="preferences.language">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="preferences.emailNotifications"
                >
                Email notifications
              </label>
              <p class="form-hint">Receive updates about your projects via email</p>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="preferences.marketingEmails"
                >
                Marketing emails
              </label>
              <p class="form-hint">Receive news and updates about FlexOS</p>
            </div>

            <div v-if="preferencesSuccess" class="success-message">
              Preferences updated successfully!
            </div>

            <div class="form-actions">
              <button type="submit" class="save-button" :disabled="preferencesLoading">
                <span v-if="preferencesLoading">Saving...</span>
                <span v-else>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal" @click.stop>
          <h2>Delete Account</h2>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p>All your projects, data, and settings will be permanently deleted.</p>
          
          <div class="modal-actions">
            <button @click="showDeleteConfirm = false" class="cancel-button">
              Cancel
            </button>
            <button @click="deleteAccount" class="danger-button">
              Yes, delete my account
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Require authentication
definePageMeta({
  middleware: 'auth'
})

const { user, getUserProfile, updateProfile: updateUserProfile, updatePassword, signOut } = useAuth()
const router = useRouter()

// Tab state
const activeTab = ref('profile')
const tabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'preferences', label: 'Preferences', icon: '⚙️' }
]

// Profile state
const profile = reactive({
  username: '',
  full_name: '',
  company: '',
  bio: ''
})
const profileLoading = ref(false)
const profileError = ref('')
const profileSuccess = ref(false)

// Security state
const security = reactive({
  newPassword: '',
  confirmPassword: ''
})
const securityLoading = ref(false)
const securityError = ref('')
const securitySuccess = ref(false)
const showDeleteConfirm = ref(false)

// Preferences state
const preferences = reactive({
  theme: 'system',
  language: 'en',
  emailNotifications: true,
  marketingEmails: false
})
const preferencesLoading = ref(false)
const preferencesSuccess = ref(false)

// Load user profile on mount
onMounted(async () => {
  const { data } = await getUserProfile()
  if (data) {
    profile.username = data.username || ''
    profile.full_name = data.full_name || ''
    profile.company = data.company || ''
    profile.bio = data.bio || ''
    
    // Load preferences from settings
    if (data.settings && typeof data.settings === 'object') {
      const settings = data.settings as any
      preferences.theme = settings.theme || 'system'
      preferences.language = settings.language || 'en'
      preferences.emailNotifications = settings.emailNotifications ?? true
      preferences.marketingEmails = settings.marketingEmails ?? false
    }
  }
})

// Update profile
const updateProfile = async () => {
  profileLoading.value = true
  profileError.value = ''
  profileSuccess.value = false
  
  const { error } = await updateUserProfile({
    username: profile.username,
    full_name: profile.full_name,
    company: profile.company,
    bio: profile.bio
  })
  
  if (error) {
    profileError.value = error
  } else {
    profileSuccess.value = true
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
  }
  
  profileLoading.value = false
}

// Update password
const updatePasswordHandler = async () => {
  securityLoading.value = true
  securityError.value = ''
  securitySuccess.value = false
  
  if (security.newPassword !== security.confirmPassword) {
    securityError.value = 'Passwords do not match'
    securityLoading.value = false
    return
  }
  
  if (security.newPassword.length < 8) {
    securityError.value = 'Password must be at least 8 characters'
    securityLoading.value = false
    return
  }
  
  const { error } = await updatePassword(security.newPassword)
  
  if (error) {
    securityError.value = error
  } else {
    securitySuccess.value = true
    security.newPassword = ''
    security.confirmPassword = ''
    setTimeout(() => {
      securitySuccess.value = false
    }, 3000)
  }
  
  securityLoading.value = false
}

// Update preferences
const updatePreferences = async () => {
  preferencesLoading.value = true
  preferencesSuccess.value = false
  
  const { error } = await updateUserProfile({
    settings: {
      theme: preferences.theme,
      language: preferences.language,
      emailNotifications: preferences.emailNotifications,
      marketingEmails: preferences.marketingEmails
    }
  })
  
  if (!error) {
    preferencesSuccess.value = true
    setTimeout(() => {
      preferencesSuccess.value = false
    }, 3000)
  }
  
  preferencesLoading.value = false
}

// Delete account
const deleteAccount = async () => {
  // In production, you would implement actual account deletion
  console.log('Account deletion requested')
  showDeleteConfirm.value = false
  
  // Sign out and redirect
  await signOut()
}
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-primary);
}

.account-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.account-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-tab {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.nav-tab:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-tab.active {
  background: var(--bg-secondary);
  color: var(--primary-500);
  border-left: 3px solid var(--primary-500);
}

.tab-icon {
  font-size: 1.125rem;
}

.account-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  min-height: 600px;
}

.tab-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.profile-form,
.security-form,
.preferences-form {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-group input,
.form-group select,
.form-group textarea {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.1);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: -0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
  cursor: pointer;
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

.form-actions {
  margin-top: 1rem;
}

.save-button {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-zone {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-primary);
}

.danger-zone h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--error);
  margin-bottom: 0.5rem;
}

.danger-zone p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.danger-button {
  background: var(--error);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-button:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.modal h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.modal p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-button {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: var(--bg-quaternary);
  border-color: var(--border-secondary);
}

/* Mobile styles */
@media (max-width: 768px) {
  .account-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .account-nav {
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
  }
  
  .nav-tab {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-tab.active {
    border-left: none;
    border-bottom-color: var(--primary-500);
  }
  
  .account-content {
    padding: 1.5rem;
  }
}
</style>