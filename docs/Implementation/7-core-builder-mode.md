
## 7. Core Builder Mode

```markdown
# Core Builder Mode Documentation

## Overview
The Core Builder Mode is the primary interface where users spend most of their time. It features a two-panel layout with an intelligent chat interface on the left and a multi-tabbed content viewer on the right, allowing seamless navigation through all project elements.

## UI Layout and Structure

### Overall Layout
```vue
<template>
  <div class="builder-container">
    <!-- Header Bar -->
    <BuilderHeader>
      <ProjectInfo 
        :name="project.name"
        :last-saved="project.lastSaved"
        @click="showProjectSettings"
      />
      
      <ViewModeToggle v-model="viewMode">
        <option value="builder">Builder</option>
        <option value="preview">Preview</option>
        <option value="flow">Flow</option>
      </ViewModeToggle>
      
      <QuickActions>
        <button @click="showExport">
          <icon name="download" /> Export
        </button>
        <button @click="showShare">
          <icon name="share" /> Share
        </button>
      </QuickActions>
    </BuilderHeader>
    
    <!-- Main Content Area -->
    <SplitView 
      v-model:ratio="panelRatio"
      :min-left="300"
      :min-right="400"
      @resize="savePanelPreference"
    >
      <!-- Left Panel: Chat Interface -->
      <template #left>
        <BuilderChat />
      </template>
      
      <!-- Right Panel: Content Viewer -->
      <template #right>
        <ContentViewer />
      </template>
    </SplitView>
  </div>
</template>
```

### Left Panel: Builder Chat

```vue
<template>
  <div class="builder-chat">
    <!-- Context Indicator -->
    <ContextIndicator>
      <ContextPill 
        v-for="context in activeContexts"
        :key="context.id"
        :type="context.type"
        :label="context.label"
        @remove="removeContext(context)"
      />
    </ContextIndicator>
    
    <!-- Chat Messages -->
    <MessageList 
      ref="messageList"
      :messages="messages"
      @message-action="handleMessageAction"
    >
      <template #message="{ message }">
        <ChatMessage 
          :message="message"
          :show-actions="true"
          @copy="copyMessage"
          @retry="retryMessage"
          @edit="editMessage"
        />
      </template>
    </MessageList>
    
    <!-- Suggestion Chips -->
    <SuggestionChips 
      v-if="suggestions.length > 0"
      :suggestions="suggestions"
      @select="selectSuggestion"
    >
      <Chip 
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        :icon="suggestion.icon"
        @click="applySuggestion(suggestion)"
      >
        {{ suggestion.label }}
      </Chip>
    </SuggestionChips>
    
    <!-- Input Area -->
    <ChatInputArea>
      <!-- Attachment Context Bar -->
      <AttachmentBar v-if="attachments.length > 0">
        <AttachmentItem
          v-for="attachment in attachments"
          :key="attachment.id"
          :attachment="attachment"
          @remove="removeAttachment(attachment)"
        />
      </AttachmentBar>
      
      <!-- Main Input -->
      <ChatInput
        v-model="userMessage"
        :placeholder="inputPlaceholder"
        @submit="sendMessage"
        @typing="handleTyping"
        :disabled="isProcessing"
      />
      
      <!-- Action Buttons -->
      <InputActions>
        <button 
          @click="captureContext"
          title="Point to element"
        >
          <icon name="pointer" />
        </button>
        <button 
          @click="attachFile"
          title="Attach file"
        >
          <icon name="paperclip" />
        </button>
        <button 
          @click="recordVoice"
          title="Voice note"
          v-if="hasVoiceSupport"
        >
          <icon name="mic" />
        </button>
      </InputActions>
    </ChatInputArea>
  </div>
</template>

