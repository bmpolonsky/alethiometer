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

export interface ReadingMotionOptions {
  startAngle?: number;
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

const STOP_SETTLE_WINDOW_MS = 70;

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getSegmentProgress(startMs: number, endMs: number, currentMs: number) {
  if (endMs === startMs) {
    return 1;
  }

  return clamp01((currentMs - startMs) / (endMs - startMs));
}

function getLinearTravelAngle(stop: ReadingStop, elapsedMs: number) {
  const progress = getSegmentProgress(stop.startTimeMs, stop.arriveTimeMs, elapsedMs);

  return interpolate(stop.startAngle, stop.stopAngle, progress);
}

function getSettleStartTimestamp(stop: ReadingStop) {
  return Math.max(stop.startTimeMs, stop.arriveTimeMs - STOP_SETTLE_WINDOW_MS);
}

function getSettledTravelAngle(stop: ReadingStop, elapsedMs: number) {
  const settleStartMs = getSettleStartTimestamp(stop);
  const settleStartAngle = getLinearTravelAngle(stop, settleStartMs);
  const settleProgress = getSegmentProgress(settleStartMs, stop.arriveTimeMs, elapsedMs);

  return interpolate(
    settleStartAngle,
    stop.stopAngle,
    easeOutCubic(settleProgress),
  );
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
  return buildReadingMotionWithOptions(startSymbol, answerSymbols, {});
}

export function buildReadingMotionWithOptions(
  startSymbol: number,
  answerSymbols: number[],
  options: ReadingMotionOptions,
): ReadingMotion {
  let currentSymbol = startSymbol;
  let currentAngle = options.startAngle ?? startSymbol * 10;
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

export function getAnswerHandSymbolId(angle: number) {
  return wrapSymbolId(Math.round(angle / 10));
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
    const settleStartMs = getSettleStartTimestamp(currentStop);

    if (elapsedMs >= settleStartMs) {
      nextAnswerHandAngle = getSettledTravelAngle(currentStop, elapsedMs);

      return {
        done: elapsedMs >= motion.totalDurationMs,
        answerHandAngle: nextAnswerHandAngle,
        selectedSymbolId,
        answerSymbols,
        revealedStopCount,
      };
    }

    nextAnswerHandAngle = getLinearTravelAngle(currentStop, elapsedMs);
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
