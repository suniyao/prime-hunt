
// Check if number is prime (simple, efficient enough for 1-100)
export function isPrime(num: number): boolean {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Generate a deterministic random number generator based on seed string
// Source: https://github.com/davidbau/seedrandom (simplified)
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function seededRandom(seed: string) {
  const rand = xmur3(seed);
  return () => rand() / 0xFFFFFFFF;
}

// Generate NxN grid of numbers 1-9 using seeded RNG
export function generateGridForDate(seed: string, N = 5): number[][] {
  const rand = seededRandom(seed);
  const grid: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      row.push(1 + Math.floor(rand() * 9)); // 1-9
    }
    grid.push(row);
  }
  return grid;
}