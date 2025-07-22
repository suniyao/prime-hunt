'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const isPrime = (num: number) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) if (num % i === 0) return false;
  return true;
};

type Pos = { row: number; col: number };

const PrimeHunt = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [gridSize, setGridSize] = useState<number>(NaN);
  const [seed, setSeed] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [path, setPath] = useState<Pos[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/grid')
      .then(res => res.json())
      .then(data => {
        setGrid(data.grid);
        setSeed(data.seed);
        setGridSize(data.GRID_SIZE);
      });
  }, []);

  if (isNaN(gridSize)) {
    return <div>Loading...</div>; // optional
  }

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < gridSize && c < gridSize;

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

  const currentNumStr = path.map(p => grid[p.row][p.col]).join('');
  const currentNum = parseInt(currentNumStr, 10);
  const isCurrentPrime = isPrime(currentNum);
  const isDuplicate = found.has(currentNumStr);

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
          width: gridSize * 68,
          height: gridSize * 68,
        }}
      >
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={gridSize * 68}
          height={gridSize * 68}
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
            gridTemplateColumns: `repeat(${gridSize}, 4rem)`,
            gridTemplateRows: `repeat(${gridSize}, 4rem)`,
          }}
        >
          {grid.map((row, i) =>
            row.map((val, j) => {
              const inPath = isInPath(i, j);
              const bg =
                inPath && path.length > 0
                  ? isCurrentPrime
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
                  className={clsx(
                    'w-16 h-16 flex items-center justify-center text-2xl font-mono border',
                    isInPath(i, j) &&
                      (isDuplicate
                        ? 'bg-yellow-200'
                        : isCurrentPrime
                        ? 'bg-green-200'
                        : 'bg-red-200'),
                    !isInPath(i, j) && 'bg-white',
                    found.has(`${grid[i][j]}`) && 'opacity-50'
                  )}
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
            <span className={isCurrentPrime ? 'text-green-600' : 'text-red-600'}>
              ({isCurrentPrime ? 'Prime' : 'Not Prime'})
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