<script setup>
// Dynamic suggestions based on context
const suggestions = computed(() => {
  const contextualSuggestions = [];
  
  // Based on current view
  if (currentView.value === 'pages') {
    contextualSuggestions.push(
      { icon: 'plus', label: 'Add new page', action: 'create-page' },
      { icon: 'copy', label: 'Duplicate current', action: 'duplicate-page' }
    );
  }
  
  // Based on recent activity
  if (recentActivity.value.includes('design-system-edit')) {
    contextualSuggestions.push(
      { icon: 'palette', label: 'Adjust colors', action: 'edit-colors' }
    );
  }
  
  // Based on AI analysis
  if (missingElements.value.length > 0) {
    contextualSuggestions.push(
      { icon: 'alert', label: `Add ${missingElements.value[0]}`, action: 'add-missing' }
    );
  }
  
  return contextualSuggestions.slice(0, 4); // Max 4 suggestions
});

// Context-aware placeholder
const inputPlaceholder = computed(() => {
  if (currentView.value === 'page' && selectedPage.value) {
    return `Ask about ${selectedPage.value.name} or describe changes...`;
  }
  if (attachments.value.length > 0) {
    return 'Describe what you want to do with these attachments...';
  }
  return 'Describe what you want to create or change...';
});
</script>
```

### Right Panel: Content Viewer

```vue
<template>
  <div class="content-viewer">
    <!-- Tab Navigation -->
    <TabNav v-model="activeTab">
      <Tab 
        name="vision" 
        icon="sparkles"
        :badge="visionCompleteness"
      >
        Vision
      </Tab>
      <Tab 
        name="pages" 
        icon="layout"
        :badge="pageCount"
      >
        Pages
      </Tab>
      <Tab 
        name="features" 
        icon="puzzle"
        :badge="featureCount"
      >
        Features
      </Tab>
      <Tab 
        name="journeys" 
        icon="route"
        :badge="journeyCount"
      >
        Journeys
      </Tab>
      <Tab 
        name="design" 
        icon="palette"
        :indicator="hasDesignSystem"
      >
        Design
      </Tab>
      <Tab 
        name="data" 
        icon="database"
        :badge="entityCount"
      >
        Data
      </Tab>
    </TabNav>
    
    <!-- Tab Content -->
    <TabContent>
      <!-- Vision Tab -->
      <VisionView v-if="activeTab === 'vision'">
        <VisionStatement 
          :statement="project.vision"
          :editable="true"
          @update="updateVision"
        />
        
        <GoalsSection 
          :goals="project.goals"
          @add="addGoal"
          @update="updateGoal"
          @remove="removeGoal"
        />
        
        <InspirationBoard 
          :items="project.inspiration"
          @add="addInspiration"
        />
        
        <TargetAudience 
          :audience="project.targetAudience"
          @update="updateAudience"
        />
      </VisionView>
      
      <!-- Pages Tab -->
      <PagesView v-else-if="activeTab === 'pages'">
        <PageToolbar>
          <SearchBox 
            v-model="pageSearch"
            placeholder="Search pages..."
          />
          <ViewToggle v-model="pageViewMode">
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="tree">Tree</option>
          </ViewToggle>
          <button @click="createPage" class="primary">
            <icon name="plus" /> New Page
          </button>
        </PageToolbar>
        
        <!-- Grid View -->
        <PageGrid 
          v-if="pageViewMode === 'grid'"
          :pages="filteredPages"
          @select="selectPage"
          @edit="editPage"
          :selected-id="selectedPageId"
        >
          <PageCard
            v-for="page in filteredPages"
            :key="page.id"
            :page="page"
            :selected="page.id === selectedPageId"
            @click="selectPage(page)"
            @dblclick="openPageEditor(page)"
          >
            <template #preview>
              <PageThumbnail 
                :mockup-url="page.thumbnail"
                :status="page.status"
              />
            </template>
            
            <template #info>
              <h4>{{ page.name }}</h4>
              <p>{{ page.path }}</p>
              <StatusBadge :status="page.status" />
            </template>
            
            <template #actions>
              <button @click.stop="editPage(page)">
                <icon name="edit" />
              </button>
              <button @click.stop="duplicatePage(page)">
                <icon name="copy" />
              </button>
            </template>
          </PageCard>
        </PageGrid>
        
        <!-- List View -->
        <PageList 
          v-else-if="pageViewMode === 'list'"
          :pages="filteredPages"
          :columns="['name', 'path', 'status', 'modified']"
          @select="selectPage"
          @sort="updatePageSort"
        />
        
        <!-- Tree View -->
        <PageTree 
          v-else-if="pageViewMode === 'tree'"
          :pages="pageHierarchy"
          @select="selectPage"
          @move="movePageInTree"
        />
      </PagesView>
      
      <!-- Features Tab -->
      <FeaturesView v-else-if="activeTab === 'features'">
        <FeatureList>
          <FeatureCard
            v-for="feature in features"
            :key="feature.id"
            :feature="feature"
            @click="selectFeature(feature)"
            :expanded="expandedFeatures.includes(feature.id)"
          >
            <template #header>
              <h3>{{ feature.name }}</h3>
              <StatusChip :status="feature.status" />
            </template>
            
            <template #content>
              <p>{{ feature.description }}</p>
              
              <FeatureDetails v-if="expandedFeatures.includes(feature.id)">
                <DetailSection title="Affected Pages">
                  <PageLink 
                    v-for="pageId in feature.affectedPages"
                    :key="pageId"
                    :page-id="pageId"
                    @click="navigateToPage(pageId)"
                  />
                </DetailSection>
                
                <DetailSection title="Data Operations">
                  <CRUDMatrix :operations="feature.dataOperations" />
                </DetailSection>
                
                <DetailSection title="Requirements">
                  <RequirementList :requirements="feature.requirements" />
                </DetailSection>
              </FeatureDetails>
            </template>
          </FeatureCard>
        </FeatureList>
      </FeaturesView>
      
      <!-- Journeys Tab -->
      <JourneysView v-else-if="activeTab === 'journeys'">
        <JourneySelector 
          v-model="selectedJourney"
          :journeys="journeys"
        />
        
        <MiniFlowView
          v-if="selectedJourney"
          :journey="selectedJourney"
          :interactive="true"
          @node-click="handleFlowNodeClick"
          @edit-flow="openFlowEditor"
        />
        
        <JourneyDetails
          v-if="selectedJourney"
          :journey="selectedJourney"
          @update="updateJourney"
        />
      </JourneysView>
      
      <!-- Design System Tab -->
      <DesignSystemView v-else-if="activeTab === 'design'">
        <DesignTokens 
          :tokens="designSystem.tokens"
          @update="updateTokens"
        >
          <TokenSection title="Colors">
            <ColorPalette 
              :colors="designSystem.tokens.colors"
              @edit="editColor"
              @add="addColor"
            />
          </TokenSection>
          
          <TokenSection title="Typography">
            <TypeScale 
              :typography="designSystem.tokens.typography"
              @edit="editTypography"
            />
          </TokenSection>
          
          <TokenSection title="Spacing">
            <SpacingScale 
              :spacing="designSystem.tokens.spacing"
              @edit="editSpacing"
            />
          </TokenSection>
        </DesignTokens>
        
        <ComponentLibrary 
          :components="designSystem.components"
          @preview="previewComponent"
          @edit="editComponent"
        />
      </DesignSystemView>
      
      <!-- Data Model Tab -->
      <DataModelView v-else-if="activeTab === 'data'">
        <EntityList>
          <EntityCard
            v-for="entity in entities"
            :key="entity.id"
            :entity="entity"
            @click="selectEntity(entity)"
            :selected="selectedEntityId === entity.id"
          >
            <template #fields>
              <FieldList 
                :fields="entity.fields"
                :collapsible="true"
                :max-visible="5"
              />
            </template>
            
            <template #relationships>
              <RelationshipIndicator
                v-for="rel in entity.relationships"
                :key="rel.id"
                :relationship="rel"
                @click="showRelationship(rel)"
              />
            </template>
            
            <template #crud>
              <CRUDLocations 
                :locations="entity.crudLocations"
                @navigate="navigateToLocation"
              />
            </template>
          </EntityCard>
        </EntityList>
        
        <DataModelDiagram 
          v-if="showDiagram"
          :entities="entities"
          :relationships="relationships"
          @select="selectEntity"
        />
      </DataModelView>
    </TabContent>
  </div>
