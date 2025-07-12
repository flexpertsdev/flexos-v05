/// <reference types="nitropack" />

declare global {
  const defineEventHandler: typeof import('h3')['defineEventHandler']
  const getRouterParam: typeof import('h3')['getRouterParam']
  const readBody: typeof import('h3')['readBody']
  const useRuntimeConfig: typeof import('nitropack')['useRuntimeConfig']
}

export {}