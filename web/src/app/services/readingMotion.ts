export interface ReadingStop {
  symbolId: number;
  startAngle: number;
  stopAngle: number;
  startTimeMs: number;
  arriveTimeMs: number;
  endTimeMs: number;
}

export interface ReadingMotion {
  startedAt: number;
  totalDurationMs: number;
  stops: ReadingStop[];
}

export interface ReadingFrameInput {
  motion: ReadingMotion;
  elapsedMs: number;
  revealedStopCount: number;
  answerHandAngle: number;
  selectedSymbolId: number;
  answerSymbols: number[];
}

export interface ReadingFrameState {
  done: boolean;
  answerHandAngle: number;
  selectedSymbolId: number;
  answerSymbols: number[];
  revealedStopCount: number;
}

function wrapSymbolId(value: number) {
  return ((value % 36) + 36) % 36;
}

function forwardSymbolDistance(from: number, to: number) {
  const normalized = wrapSymbolId(to - from);

  return normalized === 0 ? 36 : normalized;
}

function getTimestamp() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export function buildReadingMotion(startSymbol: number, answerSymbols: number[]): ReadingMotion {
  let currentSymbol = startSymbol;
  let currentAngle = startSymbol * 10;
  let currentTimeMs = 0;

  const stops = answerSymbols.map((symbolId) => {
    const distance = forwardSymbolDistance(currentSymbol, symbolId);
    const angleDelta = distance * 10;
    const moveDurationMs = Math.max(260, Math.round((distance / 36) * 7200));
    const holdDurationMs = 900;
    const stopAngle = currentAngle + angleDelta;
    const stop: ReadingStop = {
      symbolId,
      startAngle: currentAngle,
      stopAngle,
      startTimeMs: currentTimeMs,
      arriveTimeMs: currentTimeMs + moveDurationMs,
      endTimeMs: currentTimeMs + moveDurationMs + holdDurationMs,
    };

    currentSymbol = symbolId;
    currentAngle = stopAngle;
    currentTimeMs = stop.endTimeMs;

    return stop;
  });

  return {
    startedAt: getTimestamp(),
    totalDurationMs: currentTimeMs,
    stops,
  };
}

export function getMotionTimestamp() {
  return getTimestamp();
}

export function getReadingFrameState({
  motion,
  elapsedMs,
  revealedStopCount,
  answerHandAngle,
  selectedSymbolId,
  answerSymbols,
}: ReadingFrameInput): ReadingFrameState {
  const currentStop =
    motion.stops.find((stop) => elapsedMs < stop.endTimeMs) ??
    motion.stops.at(-1);

  if (!currentStop) {
    return {
      done: true,
      answerHandAngle,
      selectedSymbolId,
      answerSymbols,
      revealedStopCount,
    };
  }

  let nextAnswerHandAngle = answerHandAngle;
  let nextSelectedSymbolId = selectedSymbolId;
  let nextAnswerSymbols = answerSymbols;
  let nextRevealedStopCount = revealedStopCount;

  if (elapsedMs < currentStop.arriveTimeMs) {
    const moveProgress =
      currentStop.arriveTimeMs === currentStop.startTimeMs
        ? 1
        : Math.min(
            Math.max(
              (elapsedMs - currentStop.startTimeMs) /
                (currentStop.arriveTimeMs - currentStop.startTimeMs),
              0,
            ),
            1,
          );

    nextAnswerHandAngle =
      currentStop.startAngle +
      (currentStop.stopAngle - currentStop.startAngle) * moveProgress;
  } else {
    nextAnswerHandAngle = currentStop.stopAngle;

    while (
      nextRevealedStopCount < motion.stops.length &&
      elapsedMs >= motion.stops[nextRevealedStopCount]!.arriveTimeMs
    ) {
      const revealedStop = motion.stops[nextRevealedStopCount]!;

      if (nextAnswerSymbols.length <= nextRevealedStopCount) {
        nextAnswerSymbols = [...nextAnswerSymbols, revealedStop.symbolId];
      }

      nextSelectedSymbolId = revealedStop.symbolId;
      nextRevealedStopCount += 1;
    }
  }

  return {
    done: elapsedMs >= motion.totalDurationMs,
    answerHandAngle: nextAnswerHandAngle,
    selectedSymbolId: nextSelectedSymbolId,
    answerSymbols: nextAnswerSymbols,
    revealedStopCount: nextRevealedStopCount,
  };
}
