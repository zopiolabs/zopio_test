
import { NextRequest, NextResponse } from 'next/server'
import { apiKeyAuthMiddleware } from '@repo/auth'

export async function GET(req: NextRequest) {
  const validatedReq = await apiKeyAuthMiddleware(req)
  if (validatedReq instanceof Response) return validatedReq

  const userId = (validatedReq as any).user?.id || 'unknown'

  return NextResponse.json({
    message: 'Private API key-protected endpoint',
    user: userId,
    timestamp: new Date().toISOString(),
  })
}
