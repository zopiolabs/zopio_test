
// lib/clerk-adapter.ts
import { clerkClient } from '@clerk/clerk-sdk-node'

export async function createApiKey(userId: string, name: string, scopes: string[], expiration: string) {
  // Creates a new Clerk API Key
  const response = await fetch('https://api.clerk.com/v1/api_keys', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      user_id: userId,
      scopes,
      expiration,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Clerk API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}
