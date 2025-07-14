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

  if (event.node.req.method === 'GET') {
    // Get vision document
    const { data, error } = await supabase
      .from('vision_documents')
      .select('*')
      .eq('project_id', projectId)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
    
    // If no vision document exists, create a default one
    if (!data) {
      const { data: newVision, error: insertError } = await supabase
        .from('vision_documents')
        .insert({
          project_id: projectId,
          user_id: user.id
        })
        .select()
        .single()
      
      if (insertError) {
        throw createError({
          statusCode: 500,
          statusMessage: insertError.message
        })
      }
      
      return { data: newVision }
    }
    
    return { data }
  }
  
  if (event.node.req.method === 'PUT') {
    // Update vision document
    const body = await readBody(event)
    
    const { data, error } = await supabase
      .from('vision_documents')
      .upsert({
        ...body,
        project_id: projectId,
        user_id: user.id,
        version: body.version + 1,
        last_updated: new Date().toISOString()
      })
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
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
