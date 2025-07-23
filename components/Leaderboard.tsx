'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

type LeaderboardProps = {
  phase: 'start' | 'play' | 'leaderboard',
  setPhase: React.Dispatch<React.SetStateAction<'start' | 'play' | 'leaderboard'>>
};

type Entry = {
  name: string;
  score: number;
};

const mockLeaderboard: Entry[] = [
  { name: 'neo.trinity', score: 4200 },
  { name: 'zero.cool', score: 3900 },
  { name: 'steph.yao', score: 3777 },
  { name: 'janet.guo', score: 3699 },
  { name: 'crash.override', score: 3550 },
  { name: 'acid.burn', score: 3400 },
  { name: 'cypher.hex', score: 3200 },
];

export default function Leaderboard({ phase, setPhase }: LeaderboardProps) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setEntries(mockLeaderboard), 500); // loading delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen text-green-400 font-mono flex flex-col items-center justify-center px-4">
      <h1 className="text-[50px] md:text-[70px] font-bold mb-4 animate-pulse text-green-500">🏆 LEADERBOARD 🏆</h1>

      {entries.length === 0 ? (
        <div className="text-lg animate-pulse tracking-wider">Loading...</div>
      ) : (
        <div className="w-full max-w-xl border border-green-500 p-4 rounded-lg backdrop-blur-[2px] shadow-[0_0_10px_#00ff00cc]">
          <div className="grid grid-cols-3 text-lg border-b border-green-500 pb-2 mb-2">
            <div className="text-left">#</div>
            <div className="text-left">Name</div>
            <div className="text-right">Score</div>
          </div>
          {entries.map((entry, idx) => (
            <div
              key={entry.name}
              className={clsx(
                'grid grid-cols-3 py-1 text-green-300 hover:text-green-100 transition-colors duration-150',
                idx < 3 && 'text-green-100 font-bold animate-glow'
              )}
            >
              <div className="text-left">{idx + 1}</div>
              <div className="text-left">{entry.name}</div>
              <div className="text-right">{entry.score}</div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setPhase('start')}
        className="mt-8 px-6 py-2 border border-green-400 text-green-300 hover:bg-green-600 hover:text-black transition duration-200 rounded uppercase"
      >
        Return
      </button>
    </div>
  );
}
