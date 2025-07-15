<template>
  <div class="dashboard-page">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-container">
        <!-- Logo and Title -->
        <div class="header-left">
          <NuxtLink to="/" class="logo">
            <div class="logo-icon">F</div>
            <span class="logo-text">FlexOS</span>
          </NuxtLink>
          <div class="page-info">
            <h1 class="page-title">My Projects</h1>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="header-right">
          <!-- User Menu -->
          <div class="user-menu">
            <button @click="toggleUserMenu" class="user-button" ref="userButtonRef">
              <div class="user-avatar">
                {{ userInitial }}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <Transition name="dropdown">
              <div v-if="showUserMenu" class="dropdown-menu" ref="dropdownRef">
                <NuxtLink to="/account" class="dropdown-item" @click="showUserMenu = false">
                  <span class="dropdown-icon">👤</span>
                  <span>Account Settings</span>
                </NuxtLink>
                <NuxtLink to="/builder" class="dropdown-item" @click="showUserMenu = false">
                  <span class="dropdown-icon">🛠️</span>
                  <span>Builder Mode</span>
                </NuxtLink>
                <div class="dropdown-divider"></div>
                <button @click="handleSignOut" class="dropdown-item">
                  <span class="dropdown-icon">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <div class="dashboard-container">
      <!-- Search Section -->
      <div v-if="!loading" class="search-section">
        <div class="search-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading your projects...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="projects.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h2>No projects yet</h2>
        <p>Create your first project to get started with FlexOS</p>
        <button @click="startProjectCreation" class="cta-button">
          Create your first project
        </button>
      </div>

      <!-- Projects grid -->
      <div v-else class="projects-grid">
        <!-- New Project Card -->
        <div
          @click="startProjectCreation"
          class="project-card new-project-card"
        >
          <div class="new-project-content">
            <div class="new-project-icon">+</div>
            <h3 class="new-project-text">New Project</h3>
            <p class="new-project-hint">Start project discovery wizard</p>
          </div>
        </div>
        
        <!-- Existing Projects -->
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          @click="openProject(project)"
          class="project-card"
        >
          <div class="project-header">
            <div class="project-icon">{{ project.icon }}</div>
            <div class="project-menu">
              <button @click.stop="toggleProjectMenu(project.id)" class="menu-button">
                ⋮
              </button>
              <div v-if="activeMenu === project.id" class="dropdown-menu">
                <button @click.stop="editProject(project)">Edit</button>
                <button @click.stop="duplicateProject(project)">Duplicate</button>
                <button @click.stop="archiveProject(project)">Archive</button>
                <button @click.stop="deleteProject(project)" class="danger">Delete</button>
              </div>
            </div>
          </div>
          
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-description">{{ project.description || 'No description' }}</p>
          
          <div class="project-meta">
            <span class="project-type">{{ formatProjectType(project.type) }}</span>
            <span class="project-date">{{ formatDate(project.updated_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- New Project Modal (Replaced by wizard) -->
    <!-- <Teleport to="body">
      <div v-if="showNewProjectModal" class="modal-overlay" @click="closeNewProjectModal">
        <div class="modal" @click.stop>
          <h2 @click="handleModalHeaderClick">Create New Project</h2>
          
          <form @submit.prevent="createProject" class="project-form">
            <div class="form-group">
              <label for="projectName">Project Name</label>
              <input
                id="projectName"
                v-model="newProject.name"
                type="text"
                placeholder="My Awesome Project"
                required
                autofocus
              >
            </div>

            <div class="form-group">
              <label for="projectDescription">Description (optional)</label>
              <textarea
                id="projectDescription"
                v-model="newProject.description"
                placeholder="What's your project about?"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Project Type</label>
              <div class="project-types">
                <label
                  v-for="type in projectTypes"
                  :key="type.value"
                  class="type-option"
                >
                  <input
                    type="radio"
                    v-model="newProject.type"
                    :value="type.value"
                    name="projectType"
                  >
                  <span class="type-icon">{{ type.icon }}</span>
                  <span class="type-label">{{ type.label }}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>Choose an Icon</label>
              <div class="icon-grid">
                <button
                  v-for="icon in projectIcons"
                  :key="icon"
                  type="button"
                  @click="newProject.icon = icon"
                  :class="['icon-option', { selected: newProject.icon === icon }]"
                >
                  {{ icon }}
                </button>
              </div>
            </div>

            <div v-if="createError" class="error-message">
              {{ createError }}
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeNewProjectModal" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="create-button" :disabled="createLoading">
                <span v-if="createLoading">Creating...</span>
                <span v-else>Create Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport> -->

    <!-- Click outside to close dropdown -->
    <div v-if="activeMenu" class="backdrop" @click="activeMenu = null"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { Database } from '~/types/database'

// Protected page - requires authentication
definePageMeta({
  middleware: 'auth'
})

type Project = Database['public']['Tables']['projects']['Row']

const user = useSupabaseUser()
const supabase = useSupabaseTyped()
const router = useRouter()

// State
const projects = ref<Project[]>([])
const loading = ref(true)
const showNewProjectModal = ref(false)
const activeMenu = ref<string | null>(null)
const createLoading = ref(false)
const createError = ref('')
const searchQuery = ref('')

// Refs for user menu
const userButtonRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const showUserMenu = ref(false)

// New project form
const newProject = reactive({
  name: '',
  description: '',
  type: 'web-app',
  icon: '🚀'
})

// Project types
const projectTypes = [
  { value: 'web-app', label: 'Web Application', icon: '🌐' },
  { value: 'mobile-app', label: 'Mobile App', icon: '📱' },
  { value: 'pwa', label: 'Progressive Web App', icon: '📲' },
  { value: 'api', label: 'API/Backend', icon: '🔌' },
  { value: 'fullstack', label: 'Full-stack', icon: '🔧' },
  { value: 'library', label: 'Library/Package', icon: '📦' }
]

// Project icons
const projectIcons = [
  '🚀', '⚡', '🔥', '💎', '🌟', '🎯', '🎨', '🛠️',
  '📊', '📈', '🗂️', '💻', '🌐', '📱', '🔒', '🎮',
  '🎬', '📸', '🎵', '📝', '💬', '🛒', '🏠', '🌈'
]

// Load projects
const loadProjects = async () => {
  if (!user.value) return
  
  loading.value = true
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.value.id)
    .order('updated_at', { ascending: false })
  
  if (!error && data) {
    projects.value = data
  }
  
  loading.value = false
}

// Create project
const createProject = async () => {
  if (!user.value) return
  
  createLoading.value = true
  createError.value = ''
  
  // Generate slug
  const slug = newProject.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.value.id,
      name: newProject.name,
      slug,
      description: newProject.description || null,
      type: newProject.type,
      icon: newProject.icon,
      status: 'active'
    })
    .select()
    .single()
  
  if (error) {
    createError.value = error.message
    createLoading.value = false
    return
  }
  
  // Navigate to project builder
  await router.push(`/project/${data.slug}`)
}

