import type { Database } from '~/types/database'

// Type-safe update helper to avoid 'never' type errors
export function createTypedUpdate<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  return <K extends keyof Database['public']['Tables'][T]['Update']>(
    data: Pick<Database['public']['Tables'][T]['Update'], K>
  ): Pick<Database['public']['Tables'][T]['Update'], K> => {
    return data
  }
}

// Type-safe upsert helper
export function createTypedUpsert<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  return (
    data: Database['public']['Tables'][T]['Insert']
  ): Database['public']['Tables'][T]['Insert'] => {
    return data
  }
}

// Helper to fix type inference issues
export function asUpdateData<T extends Record<string, any>>(data: T): T {
  return data
}

export function asInsertData<T extends Record<string, any>>(data: T): T {
  return data
}