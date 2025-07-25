import { NextResponse } from 'next/server';
var seedrandom = require('seedrandom')


export async function GET() {
  const GRID_SIZE = 4;
  // Dynamically generate seed from today's date
  const today = new Date();
  // const seed = '2025-07-04'
  const seed = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  // Seeded random number generator
  const rng = seedrandom(seed);

  // Generate a 5x5 grid of digits
  const grid: number[][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row: number[] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push(Math.floor(rng() * 10)); // random digit 0–9
    }
    grid.push(row);
  }

  return NextResponse.json({ grid, seed, GRID_SIZE });
}
