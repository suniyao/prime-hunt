'use client'
import { useState } from "react"
import Start from "./Start"
import Play from "./Play"
import LetterGlitchBackground from "./LetterGlitchBackground"
import Finish from "./Finish"

export default function PrimeHuntWrapper() {
  const [phase, setPhase] = useState<'start' | 'play' | 'finish'>('start');
  // const [playerName, setPlayerName] = useState('');
  // const [inputName, setInputName] = useState('');
  const [found, setFound] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [numOfPrimes, setNumOfPrimes] = useState<number>(0);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background glitch effect */}
      <div className="absolute inset-0 z-0">
        <LetterGlitchBackground
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      {/* Foreground content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center">
        {phase === 'start' && <Start setPhase={setPhase} />}
        {phase === 'play' && <Play setPhase={setPhase} found={found} setFound={setFound} 
          numOfPrimes={numOfPrimes} setNumOfPrimes={setNumOfPrimes} score={score} setScore={setScore}/>}
        {phase === 'finish' && <Finish found={found} 
          numOfPrimes={numOfPrimes} score={score} />}
      </div>
    </div>

  )
}