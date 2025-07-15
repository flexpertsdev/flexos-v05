import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }

  const supabase = await serverSupabaseServiceRole(event)
  const user = await serverSupabaseUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // Verify user has access to this project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()
  
  if (projectError || !project) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied to this project'
    })
  }

  if (event.node.req.method === 'GET') {
    // Get messages for the project
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    return { data }
  }
  
  if (event.node.req.method === 'POST') {
    // Create new message
    const body = await readBody(event)
    
    const messageData = {
      ...body,
      project_id: projectId,
      user_id: user.id,
      created_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single()
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    return { data }
  }
  
  if (event.node.req.method === 'PUT') {
    // Update message
    const body = await readBody(event)
    const { id, ...updateData } = body
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message ID is required for updates'
      })
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .select()
      .single()
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    return { data }
  }
  
  if (event.node.req.method === 'DELETE') {
    // Delete all messages for a project (clear chat)
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', user.id)
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    return { success: true }
  }
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})