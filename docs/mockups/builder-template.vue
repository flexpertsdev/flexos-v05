<template>
  <div>
    <!-- Desktop Layout -->
    <div v-if="!isMobile">
      <!-- Top Navigation Bar -->
      <nav>
        <div>
          <!-- Logo/Title -->
          <div>FlexOS Builder</div>
          
          <!-- Project Name -->
          <div>{{ projectName }}</div>
          
          <!-- Right Controls -->
          <div>
            <!-- Mode Selector -->
            <select v-model="currentMode">
              <option value="builder">Builder</option>
              <option value="focus">Focus</option>
              <option value="map">Map</option>
            </select>
            
            <!-- Settings Icon -->
            <button @click="openSettings">
              <i>⚙️</i>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content Area -->
      <div>
        <!-- Chat Panel -->
        <div>
          <div>
            <span>AI Assistant</span>
            <button @click="clearChat">Clear</button>
          </div>
          
          <div>
            <!-- Chat Messages -->
            <div v-for="message in messages" :key="message.id">
              {{ message.content }}
            </div>
          </div>
          
          <div>
            <input 
              v-model="chatInput" 
              placeholder="Ask about your project..."
              @keyup.enter="sendMessage"
            />
            <button @click="attachFile">📎</button>
          </div>
        </div>

        <!-- Project Panel -->
        <div>
          <!-- Project Tabs -->
          <div>
            <button 
              v-for="tab in projectTabs" 
              :key="tab.id"
              @click="activeProjectTab = tab.id"
              :class="{ active: activeProjectTab === tab.id }"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <!-- Project Content -->
          <div>
            <component :is="activeProjectComponent" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div v-else>
      <!-- App Bar -->
      <header>
        <button @click="goToDashboard">
          <span>F</span>
        </button>
        
        <select v-model="currentMode">
          <option value="builder">Builder</option>
          <option value="focus">Focus</option>
          <option value="map">Map</option>
        </select>
        
        <button @click="openSettings">⚙️</button>
      </header>

      <!-- Tab Navigation -->
      <div>
        <button 
          @click="activeMobileTab = 'chat'"
          :class="{ active: activeMobileTab === 'chat' }"
        >
          Chat
        </button>
        <button 
          @click="activeMobileTab = 'project'"
          :class="{ active: activeMobileTab === 'project' }"
        >
          Project
        </button>
      </div>

      <!-- Mobile Content -->
      <div>
        <!-- Chat View -->
        <div v-if="activeMobileTab === 'chat'">
          <div>
            <span>AI Assistant</span>
            <button @click="clearChat">Clear</button>
          </div>
          
          <div>
            <div v-for="message in messages" :key="message.id">
              {{ message.content }}
            </div>
          </div>
          
          <div>
            <input 
              v-model="chatInput" 
              placeholder="Ask about your project..."
              @keyup.enter="sendMessage"
            />
            <button @click="attachFile">📎</button>
          </div>
        </div>

        <!-- Project View -->
        <div v-if="activeMobileTab === 'project'">
          <div @click="showPanelSelector = true">
            <span>{{ activeProjectTab }}</span>
            <span>▼</span>
          </div>
          
          <div>
            <component :is="activeProjectComponent" />
          </div>
        </div>
      </div>

      <!-- Panel Selector Bottom Sheet -->
      <div v-if="showPanelSelector" @click="showPanelSelector = false">
        <div @click.stop>
          <button 
            v-for="tab in projectTabs" 
            :key="tab.id"
            @click="selectPanel(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: false,
      currentMode: 'builder',
      projectName: 'E-commerce Store',
      activeMobileTab: 'chat',
      activeProjectTab: 'vision',
      showPanelSelector: false,
      chatInput: '',
      messages: [],
      projectTabs: [
        { id: 'vision', label: 'Vision' },
        { id: 'pages', label: 'Pages' },
        { id: 'features', label: 'Features' },
        { id: 'journeys', label: 'Journeys' },
        { id: 'design', label: 'Design' },
        { id: 'database', label: 'Database' }
      ]
    }
  },
  computed: {
    activeProjectComponent() {
      // Return the component based on activeProjectTab
      return `${this.activeProjectTab}-panel`
    }
  },
  methods: {
    clearChat() {
      this.messages = []
    },
    sendMessage() {
      // Send message logic
    },
    attachFile() {
      // File attachment logic
    },
    openSettings() {
      // Open settings
    },
    goToDashboard() {
      // Navigate to dashboard
    },
    selectPanel(panelId) {
      this.activeProjectTab = panelId
      this.showPanelSelector = false
    }
  },
  mounted() {
    // Check if mobile
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkIfMobile)
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768
    }
  }
}
</script>