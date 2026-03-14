export interface GeneratedReading {
  waitSeconds: number;
  answerSymbols: number[];
}

function clampSymbolIndex(value: number) {
  if (value < 0) {
    return 0;
  }

  if (value > 35) {
    return 35;
  }

  return value;
}

export function createReading(
  [arrowOne, arrowTwo, arrowThree]: [number, number, number],
  random = Math.random,
): GeneratedReading {
  const baseAnswer = Math.round(
    ((arrowOne + 21) * (arrowTwo + 34) * (arrowThree + 55)) /
      (89 * Math.round(random() * 144) + 1) *
      Math.pow(10, 16),
  ).toString();

  const answerSymbols: number[] = [];
  const seen = new Set<number>();

  let answerCount = Math.floor(Number.parseInt(baseAnswer.slice(0, 1), 10) / 2.5 + 2);

  if (answerCount > 5) {
    answerCount = 5;
  }

  if (answerCount < 2) {
    answerCount = 2;
  }

  let cursor = 1;

  while (answerSymbols.length < answerCount) {
    const chunk = Number.parseInt(baseAnswer.slice(cursor, cursor + 2) || "0", 10);
    const symbolId = clampSymbolIndex(Math.floor(0.35 * chunk));

    if (!seen.has(symbolId)) {
      answerSymbols.push(symbolId);
      seen.add(symbolId);
    }

    cursor += 2;

    if (cursor > baseAnswer.length + 6) {
      break;
    }
  }

  return {
    waitSeconds: 5 + Math.floor(random() * 3),
    answerSymbols,
  };
}
