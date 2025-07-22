import { isPrime } from "./isPrime";

const Prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]

export function getScore(numStr: string): number {
  const num = Number(numStr);
  if (!isPrime(num)) return 0;
  const n = numStr.length;
  var score = 0;
  // if (n===1) {
  //   score = 200;
  // } else if (n===2) {
  //   score = 500;
  // } else if (n===3) {
  //   score = 600;
  // } else {
  //   score = 700;
  // }
  // return score;
  const nthPrime = Prime[n-1]; // e.g. 2-digit => 2nd prime = 3
  return nthPrime * 100;
}