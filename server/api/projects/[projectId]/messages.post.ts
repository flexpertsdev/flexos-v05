import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseServiceRole(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }
  
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.role || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role and content are required'
    })
  }
  
  try {
    // First, ensure user owns the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()
    
    if (projectError || !project) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
      })
    }
    
    // Create or get chat session
    let chatId = body.chat_id
    
    if (!chatId) {
      // Create new chat session
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({
          project_id: projectId,
          user_id: user.id,
          title: 'Builder Chat',
          mode: body.context_mode || 'builder'
        })
        .select()
        .single()
      
      if (chatError) throw chatError
      chatId = chat.id
    }
    
    // Insert message
    const messageData = {
      chat_id: chatId,
      project_id: projectId,
      user_id: user.id,
      role: body.role,
      content: body.content,
      context_mode: body.context_mode || 'builder',
      message_type: body.message_type || 'text',
      message_data: body.message_data || {},
      contexts: body.contexts || [],
      created_entities: body.created_entities || [],
      suggested_actions: body.suggested_actions || []
    }
    
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single()
    
    if (messageError) throw messageError
    
    return {
      success: true,
      message,
      chat_id: chatId
    }
    
  } catch (error: any) {
    console.error('Message creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to save message'
    })
  }
})