import { TypeAnimation } from "react-type-animation"
import { useState } from "react"
import { Info } from "lucide-react"
import Image from "next/image"
import clsx from "clsx"
import InfoBlock from "./InfoBlock"

type StartProps = {
  setPhase: React.Dispatch<React.SetStateAction<'start' | 'play' | 'finish'>>
}

export default function Start({setPhase}: StartProps) {
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const handleStart = () => {
    setPhase("play")
  }
  return (
    <div className="w-180">
      <h1 className="text-[80px] text-white font-bold mb-2">Prime Hunt</h1>
      <div className="text-white text-[25px] -mt-8 font-mono h-20">
        <TypeAnimation
          sequence={[
            'daily word hunt puzzle for nerds',
            1000,
            'be aware of the number of primes here!',
            1000,
            'How many unique numbers can you form by connecting cells in this grid?',
            1000,
            'be bold, start now',
            1000,
          ]}
          speed={70}
          repeat={Infinity}
        />
      </div>
      
      <div className="flex flex-row gap-5 text-white">
        {/* <input
          type="text"
          placeholder="Anonymous"
          className="px-4 py-2 rounded border border-gray-300 shadow-sm backdrop-blur-[2px] focus:outline-none focus:ring-2 focus:ring-green-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}

        <button
          onClick={handleStart}
          className="bg-green-400 text-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-green-400 hover:shadow-gray-400 transition"
        >
          Start Game
        </button>
        <div className="flex flex-row gap-2 text-gray-200 items-center hover:underline mt-1" onClick={() => setTutorialOpen(!tutorialOpen)}>
          <Info size={20}/>
          <div>
            How to play?
          </div>
        </div>
      </div>
      {tutorialOpen && (
        <div
          className={clsx(
            'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center',
            'transition-all duration-300 ease-in-out'
          )}
          onClick={() => setTutorialOpen(false)} // click outside to close
        >
          {/* Modal Content */}
          <div
            className="bg-zinc-900 text-white p-6 rounded-xl max-w-md w-[90%] shadow-lg animate-slideIn"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2 className="text-2xl font-bold mb-4 text-green-400">How to Play:</h2>
            <p className="mb-2 text-sm text-gray-300">
              Connect digits from 0 to 9 by dragging across the grid. Form numbers that are prime. The more digits, the better the score.
            </p>
            <div className="flex justify-center py-2">
              <Image
                src="/tutorial.png"
                alt="Example: prime 360823"
                width={256}
                height={256}
                className="rounded border border-gray-700"
              />
            </div>
            <button
              onClick={() => setTutorialOpen(false)}
              className="mt-4 w-full bg-green-400 hover:bg-black hover:text-green-400 text-black font-semibold py-2 rounded transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      <div className="absolute bottom-5 right-5">
        <InfoBlock />
      </div>
    </div>
  )
}