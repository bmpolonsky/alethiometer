import { createReading } from "../../domain/engine";
import type { SavedReading } from "../../domain/types";
import { journalStore } from "../store/journalStore";
import { questionStore } from "../store/questionStore";
import { readingStore } from "../store/readingStore";
import { symbolStore } from "../store/symbolStore";
import {
  buildReadingMotion,
  getReadingFrameState,
  getMotionTimestamp,
  type ReadingMotion,
} from "./readingMotion";

class ReadingService {
  private readingMotion: ReadingMotion | null = null;

  private revealedStopCount = 0;

  private animationFrame = 0;

  private cancelAnimationFrame() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  }

  stop = () => {
    this.cancelAnimationFrame();
    this.readingMotion = null;
  };

  private completeReadingMotion(motion: ReadingMotion) {
    const finalStop = motion.stops.at(-1);

    this.stop();
    this.revealedStopCount = 0;
    readingStore.update((current) => ({
      ...current,
      answerHandAngle: finalStop ? finalStop.stopAngle : current.answerHandAngle,
      status: "idle",
    }));
  }

  private runReadingMotion() {
    const tick = () => {
      const motion = this.readingMotion;

      if (!motion) {
        return;
      }

      const reading = readingStore.getState();
      const symbol = symbolStore.getState();
      const elapsedMs = getMotionTimestamp() - motion.startedAt;
      const frameState = getReadingFrameState({
        motion,
        elapsedMs,
        revealedStopCount: this.revealedStopCount,
        answerHandAngle: reading.answerHandAngle,
        selectedSymbolId: symbol.selectedSymbolId,
        answerSymbols: reading.answerSymbols,
      });

      this.revealedStopCount = frameState.revealedStopCount;

      readingStore.update((current) => ({
        ...current,
        answerHandAngle: frameState.answerHandAngle,
        answerSymbols: frameState.answerSymbols,
      }));
      symbolStore.update(() => ({
        selectedSymbolId: frameState.selectedSymbolId,
      }));

      if (frameState.done) {
        this.completeReadingMotion(motion);
        return;
      }

      this.animationFrame = window.requestAnimationFrame(tick);
    };

    this.cancelAnimationFrame();
    this.animationFrame = window.requestAnimationFrame(tick);
  }

  ask = () => {
    const reading = readingStore.getState();
    const question = questionStore.getState();

    if (reading.status !== "idle") {
      return;
    }

    const questionSymbols: [number, number, number] = [
      question.hands.first,
      question.hands.second,
      question.hands.third,
    ];
    const generated = createReading(questionSymbols);
    const motion = buildReadingMotion(questionSymbols[2], generated.answerSymbols);

    this.revealedStopCount = 0;
    this.readingMotion = motion;
    readingStore.update((current) => ({
      ...current,
      answerSymbols: [],
      answerHandAngle: questionSymbols[2] * 10,
      status: "listening",
    }));
    journalStore.update((current) => ({
      ...current,
      openedReadingId: null,
    }));
    this.runReadingMotion();
  };

  openReading = (entry: SavedReading) => {
    const question = questionStore.getState();

    this.stop();
    this.revealedStopCount = entry.answerSymbols.length;
    questionStore.update((current) => ({
      ...current,
      hands: {
        first: entry.questionSymbols[0] ?? question.hands.first,
        second: entry.questionSymbols[1] ?? question.hands.second,
        third: entry.questionSymbols[2] ?? question.hands.third,
      },
    }));
    readingStore.update((current) => ({
      ...current,
      answerSymbols: entry.answerSymbols,
      answerHandAngle:
        (entry.answerSymbols.at(-1) ?? entry.questionSymbols[2] ?? 0) * 10,
      status: "idle",
    }));
    symbolStore.update(() => ({
      selectedSymbolId: entry.answerSymbols[0] ?? entry.questionSymbols[0] ?? 0,
    }));
    journalStore.update((current) => ({
      ...current,
      openedReadingId: entry.id,
    }));
  };
}

export const readingService = new ReadingService();