</template>
```

## Context Management in Builder Mode

### Point-and-Click Context Capture

```typescript
class ContextCaptureManager {
  // Initialize context capture mode
  async startContextCapture() {
    this.overlay = this.createOverlay();
    this.bindEventListeners();
    
    // Visual feedback
    document.body.style.cursor = 'crosshair';
    this.showTooltip('Click on any element to reference it');
  }
  
  // Handle element selection
  private async handleElementClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const element = event.target as HTMLElement;
    const context = await this.captureElementContext(element);
    
    // Visual feedback
    this.highlightElement(element);
    await this.captureScreenshot(element);
    
    // Add to active context
    this.addToActiveContext({
      type: 'element',
      selector: this.generateSelector(element),
      screenshot: this.elementScreenshot,
      computedStyles: this.getRelevantStyles(element),
      content: element.textContent,
      position: this.getElementPosition(element),
      parentPage: this.getCurrentPage()
    });
    
    this.exitCaptureMode();
  }
  
  // Generate unique selector
  private generateSelector(element: HTMLElement): string {
    // Try ID first
    if (element.id) {
      return `#${element.id}`;
    }
    
    // Try data attributes
    if (element.dataset.testid) {
      return `[data-testid="${element.dataset.testid}"]`;
    }
    
    // Build path selector
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      
      // Add nth-child if needed
      const siblings = Array.from(current.parentElement?.children || []);
      const index = siblings.indexOf(current);
      if (siblings.length > 1) {
        selector += `:nth-child(${index + 1})`;
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }
}
```

### Attachment Context System

```vue
<template>
  <AttachmentManager>
    <!-- Active Attachments -->
    <div class="active-attachments">
      <AttachmentChip
        v-for="attachment in attachments"
        :key="attachment.id"
        :type="attachment.type"
        @remove="removeAttachment(attachment)"
        @preview="previewAttachment(attachment)"
      >
        <img 
          v-if="attachment.type === 'screenshot'"
          :src="attachment.thumbnail"
          :alt="attachment.description"
        />
        <icon 
          v-else
          :name="getAttachmentIcon(attachment.type)"
        />
        <span>{{ attachment.label }}</span>
      </AttachmentChip>
    </div>
    
    <!-- Attachment Actions -->
    <AttachmentActions>
      <DropZone 
        @drop="handleDrop"
        @dragover="handleDragOver"
        :active="isDragging"
      >
        Drop files here or
        <button @click="selectFiles">browse</button>
      </DropZone>
      
      <QuickAttach>
        <button @click="attachCurrentView">
          <icon name="window" /> Current View
        </button>
        <button @click="attachSelection">
          <icon name="selection" /> Selection
        </button>
        <button @click="attachFromClipboard">
          <icon name="clipboard" /> Paste
        </button>
      </QuickAttach>
    </AttachmentActions>
  </AttachmentManager>
