// app/api/prime-hunt/route.ts
import { NextResponse } from 'next/server'
var seedrandom = require('seedrandom')

function generateGrid(date: string, size = 4) {
  const rng = seedrandom(date)
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(rng() * 10))
  )
}

export async function GET() {
  const date = new Date().toISOString().slice(0, 10)
  const grid = generateGrid(date)
  return NextResponse.json({ date, grid })
}
