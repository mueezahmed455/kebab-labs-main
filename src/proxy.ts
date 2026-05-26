import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const MAX_BODY_BYTES = 102_400 // 100KB

export async function proxy(request: NextRequest) {
  // Reject oversized request bodies early
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const cl = request.headers.get('content-length')
    if (cl && parseInt(cl, 10) > MAX_BODY_BYTES) {
      return new NextResponse('Request too large', { status: 413 })
    }
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|og-image.jpg|api/payments/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