</template>

<script setup>
// Handle different attachment types
async function processAttachment(file: File) {
  const attachment = {
    id: generateId(),
    type: detectType(file),
    file: file,
    label: file.name,
    size: file.size
  };
  
  // Process based on type
  switch (attachment.type) {
    case 'screenshot':
    case 'image':
      attachment.thumbnail = await generateThumbnail(file);
      attachment.analysis = await analyzeImage(file);
      break;
      
    case 'url':
      attachment.preview = await fetchURLPreview(file);
      break;
      
    case 'document':
      attachment.extracted = await extractDocumentContent(file);
      break;
  }
  
  attachments.value.push(attachment);
  
  // Update input context
  updateInputContext({
    hasAttachments: true,
    attachmentTypes: attachments.value.map(a => a.type),
    primaryAttachment: attachment
  });
}
</script>
```

## Tabbed Content Navigation

### Tab State Management

```typescript
class TabStateManager {
  private tabStates: Map<string, TabState> = new Map();
  
  // Save tab state
  saveTabState(tabName: string) {
    this.tabStates.set(tabName, {
      scrollPosition: this.getScrollPosition(tabName),
      selection: this.getSelection(tabName),
      expandedItems: this.getExpandedItems(tabName),
      filters: this.getFilters(tabName),
      viewMode: this.getViewMode(tabName)
    });
  }
  
