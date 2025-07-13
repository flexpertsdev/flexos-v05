

## 5. Visual VueFlow Overview

```markdown
# Visual VueFlow Project Overview System

## Overview
The visual flow system provides multiple views of the project using VueFlow (Vue 3 equivalent of React Flow). It serves as the visual source of truth, allowing users to see and manipulate their application's structure through different lenses.

## Core View Modes

### 1. Journey Flow View (Filtered by User Flow)

```vue
<template>
  <div class="flow-view-container">
    <!-- View mode selector -->
    <ViewModeSelector v-model="viewMode">
      <option value="journey">User Journeys</option>
      <option value="screens">All Screens</option>
      <option value="features">Feature Map</option>
      <option value="database">Data Flow</option>
    </ViewModeSelector>
    
    <!-- Flow canvas -->
    <VueFlow
      v-model="elements"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      @node-drag-stop="handleNodeDragStop"
      @edge-update="handleEdgeUpdate"
      @node-click="handleNodeClick"
      @pane-click="handlePaneClick"
      @connect="handleConnect"
      :connection-line-style="connectionLineStyle"
      :default-zoom="0.8"
      :min-zoom="0.2"
      :max-zoom="2"
    >
      <!-- Custom node components -->
      <template #node-screen="{ data, selected }">
        <ScreenNode 
          :data="data" 
          :selected="selected"
          @edit="editScreen"
          @preview="previewScreen"
        />
      </template>
      
      <template #node-decision="{ data }">
        <DecisionNode 
          :data="data"
          @edit-condition="editCondition"
        />
      </template>
      
      <template #node-database="{ data }">
        <DatabaseNode 
          :data="data"
          :operation="data.operation"
          @view-schema="viewEntitySchema"
        />
      </template>
      
      <!-- Controls -->
      <Controls />
      <MiniMap />
      <Background variant="dots" />
      
      <!-- Custom controls -->
      <FlowControls
        @auto-layout="autoLayout"
        @export="exportFlow"
        @filter="openFilterPanel"
      />
    </VueFlow>
    
    <!-- Context panel -->
    <ContextPanel 
      v-if="selectedNode"
      :node="selectedNode"
      @update="updateNode"
      @delete="deleteNode"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'

// Node types
const nodeTypes = {
  screen: ScreenNode,
  decision: DecisionNode,
  database: DatabaseNode,
  annotation: AnnotationNode
}

// Edge types
const edgeTypes = {
  default: DefaultEdge,
  conditional: ConditionalEdge,
  data: DataFlowEdge
}

// Flow state
const { 
  nodes, 
  edges, 
  viewport, 
  project, 
  getNodes, 
  getEdges,
  fitView 
} = useVueFlow()

// Auto-layout
async function autoLayout() {
  const layouted = await calculateLayout(nodes.value, edges.value, {
    direction: 'TB',
    spacing: [100, 150]
  });
  
  nodes.value = layouted.nodes;
  await nextTick();
  fitView();
}
</script>
```

### 2. Screen Grid View (Figma-Style)

```vue
<template>
  <div class="screen-grid-view">
    <!-- Grouping controls -->
    <GroupingControls>
      <select v-model="groupBy">
        <option value="auto">Smart Groups</option>
        <option value="feature">By Feature</option>
        <option value="device">By Device</option>
        <option value="status">By Status</option>
        <option value="none">No Grouping</option>
      </select>
      
      <ViewOptions>
        <toggle v-model="showAnnotations">Annotations</toggle>
        <toggle v-model="showConnections">Connections</toggle>
        <toggle v-model="showCRUD">CRUD Badges</toggle>
      </ViewOptions>
    </GroupingControls>
    
    <!-- Screen grid -->
    <div class="screen-grid" :class="`cols-${gridColumns}`">
      <ScreenGroup
        v-for="group in screenGroups"
        :key="group.id"
        :title="group.name"
        :collapsed="group.collapsed"
        @toggle="toggleGroup(group)"
      >
        <draggable
          :list="group.screens"
          :group="{ name: 'screens' }"
          @change="handleScreenMove"
          item-key="id"
        >
          <template #item="{ element: screen }">
            <ScreenCard
              :screen="screen"
              :size="thumbnailSize"
              :show-device="true"
              @click="selectScreen(screen)"
              @dblclick="openScreenEditor(screen)"
              :selected="isSelected(screen)"
            >
              <!-- Badges -->
              <template #badges>
                <badge v-if="screen.is_placeholder" type="warning">
                  Placeholder
                </badge>
                <badge v-if="screen.has_mockup" type="success">
                  Designed
                </badge>
                <badge v-for="crud in screen.crud_operations" :key="crud">
                  {{ crud }}
                </badge>
              </template>
              
              <!-- Connection indicators -->
              <template #connections v-if="showConnections">
                <ConnectionIndicator
                  v-for="conn in getScreenConnections(screen)"
                  :key="conn.id"
                  :direction="conn.direction"
                  :target="conn.target_name"
                />
              </template>
              
              <!-- Quick actions -->
              <template #actions>
                <button @click.stop="editScreen(screen)">
                  <icon name="edit" />
                </button>
                <button @click.stop="duplicateScreen(screen)">
                  <icon name="copy" />
                </button>
                <button @click.stop="deleteScreen(screen)">
                  <icon name="trash" />
                </button>
              </template>
            </ScreenCard>
          </template>
        </draggable>
      </ScreenGroup>
    </div>
    
    <!-- Floating action button -->
    <FloatingActions>
      <button @click="addNewScreen" class="primary">
        <icon name="plus" /> Add Screen
      </button>
      <button @click="importScreens">
        <icon name="import" /> Import
      </button>
    </FloatingActions>
  </div>
