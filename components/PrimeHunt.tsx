'use client';
import React, { useEffect, useState, useRef } from 'react';

const GRID_SIZE = 5;

const isPrime = (num: number) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) if (num % i === 0) return false;
  return true;
};

type Pos = { row: number; col: number };

const PrimeHunt = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [path, setPath] = useState<Pos[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [seed, setSeed] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/grid')
      .then(res => res.json())
      .then(data => {
        setGrid(data.grid);
        setSeed(data.seed);
      });
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

  const currentNum = path.map(p => grid[p.row][p.col]).join('');
  const currentIsPrime = isPrime(parseInt(currentNum || '0'));

  // Convert grid cell position to pixel center
  const getCenterOfCell = (row: number, col: number) => {
    const cellSize = 64; // Tailwind w-16 h-16 = 4rem = 64px
    return {
      x: col * (cellSize + 4) + cellSize / 2,
      y: row * (cellSize + 4) + cellSize / 2,
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <h1 className="text-2xl font-bold mb-4">Prime Hunt</h1>

      <div
        className="relative"
        ref={containerRef}
        onPointerUp={handlePointerUp}
        style={{
          width: GRID_SIZE * 68, // 64px + 4px gap
          height: GRID_SIZE * 68,
        }}
      >
        {/* SVG for trace line */}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={GRID_SIZE * 68}
          height={GRID_SIZE * 68}
        >
          {path.length >= 2 &&
            path.map((p, i) => {
              if (i === 0) return null;
              const from = getCenterOfCell(path[i - 1].row, path[i - 1].col);
              const to = getCenterOfCell(p.row, p.col);
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#4b5563"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              );
            })}
        </svg>

        {/* Grid */}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 4rem)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 4rem)`,
          }}
        >
          {grid.map((row, i) =>
            row.map((val, j) => {
              const inPath = isInPath(i, j);
              const bg =
                inPath && path.length > 0
                  ? currentIsPrime
                    ? 'bg-green-200'
                    : 'bg-red-200'
                  : 'bg-white';
              return (
                <div
                  key={`${i}-${j}`}
                  onPointerDown={() => handlePointerDown(i, j)}
                  onPointerEnter={(e) => {
                    if (e.buttons === 1) handlePointerEnter(i, j);
                  }}
                  className={`w-16 h-16 flex items-center justify-center text-2xl font-mono border ${bg}`}
                >
                  {val}
                </div>
              );
            })
          )}
        </div>
      </div>

      {path.length > 0 && (
        <div className="mt-4 text-xl font-mono">
          Number: {currentNum}{' '}
          {currentNum && (
            <span className={currentIsPrime ? 'text-green-600' : 'text-red-600'}>
              ({currentIsPrime ? 'Prime' : 'Not Prime'})
            </span>
          )}
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