  // Restore tab state
  restoreTabState(tabName: string) {
    const state = this.tabStates.get(tabName);
    if (!state) return;
    
    this.setScrollPosition(tabName, state.scrollPosition);
    this.setSelection(tabName, state.selection);
    this.setExpandedItems(tabName, state.expandedItems);
    this.setFilters(tabName, state.filters);
    this.setViewMode(tabName, state.viewMode);
  }
  
  // Cross-tab navigation
  navigateToItem(itemType: string, itemId: string) {
    const targetTab = this.getTabForItemType(itemType);
    
    // Switch to tab
    this.activeTab = targetTab;
    
    // Wait for tab render
    nextTick(() => {
      // Select/highlight item
      this.selectItemInTab(targetTab, itemId);
      
      // Scroll to item
      this.scrollToItem(targetTab, itemId);
      
      // Show details if applicable
      if (this.hasDetails(targetTab)) {
        this.showItemDetails(targetTab, itemId);
      }
    });
  }
}
```

### Smart Tab Badges

```typescript
class TabBadgeSystem {
  // Calculate badge values
  getBadgeValue(tabName: string): string | number | null {
    switch (tabName) {
      case 'vision':
        return this.getVisionCompleteness();
        
      case 'pages':
        const pageCount = this.getPageCount();
        const placeholderCount = this.getPlaceholderCount();
        return placeholderCount > 0 
          ? `${pageCount} (${placeholderCount})`
          : pageCount;
          
      case 'features':
        const incompleteFeatures = this.getIncompleteFeatures();
        return incompleteFeatures > 0
          ? `${this.getFeatureCount()} (!${incompleteFeatures})`
          : this.getFeatureCount();
          
      case 'design':
        return this.hasDesignSystem() ? '✓' : '!';
        
      case 'data':
        const unconfirmedEntities = this.getUnconfirmedEntities();
        return unconfirmedEntities > 0
          ? `${this.getEntityCount()} ?`
          : this.getEntityCount();
    }
  }
  
  // Visual indicators
  getBadgeStyle(tabName: string): BadgeStyle {
    const urgency = this.calculateUrgency(tabName);
    
    return {
      color: urgency > 0.7 ? 'error' : urgency > 0.3 ? 'warning' : 'success',
      pulse: urgency > 0.7,
      dot: this.hasRecentChanges(tabName)
    };
  }
}
```

## Connections Between Elements

### Visual Connection Indicators

```vue
<template>
  <ConnectionOverlay v-if="showConnections">
    <svg class="connection-canvas">
      <!-- Draw connections -->
      <g v-for="connection in visibleConnections" :key="connection.id">
        <path
          :d="generatePath(connection)"
          :class="getConnectionClass(connection)"
          @mouseenter="highlightConnection(connection)"
          @mouseleave="unhighlightConnection(connection)"
        />
        
        <!-- Connection label -->
        <text
          :x="connection.midpoint.x"
          :y="connection.midpoint.y"
          class="connection-label"
        >
          {{ connection.label }}
        </text>
      </g>
    </svg>
  </ConnectionOverlay>
</template>