// Start project creation wizard
const startProjectCreation = () => {
  router.push('/wizard/project-discovery')
}

// Open project
const openProject = (project: Project) => {
  router.push(`/project/${project.slug}`)
}

// Toggle project menu
const toggleProjectMenu = (projectId: string) => {
  activeMenu.value = activeMenu.value === projectId ? null : projectId
}

// Edit project
const editProject = (project: Project) => {
  console.log('Edit project:', project)
  activeMenu.value = null
}

// Duplicate project
const duplicateProject = async (project: Project) => {
  console.log('Duplicate project:', project)
  activeMenu.value = null
}

// Archive project
const archiveProject = async (project: Project) => {
  console.log('Archive project:', project)
  activeMenu.value = null
}

// Delete project
const deleteProject = async (project: Project) => {
  if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
    await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)
    
    await loadProjects()
  }
  activeMenu.value = null
}

// Close new project modal
const closeNewProjectModal = () => {
  showNewProjectModal.value = false
  newProject.name = ''
  newProject.description = ''
  newProject.type = 'web-app'
  newProject.icon = '🚀'
  createError.value = ''
}

// Format project type
const formatProjectType = (type: string) => {
  const typeInfo = projectTypes.find(t => t.value === type)
  return typeInfo?.label || type
}

// Format date
const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return d.toLocaleDateString()
}

// Computed
const userInitial = computed(() => {
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) {
    return projects.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project => 
    project.name.toLowerCase().includes(query) ||
    project.description?.toLowerCase().includes(query) ||
    project.type.toLowerCase().includes(query)
  )
})

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Handle sign out
const handleSignOut = async () => {
  showUserMenu.value = false
  
  const { error } = await supabase.auth.signOut()
  if (!error) {
    await navigateTo('/auth/signin')
  }
}

