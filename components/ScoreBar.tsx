'use client'

type ScoreBarProps = {
  score: number
  numOfPrimes: number
}

export default function ScoreBar({score, numOfPrimes}: ScoreBarProps) {
  return (
    <div className="flex flex-col">
      <div className="font-black"># of primes found: <span className="font-mono">{numOfPrimes}</span></div>
      <div className="text-2xl font-black">SCORE: <span className="font-mono">{score}</span></div>
    </div>
  )
}