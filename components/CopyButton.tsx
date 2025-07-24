import { useState } from 'react';
import formatCopyResult from '@/utils/copyResult';

type CopyButtonProps = {
  score: number, 
  date: string,
  foundPrimes: Set<string>,
  link: string,
}
export default function CopyButton({score, date, foundPrimes, link}:CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = formatCopyResult({ score, date, foundPrimes: Array.from(foundPrimes), link });
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-green-400 text-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-green-400 hover:shadow-gray-400 transition"
    >
      {copied ? 'Copied!' : 'Copy Result'}
    </button>
  );
}
