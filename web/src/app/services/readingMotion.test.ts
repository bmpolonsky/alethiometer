import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReadingMotion,
  getReadingFrameState,
} from "./readingMotion.ts";

test("reading motion reveals the first symbol once it reaches the first stop", () => {
  const motion = buildReadingMotion(0, [5, 11]);
  const firstStop = motion.stops[0];

  assert.ok(firstStop, "expected first stop to exist");

  const frame = getReadingFrameState({
    motion,
    elapsedMs: firstStop.arriveTimeMs,
    revealedStopCount: 0,
    answerHandAngle: 0,
    selectedSymbolId: 0,
    answerSymbols: [],
  });

  assert.equal(frame.answerSymbols.length, 1);
  assert.deepEqual(frame.answerSymbols, [5]);
  assert.equal(frame.selectedSymbolId, 5);
  assert.equal(frame.revealedStopCount, 1);
});

test("reading motion does not duplicate an already revealed symbol while waiting on a stop", () => {
  const motion = buildReadingMotion(0, [5, 11]);
  const firstStop = motion.stops[0];

  assert.ok(firstStop, "expected first stop to exist");

  const frame = getReadingFrameState({
    motion,
    elapsedMs: firstStop.arriveTimeMs + 900,
    revealedStopCount: 1,
    answerHandAngle: firstStop.stopAngle,
    selectedSymbolId: 5,
    answerSymbols: [5],
  });

  assert.deepEqual(frame.answerSymbols, [5]);
  assert.equal(frame.revealedStopCount, 1);
});

test("reading motion finishes in done state after the last stop", () => {
  const motion = buildReadingMotion(3, [8, 14]);
  const lastStop = motion.stops.at(-1);

  assert.ok(lastStop, "expected last stop to exist");

  const frame = getReadingFrameState({
    motion,
    elapsedMs: motion.totalDurationMs + 1,
    revealedStopCount: motion.stops.length,
    answerHandAngle: lastStop.stopAngle,
    selectedSymbolId: 14,
    answerSymbols: [8, 14],
  });

  assert.equal(frame.done, true);
});