// Handle modal header click (for mobile close button)
const handleModalHeaderClick = (event: MouseEvent) => {
  // Check if click is on the pseudo-element (close button)
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  
  // If click is in the right 3rem area (where the × is)
  if (x > rect.width - 48) {
    closeNewProjectModal()
  }
}

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (
    showUserMenu.value &&
    userButtonRef.value &&
    dropdownRef.value &&
    !userButtonRef.value.contains(event.target as Node) &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    showUserMenu.value = false
  }
}

// Load projects on mount
onMounted(() => {
  loadProjects()
  document.addEventListener('click', handleClickOutside)
})

// Clean up
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-primary);
}

/* Header */
.dashboard-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.5rem;
  color: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button-text {
  display: none;
}

@media (min-width: 640px) {
  .button-text {
    display: inline;
  }
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-button:hover {
  background: var(--bg-quaternary);
  border-color: var(--border-secondary);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  overflow: hidden;
  z-index: 200;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--bg-tertiary);
}

.dropdown-icon {
  font-size: 1rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-primary);
  margin: 0.5rem 0;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 1rem;
}

/* Search Section */
.search-section {
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.search-wrapper {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  opacity: 0.5;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-input::placeholder {
  color: var(--text-tertiary);
  opacity: 0.6;
}

.search-input:focus {
  outline: none;
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
}

.search-input:hover {
  background: var(--bg-secondary);
}

.new-project-button {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.new-project-button:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.plus-icon {
  font-size: 1.25rem;
  font-weight: 300;
}

/* Loading state */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loader {
  width: 48px;
  height: 48px;
  border: 3px solid var(--bg-tertiary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.cta-button {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cta-button:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

/* Projects grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.project-card:hover {
  border-color: var(--primary-500);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-icon {
  font-size: 2.5rem;
}

.menu-button {
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.menu-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 10;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: var(--bg-quaternary);
}

.dropdown-menu button.danger {
  color: var(--error);
}

.project-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.project-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.project-type {
  background: var(--bg-tertiary);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
}

/* New Project Card */
.new-project-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border-style: dashed;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.new-project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-400) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.new-project-card:hover::before {
  opacity: 0.05;
}

.new-project-card:hover {
  border-color: var(--primary-500);
  border-style: solid;
}

.new-project-card:hover .new-project-icon {
  transform: rotate(90deg) scale(1.1);
  color: var(--primary-500);
}

.new-project-content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.new-project-icon {
  font-size: 3rem;
  color: var(--text-tertiary);
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.new-project-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.new-project-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Modal */
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.modal h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.project-form {
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
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.project-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-option:hover {
  border-color: var(--primary-500);
}

.type-option input[type="radio"] {
  margin: 0;
}

.type-icon {
  font-size: 1.25rem;
}

.type-label {
  font-size: 0.813rem;
  font-weight: 500;
  color: var(--text-primary);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
}

.icon-option {
  aspect-ratio: 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-option:hover {
  background: var(--bg-quaternary);
}

.icon-option.selected {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.error-message {
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid rgba(248, 81, 73, 0.3);
  color: var(--error);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
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

.create-button {
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

.create-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.create-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}

/* Mobile styles */
@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
  }
  
  .header-left {
    gap: 1rem;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .page-info {
    display: none;
  }
  
  @media (min-width: 1024px) {
    .page-info {
      display: flex;
    }
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .icon-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .type-option {
    flex-direction: column;
    text-align: center;
    padding: 1rem 0.5rem;
  }
  
  /* Full page modal on mobile */
  .modal-overlay {
    padding: 0;
  }
  
  .modal {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    margin: 0;
    padding: 1.5rem;
    padding-top: calc(1.5rem + env(safe-area-inset-top));
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
  }
  
  .modal h2 {
    position: relative;
    padding-right: 3rem;
  }
  
  /* Add close button for mobile modal */
  .modal h2::after {
    content: '×';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text-tertiary);
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }
  
  .modal h2:hover::after {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .project-form {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .modal-actions {
    position: sticky;
    bottom: 0;
    background: var(--bg-secondary);
    margin: 0 -1.5rem -1.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-primary);
  }
}
</style>