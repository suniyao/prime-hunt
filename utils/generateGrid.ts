// lib/generateGrid.ts
var seedrandom = require('seedrandom');

export function generateGridForDate(dateString: string) {
  const rng = seedrandom(dateString);
  const grid = [];

  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      row.push(Math.floor(rng() * 10));  // digits 0–9
    }
    grid.push(row);
  }

  return grid;
}
