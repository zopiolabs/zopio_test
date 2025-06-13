// apiKeyAuthMiddleware.ts
import { validateApiKey } from '@repo/api-key'

export async function apiKeyAuthMiddleware(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  try {
    const userId = await validateApiKey(token)
    // Inject user id
    req.user = { id: userId }
    return req
  } catch {
    return new Response('Invalid API Key', { status: 403 })
  }
}
