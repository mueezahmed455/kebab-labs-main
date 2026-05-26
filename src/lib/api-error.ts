import { NextResponse } from 'next/server'

export function apiError(status: number, message: string, details?: unknown) {
  const body: Record<string, unknown> = { error: message }
  if (details && process.env.NODE_ENV !== 'production') {
    body.details = details
  }
  return NextResponse.json(body, { status })
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}
