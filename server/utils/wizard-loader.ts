import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { parse as parseYAML } from 'yaml'
import type { WizardConfig } from '~/types/wizard'

// Cache for loaded wizards
const wizardCache = new Map<string, WizardConfig>()

/**
 * Get the wizards directory path
 */
async function getWizardsPath(): Promise<string | null> {
  const { existsSync } = await import('fs')
  
  // In production, wizards might be in a different location
  const isDev = process.env.NODE_ENV === 'development'
  
  // Try multiple possible locations
  const possiblePaths = isDev 
    ? [
        join(process.cwd(), 'wizards'),
        join(process.cwd(), 'public', 'wizards')
      ]
    : [
        join(process.cwd(), 'public', 'wizards'),
        join(process.cwd(), '.output', 'public', 'wizards'),
        join(process.cwd(), 'wizards'),
        join(process.cwd(), '.output', 'wizards'),
        join(process.cwd(), '.output', 'server', 'wizards')
      ]
  
  // Find the first valid path
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      console.log(`[Wizard Loader] Found wizard directory at: ${path}`)
      return path
    }
  }
  
  console.warn('[Wizard Loader] No wizard directory found in any of:', possiblePaths)
  return null
}

/**
 * Load all available wizards
 */
export async function getWizardList(): Promise<WizardConfig[]> {
  const isDev = process.env.NODE_ENV === 'development'
  
  // In production, use filesystem fallback since Nitro storage isn't available during build
  if (!isDev) {
    // In production builds, wizards are bundled so we'll use the default wizards
    console.log('[Wizard Loader] Using default wizards for production build')
    return getDefaultWizards()
  }
  
  // In development, use filesystem
  const wizardsPath = await getWizardsPath()
  
  if (!wizardsPath) {
    console.log('[Wizard Loader] No wizard directory found, using default wizards')
    return getDefaultWizards()
  }
  
  const wizards: WizardConfig[] = []
  
  try {
    const files = await readdir(wizardsPath)
    console.log(`[Wizard Loader] Files found: ${files.join(', ')}`)
    
    for (const file of files) {
      if (file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')) {
        const wizardId = file.replace(/\.(yaml|yml|json)$/, '')
        const wizard = await loadWizardFile(join(wizardsPath, file), wizardId)
        if (wizard) {
          wizards.push(wizard)
          console.log(`[Wizard Loader] Loaded wizard: ${wizardId}`)
        }
      }
    }
  } catch (error) {
    console.warn('[Wizard Loader] Error reading wizard directory:', error)
    // Return default wizards if directory doesn't exist
    return getDefaultWizards()
  }
  
  // If no wizards found in files, add defaults
  if (wizards.length === 0) {
    console.log('[Wizard Loader] No wizard files found, using defaults')
    return getDefaultWizards()
  }
  
  return wizards
}

/**
 * Get a specific wizard configuration
 */
export async function getWizardConfig(wizardId: string): Promise<WizardConfig | null> {
  // Check cache first
  if (wizardCache.has(wizardId)) {
    return wizardCache.get(wizardId)!
  }
  
  const isDev = process.env.NODE_ENV === 'development'
  
  // In production, use default wizards
  if (!isDev) {
    // Check default wizards first
    const defaultWizards = getDefaultWizards()
    const defaultWizard = defaultWizards.find(w => w.id === wizardId)
    if (defaultWizard) {
      wizardCache.set(wizardId, defaultWizard)
      return defaultWizard
    }
    return null
  } else {
    // In development, use filesystem
    const wizardsPath = await getWizardsPath()
    
    if (wizardsPath) {
      // Try different file extensions
      const extensions = ['.yaml', '.yml', '.json']
      
      for (const ext of extensions) {
        try {
          const filePath = join(wizardsPath, wizardId + ext)
          const wizard = await loadWizardFile(filePath, wizardId)
          if (wizard) {
            wizardCache.set(wizardId, wizard)
            return wizard
          }
        } catch (error) {
          // File doesn't exist, try next extension
        }
      }
    }
  }
  
  // Check default wizards
  const defaultWizards = getDefaultWizards()
  const defaultWizard = defaultWizards.find(w => w.id === wizardId)
  if (defaultWizard) {
    wizardCache.set(wizardId, defaultWizard)
    return defaultWizard
  }
  
  console.warn(`[Wizard Loader] Wizard not found: ${wizardId}`)
  return null
}

/**
 * Load a wizard configuration file
 */
async function loadWizardFile(filePath: string, wizardId: string): Promise<WizardConfig | null> {
  try {
    const content = await readFile(filePath, 'utf-8')
    
    let config: any
    if (filePath.endsWith('.json')) {
      config = JSON.parse(content)
    } else {
      config = parseYAML(content)
    }
    
    // Ensure wizard has an ID
    if (!config.id) {
      config.id = wizardId
    }
    
    // Validate wizard configuration
    if (validateWizardConfig(config)) {
      return config as WizardConfig
    }
    
    console.error(`Invalid wizard configuration: ${filePath}`)
    return null
  } catch (error) {
    console.error(`Failed to load wizard file: ${filePath}`, error)
    return null
  }
}

