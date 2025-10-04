import { NextResponse } from 'next/server';
export async function PATCH() {
  return NextResponse.json({
    deprecated: true,
    message: 'Negotiations have been removed. Use lease draft PATCH actions instead.'
  }, { status: 410 });
}