<script setup>
// Calculate connections based on current view
const visibleConnections = computed(() => {
  const connections = [];
  
  // Page to Feature connections
  if (showingBothPagesAndFeatures.value) {
    features.value.forEach(feature => {
      feature.affectedPages.forEach(pageId => {
        connections.push({
          id: `${feature.id}-${pageId}`,
          from: getElementPosition('feature', feature.id),
          to: getElementPosition('page', pageId),
          type: 'feature-page',
          label: 'affects'
        });
      });
    });
  }
  
  // Page to Entity connections (CRUD)
  if (showingPagesAndData.value) {
    pages.value.forEach(page => {
      page.crudOperations.forEach(op => {
        connections.push({
          id: `${page.id}-${op.entity}-${op.operation}`,
          from: getElementPosition('page', page.id),
          to: getElementPosition('entity', op.entity),
          type: `crud-${op.operation.toLowerCase()}`,
          label: op.operation
        });
      });
    });
  }
  
  return connections;
});

// Generate SVG path for connection
function generatePath(connection: Connection): string {
  const { from, to } = connection;
  
  // Calculate control points for smooth curve
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  const ctrl1 = {
    x: from.x + dx * 0.5,
    y: from.y
  };
  
  const ctrl2 = {
    x: to.x - dx * 0.5,
    y: to.y
  };
  
  return `M ${from.x},${from.y} C ${ctrl1.x},${ctrl1.y} ${ctrl2.x},${ctrl2.y} ${to.x},${to.y}`;
}
</script>
```

### Relationship Navigation

```typescript
class RelationshipNavigator {
  // Navigate through connections
  followConnection(
    fromType: ElementType,
    fromId: string,
    connectionType: ConnectionType
  ) {
    const targets = this.getConnectionTargets(fromType, fromId, connectionType);
    
    if (targets.length === 1) {
      // Direct navigation
      this.navigateToElement(targets[0]);
    } else if (targets.length > 1) {
      // Show selection menu
      this.showTargetSelection(targets);
    }
  }
  
  // Show related elements
  highlightRelated(elementType: ElementType, elementId: string) {
    const related = this.getRelatedElements(elementType, elementId);
    
    // Visual highlighting
    related.forEach(element => {
      this.addHighlight(element, {
        color: this.getRelationshipColor(element.relationship),
        label: element.relationship,
        strength: element.strength
      });
    });
    
    // Update context
    this.updateActiveContext({
      focusElement: { type: elementType, id: elementId },
      relatedElements: related
    });
  }
  
