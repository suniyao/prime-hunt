'use client'
import { useEffect, useState } from "react"

type ScoreBarProps = {
  score: number
  numOfPrimes: number
}

export default function ScoreBar({score, numOfPrimes}: ScoreBarProps) {
  return (
    <div className="flex flex-col">
      <div className="font-black"># of primes found: {numOfPrimes}</div>
      <div className="text-2xl font-black">SCORE: {score}</div>
    </div>
  )
}