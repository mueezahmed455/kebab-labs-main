import { NextResponse } from 'next/server'

export function apiError(status: number, message: string, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV !== 'production' && details !== undefined ? { details } : {}),
    },
    { status }
  )
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}
