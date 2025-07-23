'use client'
import { useState } from "react"
import Countdown from "./CountDown"
import PrimeHunt from "./Play"
import Start from "./Start"
import Play from "./Play"
import LetterGlitch from "./LetterGlitchBackground"
import Leaderboard from "./Leaderboard"

export default function PrimeHuntWrapper() {
  const [phase, setPhase] = useState<'start' | 'play' | 'leaderboard'>('start');
  const [playerName, setPlayerName] = useState('');
  const [inputName, setInputName] = useState('');

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background glitch effect */}
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Foreground content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
        {phase === 'start' && <Start phase={phase} setPhase={setPhase} />}
        {phase === 'play' && <Play phase={phase} setPhase={setPhase} />}
        {phase === 'leaderboard' && <Leaderboard phase={phase} setPhase={setPhase}/>}
      </div>
    </div>

  )
}