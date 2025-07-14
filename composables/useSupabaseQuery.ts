import type { Database } from '~/types/database'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

// Type-safe query builder
export class SupabaseQueryBuilder<T extends TableName> {
  private supabase = useSupabaseClient<Database>()
  private query: any
  
  constructor(private table: T) {
    this.query = this.supabase.from(table).select()
  }
  
  select(columns: (keyof Tables[T]['Row'])[] | '*' = '*') {
    const cols = columns === '*' ? '*' : columns.join(',')
    this.query = this.supabase.from(this.table).select(cols)
    return this
  }
  
  eq<K extends keyof Tables[T]['Row']>(
    column: K,
    value: Tables[T]['Row'][K]
  ) {
    this.query = this.query.eq(column, value)
    return this
  }
  
  neq<K extends keyof Tables[T]['Row']>(
    column: K,
    value: Tables[T]['Row'][K]
  ) {
    this.query = this.query.neq(column, value)
    return this
  }
  
  gt<K extends keyof Tables[T]['Row']>(
    column: K,
    value: Tables[T]['Row'][K]
  ) {
    this.query = this.query.gt(column, value)
    return this
  }
  
  gte<K extends keyof Tables[T]['Row']>(
    column: K,
    value: Tables[T]['Row'][K]
  ) {
    this.query = this.query.gte(column, value)
    return this
  }
  
  lt<K extends keyof Tables[T]['Row']>(
    column: K,
    value: Tables[T]['Row'][K]
  ) {
    this.query = this.query.lt(column, value)
    return this
  }
  
  lte<K extends keyof Tables[T]['Row']>(
    column: K,
    value: Tables[T]['Row'][K]
  ) {
    this.query = this.query.lte(column, value)
    return this
  }
  
  like<K extends keyof Tables[T]['Row']>(
    column: K,
    pattern: string
  ) {
    this.query = this.query.like(column, pattern)
    return this
  }
  
  ilike<K extends keyof Tables[T]['Row']>(
    column: K,
    pattern: string
  ) {
    this.query = this.query.ilike(column, pattern)
    return this
  }
  
  in<K extends keyof Tables[T]['Row']>(
    column: K,
    values: Tables[T]['Row'][K][]
  ) {
    this.query = this.query.in(column, values)
    return this
  }
  
  contains<K extends keyof Tables[T]['Row']>(
    column: K,
    value: any
  ) {
    this.query = this.query.contains(column, value)
    return this
  }
  
  order<K extends keyof Tables[T]['Row']>(
    column: K,
    options?: { ascending?: boolean; nullsFirst?: boolean }
  ) {
    this.query = this.query.order(column, options)
    return this
  }
  
  limit(count: number) {
    this.query = this.query.limit(count)
    return this
  }
  
  range(from: number, to: number) {
    this.query = this.query.range(from, to)
    return this
  }
  
  single() {
    this.query = this.query.single()
    return this
  }
  
  async execute(): Promise<{
    data: Tables[T]['Row'][] | Tables[T]['Row'] | null
    error: any
    count?: number
  }> {
    return await this.query
  }
  
  // Join helpers
  join<R extends TableName>(
    table: R,
    on: {
      from: keyof Tables[T]['Row']
      to: keyof Tables[R]['Row']
    }
  ) {
    // This would need more complex implementation
    // Just showing the pattern
    return this
  }
}

// Helper function to create query builder
export function useSupabaseQuery<T extends TableName>(table: T) {
  return new SupabaseQueryBuilder(table)
}

// Usage example:
// const { data, error } = await useSupabaseQuery('projects')
//   .eq('user_id', userId)
//   .eq('status', 'active')
//   .order('created_at', { ascending: false })
//   .limit(10)
//   .execute()