  // Breadcrumb navigation
  buildNavigationPath(
    fromElement: Element,
    toElement: Element
  ): NavigationPath {
    const paths = this.findAllPaths(fromElement, toElement);
    
    // Return shortest meaningful path
    return paths
      .sort((a, b) => a.length - b.length)
      .find(path => this.isM

  // Breadcrumb navigation
  buildNavigationPath(
    fromElement: Element,
    toElement: Element
  ): NavigationPath {
    const paths = this.findAllPaths(fromElement, toElement);
    
    // Return shortest meaningful path
    return paths
      .sort((a, b) => a.length - b.length)
      .find(path => this.isMeaningfulPath(path)) || paths[0];
  }
}
```

## Real-time Suggestion System

### Contextual Suggestions

```typescript
class SuggestionEngine {
  // Generate suggestions based on multiple factors
  async generateSuggestions(context: BuilderContext): Promise<Suggestion[]> {
    const suggestions = [];
    
    // 1. Based on current view/selection
    const viewSuggestions = this.getViewBasedSuggestions(context.activeTab, context.selection);
    suggestions.push(...viewSuggestions);
    
    // 2. Based on project completeness
    const completenessSuggestions = await this.getCompletenessSuggestions(context.project);
    suggestions.push(...completenessSuggestions);
    
    // 3. Based on recent activity
    const activitySuggestions = this.getActivityBasedSuggestions(context.recentActions);
    suggestions.push(...activitySuggestions);
    
    // 4. Based on detected issues
    const issueSuggestions = await this.getIssueSuggestions(context.project);
    suggestions.push(...issueSuggestions);
    
    // Rank and filter
    return this.rankSuggestions(suggestions, context)
      .slice(0, 4); // Max 4 suggestions
  }
  
  // View-specific suggestions
  private getViewBasedSuggestions(tab: string, selection: any): Suggestion[] {
    const suggestions = [];
    
    switch (tab) {
      case 'pages':
        if (!selection) {
          suggestions.push({
            icon: 'plus',
            label: 'Create new page',
            action: 'start-page-wizard',
            relevance: 0.9
          });
        } else if (selection.is_placeholder) {
          suggestions.push({
            icon: 'sparkle',
            label: `Design ${selection.name}`,
            action: 'design-placeholder',
            context: { pageId: selection.id },
            relevance: 1.0
          });
        }
        break;
        
      case 'features':
        if (selection?.status === 'planned') {
          suggestions.push({
            icon: 'play',
            label: 'Start implementing',
            action: 'implement-feature',
            context: { featureId: selection.id },
            relevance: 0.85
          });
        }
        break;
        
      case 'design':
        if (!hasDesignSystem()) {
          suggestions.push({
            icon: 'palette',
            label: 'Create design system',
            action: 'start-design-wizard',
            relevance: 0.95
          });
        }
        break;
    }
    
    return suggestions;
  }
}
```

### Smart Action Chips

```vue
<template>
  <SuggestionChips 
    :class="{ 'has-urgent': hasUrgentSuggestions }"
  >
    <TransitionGroup name="chip-list">
      <Chip
        v-for="suggestion in currentSuggestions"
        :key="suggestion.id"
        :icon="suggestion.icon"
        :urgency="suggestion.urgency"
        @click="applySuggestion(suggestion)"
        @dismiss="dismissSuggestion(suggestion)"
      >
        {{ suggestion.label }}
        <template #detail v-if="suggestion.detail">
          <span class="chip-detail">{{ suggestion.detail }}</span>
        </template>
      </Chip>
    </TransitionGroup>
    
    <!-- Contextual help -->
    <HelpTooltip v-if="showHelp">
      These suggestions are based on your current context and project needs.
      Click to apply or dismiss if not relevant.
    </HelpTooltip>
  </SuggestionChips>
</template>

<style scoped>
.chip-list-enter-active,
.chip-list-leave-active {
  transition: all 0.3s ease;
}

.chip-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.chip-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.has-urgent {
  animation: subtle-pulse 2s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>
```

## Performance Optimizations

### Lazy Loading and Virtualization

```typescript
class BuilderPerformanceManager {
  // Virtualize large lists
  setupVirtualization(container: HTMLElement, items: any[]) {
    const virtualizer = new VirtualList({
      container,
      items,
      itemHeight: this.calculateItemHeight,
      bufferSize: 5,
      onVisibleRangeChange: this.handleVisibleRangeChange
    });
    
    return virtualizer;
  }
  
  // Lazy load tab content
  async loadTabContent(tabName: string) {
    // Check cache first
    if (this.tabCache.has(tabName)) {
      return this.tabCache.get(tabName);
    }
    
    // Load only what's needed
    const content = await this.loadMinimalContent(tabName);
    
    // Background load rest
    this.backgroundLoadFullContent(tabName);
    
    return content;
  }
  
  // Debounce heavy operations
  private debouncedSearch = debounce((query: string) => {
    this.performSearch(query);
  }, 300);
  
  // Optimize re-renders
  shouldUpdateView(newState: State, oldState: State): boolean {
    // Only update if relevant data changed
    return !isEqual(
      pick(newState, this.relevantFields[this.activeTab]),
      pick(oldState, this.relevantFields[this.activeTab])
    );
  }
}
```

### Smart Caching

```typescript
class BuilderCacheManager {
  private cache = new Map<string, CacheEntry>();
  
  // Cache with TTL
  set(key: string, value: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
      hits: 0
    });
  }
  
  // Get with cache refresh
  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    entry.hits++;
    return entry.value;
  }
  
