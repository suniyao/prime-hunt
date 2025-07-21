'use client';
import React, { useEffect, useState } from 'react';
var seedrandom = require('seedrandom')

const GRID_SIZE = 4;
const today = new Date();
const seed = today.toISOString().slice(0, 10); // gives "YYYY-MM-DD"
// seed to "2025-07-21"

const isPrime = (num: number) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++)
    if (num % i === 0) return false;
  return true;
};

const generateGrid = () => {
  const rng = seedrandom(seed);
  const grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push(Math.floor(rng() * 10));
    }
    grid.push(row);
  }
  return grid;
};

const PrimeHunt = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [path, setPath] = useState<{ row: number; col: number }[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());

  useEffect(() => {
    setGrid(generateGrid());
  }, []);

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < GRID_SIZE && c < GRID_SIZE;

  const isAdjacent = (r: number, c: number) => {
    if (path.length === 0) return true;
    const last = path[path.length - 1];
    return Math.abs(last.row - r) <= 1 && Math.abs(last.col - c) <= 1 && !(last.row === r && last.col === c);
  };

  const handlePointerDown = (r: number, c: number) => {
    setPath([{ row: r, col: c }]);
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (!isAdjacent(r, c)) return;
    if (path.find(p => p.row === r && p.col === c)) return;
    setPath(prev => [...prev, { row: r, col: c }]);
  };

  const handlePointerUp = () => {
    const numStr = path.map(p => grid[p.row][p.col]).join('');
    const num = parseInt(numStr, 10);
    if (isPrime(num)) {
      setFound(prev => new Set(prev).add(numStr));
      console.log('PRIME:', num);
    } else {
      console.log('Not prime:', num);
    }
    setPath([]);
  };

  const isInPath = (r: number, c: number) => path.some(p => p.row === r && p.col === c);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <h1 className="text-2xl font-bold mb-4">Prime Hunt</h1>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 4rem)` }}
        onPointerUp={handlePointerUp}
      >
        {grid.map((row, i) =>
          row.map((val, j) => (
            <div
              key={`${i}-${j}`}
              onPointerDown={() => handlePointerDown(i, j)}
              onPointerEnter={(e) => {
                if (e.buttons === 1) handlePointerEnter(i, j);
              }}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-mono border 
                ${isInPath(i, j) ? 'bg-blue-200' : 'bg-white'} 
                ${found.has(`${val}`) ? 'opacity-50' : ''}`}
            >
              {val}
            </div>
          ))
        )}
      </div>

      {path.length > 0 && (
        <div className="mt-4 text-xl font-mono">
          Number: {path.map(p => grid[p.row][p.col]).join('')}
        </div>
      )}

      {found.size > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Found Primes: {[...found].join(', ')}
        </div>
      )}
    </div>
  );
};

export default PrimeHunt;
