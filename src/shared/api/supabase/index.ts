// Client-side exports
export { createClient } from './client'

// Server-side exports (for route handlers and server components)
export { createServerClientForRoute } from './server-route'
// Note: createServerClientRSC should be imported directly from './server-rsc' 
// to avoid bundling next/headers in client components