/**
 * Validate wizard configuration
 */
function validateWizardConfig(config: any): boolean {
  if (!config.name || !config.phases || !Array.isArray(config.phases)) {
    console.error('Wizard validation failed: missing name or phases')
    return false
  }
  
  // Validate each phase
  for (let i = 0; i < config.phases.length; i++) {
    const phase = config.phases[i]
    if (!phase.id || !phase.type || !phase.prompt || !phase.inputType) {
      console.error(`Phase ${i} (${phase.id || 'unknown'}) validation failed:`, {
        hasId: !!phase.id,
        hasType: !!phase.type,
        hasPrompt: !!phase.prompt,
        hasInputType: !!phase.inputType
      })
      return false
    }
  }
  
  return true
}

/**
 * Get default wizard configurations
 */
function getDefaultWizards(): WizardConfig[] {
  return [
    {
      id: 'website-refresh',
      name: 'Website Refresh Wizard',
      description: 'Analyze and refresh your website with AI-powered improvements',
      icon: '🔄',
      category: 'project',
      version: '1.0.0',
      phases: [
        {
          id: 'intro',
          name: 'Introduction',
          type: 'question',
          prompt: 'Welcome to the Website Refresh Wizard! I\'ll help you analyze and improve your website. What\'s the URL of the website you\'d like to refresh?',
          inputType: 'url',
          validation: {
            required: true,
            url: true,
            message: 'Please enter a valid URL starting with http:// or https://'
          }
        },
        {
          id: 'analysis',
          name: 'Analysis',
          type: 'analysis',
          prompt: 'Analyzing your website for compliance, performance, and improvements...',
          inputType: 'text',
          aiConfig: {
            enabled: true,
            analysisType: 'website',
            model: 'gpt-4-turbo-preview'
          }
        },
        {
          id: 'improvements',
          name: 'Select Improvements',
          type: 'selection',
          prompt: 'Based on the analysis, which improvements would you like to implement?',
          inputType: 'checkboxes',
          options: [
            {
              id: 'compliance',
              label: 'Fix EAA/WCAG compliance issues',
              value: 'compliance',
              icon: '♿'
            },
            {
              id: 'performance',
              label: 'Improve site performance',
              value: 'performance',
              icon: '🚀'
            },
            {
              id: 'mobile',
              label: 'Enhance mobile experience',
              value: 'mobile',
              icon: '📱'
            },
            {
              id: 'seo',
              label: 'Optimize for search engines',
              value: 'seo',
              icon: '🔍'
            },
            {
              id: 'design',
              label: 'Modernize design',
              value: 'design',
              icon: '🎨'
            }
          ]
        },
        {
          id: 'style',
          name: 'Choose Style',
          type: 'selection',
          prompt: 'Select a style direction for your refreshed website:',
          inputType: 'grid',
          options: [
            {
              id: 'minimal',
              label: 'Minimal & Clean',
              value: 'minimal',
              icon: '⚪',
              metadata: {
                primary: '#000000',
                secondary: '#FFFFFF',
                accent: '#0066CC'
              }
            },
            {
              id: 'bold',
              label: 'Bold & Vibrant',
              value: 'bold',
              icon: '🔴',
              metadata: {
                primary: '#FF0066',
                secondary: '#000000',
                accent: '#FFCC00'
              }
            },
            {
              id: 'elegant',
              label: 'Elegant & Sophisticated',
              value: 'elegant',
              icon: '👑',
              metadata: {
                primary: '#2C3E50',
                secondary: '#ECF0F1',
                accent: '#E74C3C'
              }
            },
            {
              id: 'playful',
              label: 'Playful & Fun',
              value: 'playful',
              icon: '🎨',
              metadata: {
                primary: '#9B59B6',
                secondary: '#3498DB',
                accent: '#F39C12'
              }
            }
          ]
        },
        {
          id: 'review',
          name: 'Review & Generate',
          type: 'review',
          prompt: 'Great! Here\'s a summary of your website refresh plan. Ready to generate your new website?',
          inputType: 'text'
        }
      ],
      outputs: [
        {
          id: 'website',
          name: 'Refreshed Website',
          type: 'code',
          files: [
            {
              path: 'index.html',
              template: 'website-template.html'
            },
            {
              path: 'styles.css',
              template: 'website-styles.css'
            },
            {
              path: 'script.js',
              template: 'website-script.js'
            }
          ]
        }
      ],
      settings: {
        allowBackNavigation: true,
        saveProgress: true,
        estimatedTime: 10
      }
    },
    {
      id: 'project-discovery',
      name: 'Project Discovery Wizard',
      description: 'Transform your idea into a complete project plan',
      icon: '🚀',
      category: 'project',
      version: '1.0.0',
      phases: [
        {
          id: 'project-name',
          name: 'Project Name',
          type: 'question',
          prompt: 'What would you like to name your project?',
          helpText: 'Choose a memorable name for your project',
          inputType: 'text',
          validation: {
            required: true,
            pattern: '^[a-zA-Z0-9-_]+$',
            message: 'Project name can only contain letters, numbers, hyphens, and underscores'
          }
        },
        {
          id: 'project-type',
          name: 'Project Type',
          type: 'selection',
          prompt: 'What type of application are you building?',
          inputType: 'radio',
          options: [
            {
              id: 'ecommerce',
              label: 'E-commerce Platform',
              value: 'ecommerce',
              icon: '🛒',
              branchTo: 'ecommerce-features'
            },
            {
              id: 'saas',
              label: 'SaaS Application',
              value: 'saas',
              icon: '📊',
              branchTo: 'saas-features'
            },
            {
              id: 'social',
              label: 'Social Platform',
              value: 'social',
              icon: '👥',
              branchTo: 'social-features'
            },
            {
              id: 'blog',
              label: 'Blog/Content Site',
              value: 'blog',
              icon: '📝',
              branchTo: 'blog-features'
            }
          ]
        },
        {
          id: 'project-description',
          name: 'Project Description',
          type: 'question',
          prompt: 'Describe your vision in a few sentences. What problem does it solve?',
          inputType: 'textarea',
          validation: {
            required: true,
            minLength: 20,
            message: 'Please provide at least 20 characters to describe your project'
          },
          aiConfig: {
            enabled: true,
            model: 'gpt-3.5-turbo',
            systemPrompt: 'Extract key features and requirements from the project description'
          }
        }
      ],
      outputs: [
        {
          id: 'project-plan',
          name: 'Project Plan',
          type: 'documentation',
          files: [
            {
              path: 'README.md',
              generator: 'generateProjectReadme'
            },
            {
              path: 'project-plan.md',
              generator: 'generateProjectPlan'
            }
          ]
        }
      ]
    },
    {
      id: 'component-generator',
      name: 'Component Generator Wizard',
      description: 'Create production-ready Vue components with best practices',
      icon: '🧩',
      category: 'component',
      version: '1.0.0',
      phases: [
        {
          id: 'component-name',
          name: 'Component Name',
          type: 'question',
          prompt: 'What would you like to name your component?',
          helpText: 'Use PascalCase (e.g., MyButton, UserCard)',
          inputType: 'text',
          validation: {
            required: true,
            pattern: '^[A-Z][a-zA-Z0-9]*$',
            message: 'Component name must be in PascalCase'
          }
        },
        {
          id: 'component-type',
          name: 'Component Type',
          type: 'selection',
          prompt: 'What type of component are you building?',
          inputType: 'radio',
          options: [
            { id: 'base', label: 'Base Component', value: 'base', icon: '🔧' },
            { id: 'form', label: 'Form Component', value: 'form', icon: '📝' },
            { id: 'layout', label: 'Layout Component', value: 'layout', icon: '📐' },
            { id: 'data', label: 'Data Display', value: 'data', icon: '📊' }
          ]
        }
      ],
      outputs: [
        {
          id: 'component',
          name: 'Vue Component',
          type: 'code',
          files: [
            {
              path: 'components/{{componentType}}/{{componentName}}.vue',
              generator: 'generateVueComponent'
            }
          ]
        }
      ]
    },
    {
      id: 'flexfluencer',
      name: 'Become a Flexfluencer',
      description: 'Join our influencer program and earn money by promoting apps',
      icon: '💰',
      category: 'project' as const,
      version: '1.0.0',
      phases: [
        {
          id: 'welcome',
          name: 'Welcome',
          type: 'question',
          prompt: 'Welcome to the Flexfluencer Program! 🚀\n\nAs a Flexfluencer, you\'ll earn money by promoting amazing apps built by our community.\n\nLet\'s start with your name. What should we call you?',
          inputType: 'text',
          validation: {
            required: true,
            minLength: 2,
            message: 'Please enter your name'
          }
        },
        {
          id: 'contact',
          name: 'Contact Information',
          type: 'form' as const,
          prompt: 'Almost done! We just need your contact information.\n\nThis is how we\'ll reach out about opportunities and send your earnings.',
          inputType: 'form',
          inputs: [
            {
              id: 'email',
              label: 'Email Address',
              type: 'email',
              validation: {
                required: true,
                email: true,
                message: 'Please enter a valid email'
              }
            },
            {
              id: 'phone',
              label: 'Phone Number (Optional)',
              type: 'tel',
              validation: {
                required: false,
                pattern: '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$',
                message: 'Please enter a valid phone number'
              }
            },
            {
              id: 'paypal',
              label: 'PayPal Email (for payments)',
              type: 'email',
              validation: {
                required: true,
                email: true,
                message: 'Please enter your PayPal email'
              }
            }
          ]
        }
      ],
      outputs: []
    }
  ]
}

/**
 * Clear the wizard cache (useful for development)
 */
export function clearWizardCache(): void {
  wizardCache.clear()
}