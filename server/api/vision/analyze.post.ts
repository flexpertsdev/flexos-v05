import { serverSupabaseServiceRole } from '#supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default defineEventHandler(async (event) => {
  // Get service role client for server-side operations
  const supabase = await serverSupabaseServiceRole(event)
  
  const { projectId } = await readBody(event)
  
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }

  try {
    // 1. Fetch all messages from the project
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('content, role')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (messagesError) throw messagesError

    if (!messages || messages.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No messages found for this project'
      })
    }

    // 2. Get existing vision if any
    const { data: existingVision } = await supabase
      .from('project_visions')
      .select('*')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    // 3. Prepare conversation context
    const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')

    // 4. Use AI to analyze and extract vision
    const systemPrompt = `You are an expert product strategist and vision extractor. Your job is to analyze conversations about project ideas and extract a comprehensive, actionable vision document.

    ${existingVision ? `Current vision document:
    ${JSON.stringify(existingVision, null, 2)}
    
    Build upon this existing vision with new insights from the conversation.` : 'This is the first analysis - create a comprehensive vision from scratch.'}

    Return a JSON object with these fields:
    {
      "project_name": "Clear, memorable project name",
      "tagline": "One-line description that captures the essence",
      "description": "2-3 paragraph description of what this is and why it matters",
      "objectives": ["Clear, measurable objectives"],
      "target_audience": {
        "primary": "Primary user group description",
        "secondary": "Secondary user group (if applicable)",
        "characteristics": ["Key characteristics of target users"]
      },
      "problems": ["Specific problems being solved"],
      "solutions": ["How the product solves each problem"],
      "features": {
        "core": ["Must-have features for MVP"],
        "nice_to_have": ["Future features to consider"]
      },
      "user_journeys": [
        {
          "persona": "User type",
          "goal": "What they want to achieve",
          "steps": ["Step 1", "Step 2", "..."]
        }
      ],
      "design_principles": ["Key design principles"],
      "brand_personality": ["Brand personality traits"],
      "ui_style": {
        "tone": "Visual tone (modern, playful, professional, etc.)",
        "colors": ["#HEX colors if mentioned"],
        "inspiration": ["Design inspirations mentioned"]
      },
      "success_metrics": ["How success will be measured"],
      "value_proposition": "Clear value prop in 1-2 sentences",
      "ai_insights": "Your analysis of the project's potential and key considerations",
      "questions_for_user": ["3-5 probing questions to clarify vision further"],
      "readiness_score": 0-100 (how ready this vision is to start building)
    }

    Be thoughtful and extract meaningful insights, not just repeat what was said. Ask probing questions that will help the user think deeper about their project.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this project conversation:\n\n${conversation}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })

    const visionData = JSON.parse(completion.choices[0].message.content!)

    // 5. Save or update vision document
    const visionRecord = {
      project_id: projectId,
      version: (existingVision?.version || 0) + 1,
      status: 'ready',
      ...visionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: savedVision, error: saveError } = await supabase
      .from('project_visions')
      .insert(visionRecord)
      .select()
      .single()

    if (saveError) throw saveError

    return {
      success: true,
      vision: savedVision
    }

  } catch (error) {
    console.error('Vision analysis error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to analyze conversation'
    })
  }
})
