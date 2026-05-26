import { NextResponse } from 'next/server'

export function apiError(status: number, message: string, details?: unknown) {
  return NextResponse.json(
    { error: message, details },
    { status }
  )
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}
