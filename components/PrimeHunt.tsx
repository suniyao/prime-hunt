'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { getScore } from '@/utils/score';
import { isPrime } from '@/utils/isPrime';
import ScoreBar from './ScoreBar';
const correctSound = '/correct.mp3';

type Pos = { row: number; col: number };

const PrimeHunt = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [gridSize, setGridSize] = useState<number>(NaN);
  const [seed, setSeed] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [path, setPath] = useState<Pos[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [numOfPrimes, setNumOfPrimes] = useState<number>(0);
  const [justFoundPrime, setJustFoundPrime] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio(correctSound);
  }, [])

  useEffect(() => {
    if (justFoundPrime) {
      const timer = setTimeout(() => setJustFoundPrime(false), 800);
      return () => clearTimeout(timer);
    }
  }, [justFoundPrime]);

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
      if (!isDuplicate){
        setScore(score + getScore(numStr));
        setNumOfPrimes(numOfPrimes + 1);
        setJustFoundPrime(true);
        audioRef.current?.play();
      }
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
      <ScoreBar score={score} numOfPrimes={numOfPrimes}/>
      <h1 className="text-2xl font-bold mb-4">Prime Hunt</h1>
      <div className="mt-4 min-h-[3rem] text-xl transition-all duration-300">
      {currentNumStr ? (
        <div
          className={clsx(
            'inline-block font-bold px-4 py-2 rounded shadow-lg transition-all duration-300',
            {
              'bg-yellow-200': isDuplicate,
              'bg-green-200 animate-pop': isCurrentPrime && !isDuplicate,
            }
          )}
        >
          Number: {currentNum}{' '}
          <span
            className={clsx(
              'ml-2 transition-opacity duration-300',
              isCurrentPrime ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isCurrentPrime && !isDuplicate && `(+${getScore(currentNumStr)})`}
          </span>
        </div>
      ) : (
        <div className="opacity-0">Number: </div> // keep height to prevent layout shift
      )}
    </div>



      <div
        className="relative top-2"
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

              const currentNumber = parseInt(path.map(pos => grid[pos.row][pos.col]).join(''));
              const isCurrentPrime = isPrime(currentNumber);

              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isCurrentPrime ? 'white' : 'red'}
                  strokeOpacity={isCurrentPrime ? 0.7 : 0.3}
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
      // const isCurrent = inPath && path.length > 0;
      const isFinalPrime = isCurrentPrime && !isDuplicate;

      return (
        <div
          key={`${i}-${j}`}
          onPointerDown={() => handlePointerDown(i, j)}
          onPointerEnter={(e) => {
            if (e.buttons === 1) handlePointerEnter(i, j);
          }}
          className={clsx(
            'w-16 h-16 flex items-center justify-center text-2xl font-mono border rounded transition-all duration-200',
            {
              'bg-yellow-200 shadow-sm shadow-black': inPath && isDuplicate,
              'bg-green-200 shadow-sm shadow-black': inPath && isFinalPrime,
              'bg-white-200 shadow-sm shadow-black': inPath && !isFinalPrime && !isDuplicate,
              'bg-amber-100': !inPath,
            }
          )}
        >
          {val}
        </div>
      );
    })
  )}
</div>

      </div>

      {found.size > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Found Primes: {[...found].join(', ')}
        </div>
      )}
    </div>
  );
};

export default PrimeHunt;