  // Predictive caching
  async prefetchRelated(elementType: string, elementId: string) {
    const related = await this.predictRelatedRequests(elementType, elementId);
    
    for (const request of related) {
      if (!this.cache.has(request.key)) {
        // Background fetch
        this.backgroundFetch(request);
      }
    }
  }
}
```

## Builder Mode Integration Points

### With Vision Mode
```typescript
// Trigger vision mode from builder
function switchToVisionMode(reason?: string) {
  // Save builder state
  builderState.save();
  
  // Prepare vision context
  const visionContext = {
    returnTo: 'builder',
    questionsNeeded: getUnansweredQuestions(),
    reason: reason || 'User requested vision mode'
  };
  
  // Navigate
  router.push({
    name: 'vision',
    state: visionContext
  });
}
```

### With Wizards
```typescript
// Launch wizard from builder action
async function launchWizard(wizardType: string, context: any) {
  // Don't leave builder, open wizard in modal/split view
  const wizard = await openWizard(wizardType, {
    mode: 'embedded',
    context: {
      ...getCurrentBuilderContext(),
      ...context
    },
    onComplete: (output) => {
      // Integrate wizard output back into builder
      integrateWizardOutput(output);
      
      // Refresh relevant views
      refreshAffectedTabs(output);
    }
  });
}
```

### With Flow View
```typescript
// Sync selection between builder and flow
class BuilderFlowSync {
  syncToFlow(selection: BuilderSelection) {
    if (selection.type === 'page') {
      flowView.highlightScreenNodes(selection.id);
      flowView.showRelatedJourneys(selection.id);
    } else if (selection.type === 'journey') {
      flowView.loadJourney(selection.id);
      flowView.centerView();
    }
  }
  
  syncFromFlow(flowSelection: FlowSelection) {
    if (flowSelection.type === 'screen') {
      builderView.switchToTab('pages');
      builderView.selectPage(flowSelection.screenId);
    }
  }
}
```

## Keyboard Shortcuts and Accessibility

```typescript
const BUILDER_SHORTCUTS = {
  // Navigation
  'cmd+1': () => switchTab('vision'),
  'cmd+2': () => switchTab('pages'),
  'cmd+3': () => switchTab('features'),
  'cmd+4': () => switchTab('journeys'),
  'cmd+5': () => switchTab('design'),
  'cmd+6': () => switchTab('data'),
  
  // Actions
  'cmd+n': () => createNewBasedOnContext(),
  'cmd+d': () => duplicateSelected(),
  'cmd+delete': () => deleteSelected(),
  'cmd+z': () => undo(),
  'cmd+shift+z': () => redo(),
  
  // View modes
  'cmd+shift+g': () => toggleGridView(),
  'cmd+shift+l': () => toggleListView(),
  'cmd+shift+t': () => toggleTreeView(),
  
  // Context
  'cmd+k': () => focusSearch(),
  'cmd+.': () => showContextMenu(),
  'cmd+/': () => showKeyboardShortcuts()
};

// Accessibility features
class BuilderAccessibility {
  // Announce state changes
  announceChange(change: string) {
    this.liveRegion.textContent = change;
  }
  
  // Keyboard navigation
  handleKeyboardNav(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab':
        this.handleTabNavigation(event);
        break;
      case 'Enter':
        this.activateSelected();
        break;
      case 'Escape':
        this.clearSelection();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        this.navigateList(event.key);
        break;
    }
  }
}
```

## Best Practices

1. **Minimal Cognitive Load**: Show only relevant suggestions and options
2. **Progressive Disclosure**: Advanced features available but not overwhelming
3. **Consistent Patterns**: Same interactions work across all tabs
4. **Visual Feedback**: Every action has immediate visual response
5. **Smart Defaults**: Anticipate user needs based on context
6. **Undo Everything**: Every action is reversible
7. **Keyboard Friendly**: Full keyboard navigation support
8. **Performance First**: Lazy load, virtualize, cache aggressively
```






```