import type { Database } from '~/types/database'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import { createError } from 'h3'

type Project = Database['public']['Tables']['projects']['Insert']

export default defineEventHandler(async (event) => {
  // Get authenticated user
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // Get wizard data from request body
  const body = await readBody(event)
  const { wizardAnswers } = body

  if (!wizardAnswers || !wizardAnswers.introduction) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid wizard data'
    })
  }

  // Extract project details from wizard answers
  const projectName = wizardAnswers.projectName || `${wizardAnswers.introduction}'s Project`
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) // Limit slug length

  // Build project metadata from wizard answers
  const metadata = {
    wizardAnswers,
    vision: {
      statement: wizardAnswers.vision || '',
      problem: wizardAnswers.problem || '',
      targetAudience: wizardAnswers.audience || '',
      uniqueValue: wizardAnswers.unique || ''
    },
    designSystem: {
      colors: {
        primary: { name: 'Primary', value: '#16C181' },
        secondary: { name: 'Secondary', value: '#3B82F6' }
      },
      typography: {
        fontFamily: 'Inter',
        baseSize: '16px'
      },
      theme: {
        mode: 'dark'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '50%'
      }
    },
    initialFocusSession: {
      task: 'Define Core Vision and Architecture',
      type: 'research',
      duration: 45 * 60 // 45 minutes
    }
  }

  // Create project
  const supabase = serverSupabaseServiceRole(event)
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: projectName,
      slug,
      description: wizardAnswers.excitement || 'A new FlexOS project',
      type: wizardAnswers.projectType || 'web-app',
      icon: wizardAnswers.projectIcon || '🚀',
      status: 'active',
      metadata
    } as Project)
    .select()
    .single()

  if (error) {
    // Handle duplicate slug
    if (error.code === '23505') {
      const timestampSlug = `${slug}-${Date.now().toString(36)}`
      const { data: retryProject, error: retryError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectName,
          slug: timestampSlug,
          description: wizardAnswers.excitement || 'A new FlexOS project',
          type: wizardAnswers.projectType || 'web-app',
          icon: wizardAnswers.projectIcon || '🚀',
          status: 'active',
          metadata
        } as Project)
        .select()
        .single()

      if (retryError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to create project'
        })
      }

      return {
        project: retryProject,
        focusMode: true
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  // Return project with focus mode flag
  return {
    project,
    focusMode: true
  }
})