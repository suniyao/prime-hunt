'use client'
import { useEffect, useState } from "react"

type CountdownProps = {
  duration?: number;
  onEnd?: () => void;
}

export default function Countdown({duration, onEnd }: CountdownProps) {
  duration = 90; // setup
  const [ timeLeft, setTimeLeft ] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const secsStr = (secs % 60).toString().padStart(2,'0');
    return `${mins}:${secsStr}`;
  };

  return (
    <div className="text-[45px] font-bold font-mono text-center">
      {formatTime(timeLeft)}
    </div>
  )
}