import { getScore } from "@/utils/score";
import ScoreBar from "./ScoreBar";
import CopyButton from "./CopyButton";

type FinishProps = {
  found: Set<string>,
  score: number,
  numOfPrimes: number, 
};

export default function Finish({found, score, numOfPrimes}: FinishProps) {
  const today = new Date();
  // const seed = '2025-07-04'
  const date = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-4">
      <div className="text-[30px] font-bold">
        Prime Hunt {date}
      </div>
      <div className="font-mono">
        <ScoreBar score={score} numOfPrimes={numOfPrimes} />
        <div className="mt-4 max-h-80 overflow-y-auto flex flex-col gap-2">
          {Array.from(found).map((numStr: string, i: number) => (
            <div
              key={i}
              className="flex w-50 justify-between items-center bg-zinc-800 px-4 py-2 rounded-md text-white shadow-sm"
            >
              <span className="font-mono text-lg">{numStr}</span>
              <span className="text-sm text-green-300">+{getScore(numStr)} pts</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <CopyButton score={score} date={date} foundPrimes={found} link={"https://prime-hunt.vercel.app"}/>
      </div>
    </div>
  )
}
