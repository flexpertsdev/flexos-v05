import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default defineEventHandler(async (event) => {
  const { projectId, visionId, type } = await readBody(event)
  
  if (!projectId || !visionId || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters'
    })
  }

  try {
    // 1. Get the vision document
    const { data: vision, error: visionError } = await supabase
      .from('project_visions')
      .select('*')
      .eq('id', visionId)
      .single()

    if (visionError || !vision) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Vision document not found'
      })
    }

    // 2. Update vision status
    await supabase
      .from('project_visions')
      .update({ status: 'generating' })
      .eq('id', visionId)

    // 3. Generate based on type
    let systemPrompt = ''
    let tableName = ''
    
    switch (type) {
      case 'features':
        systemPrompt = `You are a product manager. Based on the vision document, create detailed feature specifications.
        
        For each feature, provide:
        {
          "name": "Feature name",
          "description": "Detailed description",
          "user_story": "As a [user], I want to [action] so that [benefit]",
          "acceptance_criteria": ["Criterion 1", "Criterion 2"],
          "priority": "high|medium|low",
          "effort": "small|medium|large",
          "category": "core|enhancement|infrastructure",
          "dependencies": ["Other feature names"],
          "mockup_suggestions": "Visual/UX suggestions"
        }
        
        Return an array of features ordered by priority.`
        tableName = 'features'
        break
        
      case 'pages':
        systemPrompt = `You are a UX architect. Based on the vision document, design the page structure.
        
        For each page, provide:
        {
          "name": "Page name",
          "route": "/route-path",
          "description": "What this page does",
          "key_elements": ["Element 1", "Element 2"],
          "user_actions": ["Action 1", "Action 2"],
          "data_requirements": ["Data needed"],
          "navigation": {
            "parent": "Parent page name or null",
            "children": ["Child page names"]
          },
          "access_control": "public|authenticated|admin",
          "seo_notes": "SEO considerations"
        }
        
        Return an array of pages forming a complete site structure.`
        tableName = 'pages'
        break
        
      case 'journeys':
        systemPrompt = `You are a UX researcher. Based on the vision document, create detailed user journeys.
        
        For each journey, provide:
        {
          "title": "Journey title",
          "persona": "User persona name",
          "scenario": "Context and starting point",
          "goal": "What the user wants to achieve",
          "steps": [
            {
              "action": "What the user does",
              "page": "Which page/screen",
              "thoughts": "What they're thinking",
              "emotions": "How they feel",
              "pain_points": "Potential issues"
            }
          ],
          "success_metrics": ["How we measure success"],
          "opportunities": ["Improvement opportunities"]
        }
        
        Return an array of comprehensive user journeys.`
        tableName = 'user_journeys'
        break
        
      case 'mockups':
        systemPrompt = `You are a UI/UX designer. Based on the vision document, create mockup specifications.
        
        For each mockup, provide:
        {
          "name": "Mockup name",
          "type": "page|component|flow",
          "description": "What this shows",
          "layout": {
            "structure": "Description of layout structure",
            "sections": ["Section descriptions"],
            "responsive_notes": "How it adapts to different screens"
          },
          "visual_style": {
            "colors": ["Primary colors to use"],
            "typography": "Font suggestions",
            "spacing": "Spacing approach",
            "imagery": "Image/icon style"
          },
          "interactions": ["Key interactions"],
          "components": ["Reusable components needed"],
          "ascii_wireframe": "Simple ASCII representation"
        }
        
        Return an array of mockup specifications.`
        tableName = 'mockups'
        break
        
      default:
        throw new Error('Invalid generation type')
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Vision document:\n${JSON.stringify(vision, null, 2)}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8
    })

    const generatedItems = JSON.parse(completion.choices[0].message.content!)

    // 4. Save generated items
    if (Array.isArray(generatedItems)) {
      const itemsToInsert = generatedItems.map(item => ({
        ...item,
        project_id: projectId,
        vision_id: visionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from(tableName)
        .insert(itemsToInsert)

      if (insertError) throw insertError
    }

    // 5. Update vision status back to ready
    await supabase
      .from('project_visions')
      .update({ status: 'ready' })
      .eq('id', visionId)

    return {
      success: true,
      generated: generatedItems.length,
      type
    }

  } catch (error) {
    console.error('Generation error:', error)
    
    // Reset vision status on error
    await supabase
      .from('project_visions')
      .update({ status: 'ready' })
      .eq('id', visionId)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate artifacts'
    })
  }
})