</template>

<style scoped>
.screen-grid {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }
.cols-5 { grid-template-columns: repeat(5, 1fr); }
.cols-auto { 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
}

.screen-card {
  aspect-ratio: 9/16;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.screen-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
</style>
```

### 3. Feature/Database View

```vue
<template>
  <div class="feature-database-view">
    <VueFlow
      v-model="elements"
      :node-types="featureNodeTypes"
      @node-click="handleFeatureClick"
    >
      <!-- Feature nodes -->
      <template #node-feature="{ data }">
        <FeatureNode :data="data">
          <div class="feature-header">
            <h3>{{ data.name }}</h3>
            <badge>{{ data.status }}</badge>
          </div>
          
          <div class="feature-stats">
            <stat label="Pages" :value="data.affected_pages.length" />
            <stat label="Entities" :value="data.entities.length" />
          </div>
          
          <div class="crud-operations">
            <CRUDIndicator
              v-for="(operations, entity) in data.crud_map"
              :key="entity"
              :entity="entity"
              :operations="operations"
            />
          </div>
        </FeatureNode>
      </template>
      
      <!-- Entity nodes -->
      <template #node-entity="{ data }">
        <EntityNode :data="data">
          <h4>{{ data.name }}</h4>
          <div class="fields-preview">
            <field v-for="field in data.fields.slice(0, 3)" :key="field.name">
              {{ field.name }}: {{ field.type }}
            </field>
            <span v-if="data.fields.length > 3">
              +{{ data.fields.length - 3 }} more
            </span>
          </div>
        </EntityNode>
      </template>
      
      <!-- Relationship edges -->
      <template #edge-relationship="{ data }">
        <RelationshipEdge
          :source-entity="data.source"
          :target-entity="data.target"
          :relationship-type="data.type"
          :label="data.label"
        />
      </template>
    </VueFlow>
  </div>
</template>
```

## Custom Node Components

### Screen Node
```vue
<template>
  <div 
    class="screen-node"
    :class="{ 
      selected, 
      placeholder: data.is_placeholder,
      has_errors: data.has_errors 
    }"
    @contextmenu.prevent="showContextMenu"
  >
    <!-- Device frame -->
    <div class="device-frame" :class="data.device">
      <!-- Mockup preview -->
      <div class="mockup-preview">
        <img 
          v-if="data.thumbnail_url" 
          :src="data.thumbnail_url"
          :alt="data.name"
        />
        <div v-else class="placeholder-content">
          <icon name="layout" />
          <span>{{ data.name }}</span>
        </div>
      </div>
    </div>
    
    <!-- Screen info -->
    <div class="screen-info">
      <h4>{{ data.name }}</h4>
      <span class="path">{{ data.path }}</span>
    </div>
    
    <!-- Connection handles -->
    <Handle
      id="in"
      type="target"
      :position="Position.Top"
      :style="handleStyle"
    />
    <Handle
      id="out"
      type="source"
      :position="Position.Bottom"
      :style="handleStyle"
    />
    
    <!-- CRUD badges -->
    <div class="crud-badges" v-if="data.crud_operations">
      <badge
        v-for="op in data.crud_operations"
        :key="op"
        :type="getCRUDType(op)"
        size="sm"
      >
        {{ op }}
      </badge>
    </div>
    
    <!-- Quick actions overlay -->
    <div class="quick-actions" v-if="selected">
      <button @click="$emit('edit')" title="Edit Screen">
        <icon name="edit" />
      </button>
      <button @click="$emit('preview')" title="Preview">
        <icon name="eye" />
      </button>
      <button @click="showConnections" title="Show Connections">
        <icon name="git-branch" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.screen-node {
  background: var(--surface);
  border-radius: 12px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.screen-node.selected {
  box-shadow: 0 0 0 2px var(--primary);
}

.device-frame {
  background: white;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
}

.device-frame.iphone {
  aspect-ratio: 9/19.5;
  border-radius: 20px;
}

.device-frame.desktop {
  aspect-ratio: 16/10;
}

.mockup-preview {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.crud-badges {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.quick-actions {
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 8px;
  background: var(--surface);
  padding: 4px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
</style>
```

### Decision Node
```vue
<template>
  <div class="decision-node">
    <div class="decision-header">
      <icon name="git-branch" />
      <span>Decision</span>
    </div>
    
    <div class="decision-content">
      <p>{{ data.condition }}</p>
    </div>
    
    <!-- Multiple output handles for branches -->
    <Handle
      v-for="(branch, index) in data.branches"
      :key="branch.id"
      :id="`branch-${index}`"
      type="source"
      :position="getHandlePosition(index, data.branches.length)"
      :style="{ ...handleStyle, background: branch.color }"
    >
      <label>{{ branch.label }}</label>
    </Handle>
    
    <Handle
      id="in"
      type="target"
      :position="Position.Top"
    />
  </div>
</template>
```

## Interaction Handlers

### Point and Click Editing
```typescript
class FlowInteractionHandler {
  // Click on screen node
  async handleScreenClick(node: ScreenNode, event: MouseEvent) {
    if (event.shiftKey) {
      // Multi-select
      this.toggleSelection(node);
    } else if (event.altKey) {
      // Quick preview
      this.showQuickPreview(node);
    } else {
      // Select and show details
      this.selectNode(node);
      this.showContextPanel(node);
    }
  }
  
  // Click on connection
  async handleEdgeClick(edge: Edge, event: MouseEvent) {
    const menu = await this.showEdgeMenu(edge, event);
    
    menu.options = [
      {
        label: 'Edit Trigger',
        action: () => this.editEdgeTrigger(edge)
      },
      {
        label: 'Add Condition',
        action: () => this.addEdgeCondition(edge)
      },
      {
        label: 'Delete Connection',
        action: () => this.deleteEdge(edge),
        style: 'danger'
      }
    ];
  }
  
  // Drag to connect
  async handleConnect(params: Connection) {
    const sourceNode = this.getNode(params.source);
    const targetNode = this.getNode(params.target);
    
    // Show connection configurator
    const config = await this.showConnectionConfig({
      from: sourceNode,
      to: targetNode,
      suggestedTriggers: this.suggestTriggers(sourceNode, targetNode)
    });
    
    if (config) {
      this.addEdge({
        ...params,
        type: 'conditional',
        data: config
      });
    }
  }
  
  // Canvas click for context menu
  async handleCanvasClick(event: MouseEvent) {
    if (event.button === 2) { // Right click
      const menu = await this.showCanvasMenu(event);
      
      menu.options = [
        {
          label: 'Add Screen',
          action: () => this.addScreen(event.position)
        },
        {
          label: 'Add Decision',
          action: () => this.addDecision(event.position)
        },
        {
          label: 'Paste',
          action: () => this.paste(event.position),
          enabled: this.hasClipboard()
        }
      ];
    }
  }
}
```

### AI-Assisted Editing
```vue
<template>
  <AIAssistPanel v-if="showAIAssist">
    <h3>AI Assistant</h3>
    
    <!-- Suggestions based on selection -->
    <div v-if="selectedNodes.length > 0">
      <h4>With selected screens:</h4>
      <suggestions>
        <button @click="ai.connectScreens(selectedNodes)">
          Connect these screens logically
        </button>
        <button @click="ai.suggestMissingScreens(selectedNodes)">
          Find missing screens
        </button>
        <button @click="ai.optimizeFlow(selectedNodes)">
          Optimize this flow
        </button>
      </suggestions>
    </div>
    
    <!-- Flow analysis -->
    <div v-if="currentFlow">
      <h4>Flow Analysis:</h4>
      <analysis-item
        v-for="issue in flowAnalysis.issues"
        :key="issue.id"
        :type="issue.severity"
      >
        {{ issue.description }}
        <button @click="ai.fix(issue)">Fix</button>
      </analysis-item>
    </div>
    
    <!-- Natural language commands -->
    <AICommandInput
      placeholder="Arrange all auth screens in a flow..."
      @submit="handleAICommand"
      :suggestions="aiCommandSuggestions"
    />
  </AIAssistPanel>
</template>

<script setup>
// AI-assisted operations
const ai = {
  async connectScreens(screens: ScreenNode[]) {
    // Analyze screens and suggest connections
    const connections = await analyzeScreenRelationships(screens);
    
    for (const conn of connections) {
      const confirmed = await confirmConnection(conn);
      if (confirmed) {
        addEdge(conn);
      }
    }
  },
  
  async suggestMissingScreens(screens: ScreenNode[]) {
    // Analyze flow and find gaps
    const analysis = await analyzeUserFlow(screens);
    const missing = analysis.missingScreens;
    
    if (missing.length > 0) {
      const result = await showMissingScreensDialog(missing);
      if (result.confirmed) {
        for (const screen of result.selected) {
          await createPlaceholderScreen(screen);
        }
      }
    }
  },
  
  async optimizeFlow(nodes: Node[]) {
    // Rearrange for clarity
    const optimized = await calculateOptimalLayout(nodes, {
      minimizeCrossings: true,
      groupRelated: true,
      maintainReadability: true
    });
    
    animateToNewLayout(optimized);
  }
};
</script>
```

## View Filtering and Modes

### Filter System
```typescript
interface FlowFilter {
  // Journey filters
  journey?: {
    id?: string;
    showOnlyPath?: boolean;
    highlightCritical?: boolean;
  };
  
  // Screen filters
  screens?: {
    status?: 'all' | 'designed' | 'placeholder';
    device?: 'all' | 'mobile' | 'tablet' | 'desktop';
    hasErrors?: boolean;
  };
  
  // Feature filters
  features?: {
    status?: 'planned' | 'in-progress' | 'completed';
    category?: string;
  };
  
  // CRUD filters
  crud?: {
    showOperations?: boolean;
    entity?: string;
    operation?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  };
  
  // Visual filters
  visual?: {
    dimUnrelated?: boolean;
    highlightColor?: string;
    showAnnotations?: boolean;
  };
}
```

### View Synchronization
```typescript
class ViewSynchronizer {
  // Sync between different views
  syncViews(sourceView: ViewType, targetView: ViewType, selection: any) {
    switch (sourceView) {
      case 'journey':
        if (targetView === 'screens') {
          // Highlight screens used in selected journey
          this.highlightScreensInJourney(selection.journeyId);
        }
        break;
        
      case 'screens':
        if (targetView === 'journey') {
          // Show journeys that use selected screen
          this.showJourneysForScreen(selection.screenId);
        }
        break;
        
      case 'feature':
        if (targetView === 'screens') {
          // Show screens affected by feature
          this.showScreensForFeature(selection.featureId);
        }
        break;
    }
  }
  
  // Maintain selection across view changes
  preserveSelection(fromView: ViewType, toView: ViewType) {
    const selection = this.getSelection(fromView);
    const equivalent = this.findEquivalent(selection, toView);
    this.setSelection(toView, equivalent);
  }
}
```

## Export and Sharing

### Flow Export Options
```typescript
interface FlowExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'vueflow';
  includeAnnotations: boolean;
  resolution: 'screen' | 'print' | 'custom';
  customSize?: { width: number; height: number };
  theme: 'light' | 'dark' | 'custom';
}

async function exportFlow(options: FlowExportOptions) {
  switch (options.format) {
    case 'png':
    case 'svg':
      return await exportAsImage(flow, options);
      
    case 'pdf':
      return await exportAsPDF(flow, options);
      
    case 'vueflow':
      return await exportFlowData(flow);
  }
}
```

## Performance Optimizations

### Virtual Rendering for Large Flows
```typescript
class FlowRenderer {
  // Only render visible nodes
  renderVisibleNodes(viewport: Viewport, nodes: Node[]) {
    const visible = nodes.filter(node => 
      this.isInViewport(node, viewport)
    );
    
    // Add buffer for smooth scrolling
    const buffer = this.calculateBuffer(viewport);
    const buffered = nodes.filter(node =>
      this.isInBuffer(node, viewport, buffer)
    );
    
    return {
      render: visible,
      preload: buffered
    };
  }
  
  // Level of detail based on zoom
  getNodeLOD(zoom: number): 'full' | 'simplified' | 'minimal' {
    if (zoom > 0.8) return 'full';
    if (zoom > 0.4) return 'simplified';
    return 'minimal';
  }
}
```

### Batch Operations
```typescript
class FlowBatchOperations {
  // Batch node updates
  async batchUpdate(updates: NodeUpdate[]) {
    this.startBatch();
    
    for (const update of updates) {
      this.queueUpdate(update);
    }
    
    await this.commitBatch();
    this.redrawOnce();
  }
  
  // Batch layout calculations
  async batchLayout(nodes: Node[], edges: Edge[]) {
    const worker = new Worker('layout-worker.js');
    const result = await worker.postMessage({
      nodes,
      edges,
      algorithm: 'dagre'
    });
    
    return result;
  }
}
```
```










