import { NextResponse } from 'next/server';
import { generateGridForDate } from '@/lib/prime-cut';

export async function GET() {
  const today = new Date().toISOString().slice(0, 10); // e.g. "2025-07-21"
  const grid = generateGridForDate(today);
  return NextResponse.json({ date: today, grid });
}
