const formatCopyResult = ({
  score,
  date,
  foundPrimes,
  link
}: {
  score: number;
  date: string;
  foundPrimes: string[];
  link: string;
}): string => {
  return `Prime Hunt Results:
  Score: ${score}
  Date: ${date}
  Found Primes: [${foundPrimes.join(', ')}]
  Play it here: ${link}
  `;
};

export default formatCopyResult;