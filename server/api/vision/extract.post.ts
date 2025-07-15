import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { BlueprintUpdate, ExtractedAction, ExtractedDataType, ExtractedView } from '~/types/blueprint'

// Request validation
const extractRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })),
  projectId: z.string().uuid(),
  currentBlueprint: z.any().optional()
})

export default defineEventHandler(async (event) => {
  // Validate request
  const body = await readValidatedBody(event, extractRequestSchema.parse)
  
  // Get user from session (simplified for now)
  // TODO: Implement proper auth
  const user = { id: 'temp-user-id' }
  
  // Initialize Anthropic
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!
  })
  
  // Prepare conversation context
  const conversationText = body.messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n\n')
  
  // Create extraction prompt
  const systemPrompt = `You are an expert at analyzing conversations about app ideas and extracting concrete, actionable information for building the app.

Your task is to extract:
1. ACTIONS - What users DO in the app (verbs like SELECT, CREATE, SHARE, etc.)
2. DATA - What information the app works with (stored, computed, external, static, state)
3. VIEWS - The different screens/interfaces and their purposes
4. WORKFLOWS - Sequences of actions that accomplish goals

Focus on being specific and practical. Extract actual functionality, not vague concepts.

Return a JSON object with this structure:
{
  "actions": [
    {
      "verb": "SELECT",
      "target": "Photo",
      "description": "User selects one or more photos",
      "contexts": ["PhotoGridView", "AlbumView"],
      "effects": ["Updates selection state", "Enables bulk actions"]
    }
  ],
  "dataTypes": [
    {
      "name": "Photo",
      "category": "stored",
      "operations": ["create", "read", "update", "delete"],
      "relationships": ["belongs to User", "belongs to Album"]
    }
  ],
  "views": [
    {
      "name": "PhotoGridView",
      "purpose": "Browse and select photos",
      "actions": ["SELECT", "DELETE", "SHARE"],
      "variants": ["BrowseMode", "SelectMode"],
      "flexVue": "full-page"
    }
  ],
  "workflows": [
    {
      "name": "SharePhotosFlow",
      "steps": ["SELECT photos", "CREATE album", "GENERATE link", "SHARE link"]
    }
  ],
  "insights": {
    "coreFeatures": ["Photo management", "Sharing system"],
    "userGoals": ["Share photos easily", "Organize collections"],
    "technicalNeeds": ["Image storage", "Link generation"]
  }
}`

  const userPrompt = `Analyze this conversation about an app idea and extract the actions, data, views, and workflows:

${conversationText}

Remember to:
- Focus on VERBS for actions (what users DO)
- Identify all types of data (stored, computed, external, static, state)
- Name views based on their purpose
- Map out complete workflows from start to finish
- Be specific and practical`

  try {
    // Call Anthropic for extraction
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Fast model for extraction
      max_tokens: 4000,
      temperature: 0.3, // Lower temperature for consistency
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
    
    // Parse the response
    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/{[\s\S]*}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    const extracted = JSON.parse(jsonMatch[1] || jsonMatch[0])
    
    // Process and enhance extracted data
    const blueprintUpdate: BlueprintUpdate = {
      actions: extracted.actions?.map((action: any) => ({
        verb: action.verb,
        target: action.target,
        description: action.description,
        contexts: action.contexts || [],
        effects: action.effects?.map((e: string) => ({
          type: 'data-change',
          description: e
        })) || []
      })),
      
      dataTypes: extracted.dataTypes?.map((data: any) => ({
        name: data.name,
        category: data.category || 'stored',
        operations: data.operations || ['read'],
        relationships: data.relationships?.map((r: string) => {
          const [relation, target] = r.split(' to ')
          return {
            type: relation.includes('many') ? 'one-to-many' : 'one-to-one',
            target: target || r
          }
        }) || []
      })),
      
      views: extracted.views?.map((view: any) => ({
        name: view.name,
        purpose: view.purpose,
        actions: view.actions || [],
        variants: view.variants?.map((v: string) => ({
          id: v.toLowerCase().replace(/\s+/g, '-'),
          name: v,
          description: `${v} variant of ${view.name}`
        })) || [],
        flexVue: view.flexVue || 'full-page'
      })),
      
      workflows: extracted.workflows?.map((workflow: any) => ({
        id: workflow.name.toLowerCase().replace(/\s+/g, '-'),
        name: workflow.name,
        description: `Workflow for ${workflow.name}`,
        steps: workflow.steps?.map((step: string, index: number) => ({
          action: step,
          next: index < workflow.steps.length - 1 ? [workflow.steps[index + 1]] : []
        })) || []
      }))
    }
    
    // Get service role client for server-side operations
    const supabase = await serverSupabaseServiceRole(event)
    
    // Update or create vision document with new structure
    const { data: visionDoc, error: visionError } = await supabase
      .from('vision_documents')
      .upsert({
        project_id: body.projectId,
        user_id: user.id,
        // Store blueprint data in JSONB columns
        blueprint_actions: blueprintUpdate.actions || [],
        blueprint_data: blueprintUpdate.dataTypes || [],
        blueprint_views: blueprintUpdate.views || [],
        blueprint_workflows: blueprintUpdate.workflows || [],
        // Store insights
        core_features: extracted.insights?.coreFeatures || [],
        user_goals: extracted.insights?.userGoals || [],
        technical_needs: extracted.insights?.technicalNeeds || [],
        // Update metadata
        last_extracted: new Date().toISOString(),
        extraction_version: 2
      }, {
        onConflict: 'project_id'
      })
      .select()
      .single()
    
    if (visionError) throw visionError
    
    // Calculate completeness
    const completeness = calculateCompleteness(blueprintUpdate)
    
    return {
      success: true,
      extraction: blueprintUpdate,
      insights: extracted.insights,
      completeness,
      visionDocId: visionDoc.id
    }
    
  } catch (error) {
    console.error('Vision extraction error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to extract vision',
      data: error
    })
  }
})

function calculateCompleteness(blueprint: BlueprintUpdate): number {
  const scores = {
    actions: Math.min((blueprint.actions?.length || 0) / 10, 1) * 100,
    data: Math.min((blueprint.dataTypes?.length || 0) / 8, 1) * 100,
    views: Math.min((blueprint.views?.length || 0) / 6, 1) * 100,
    workflows: Math.min((blueprint.workflows?.length || 0) / 4, 1) * 100
  }
  
  return Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4)
}