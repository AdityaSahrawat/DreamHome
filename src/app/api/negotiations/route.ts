// app/api/negotiations/route.ts
import {NextResponse } from 'next/server';
// Negotiations feature deprecated: endpoints now return 410 Gone.

export async function POST() {
  return NextResponse.json({
    deprecated: true,
    message: 'Negotiations have been removed. Use lease draft actions (client_accept, client_reject, assistant_update, manager_approve).'
  }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({
    deprecated: true,
    message: 'Negotiations have been removed; no data available.'
  }, { status: 410 });
}

// (safeJsonParse removed – replaced by inline JSON.parse guards in serializer)