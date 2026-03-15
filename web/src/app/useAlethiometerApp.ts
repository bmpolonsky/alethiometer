import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { createReading } from "../domain/engine";
import { normalizeMeaningItems } from "../domain/meanings";
import {
  createDefaultState,
  loadState,
  resolveBrowserLocale,
  saveState,
} from "../domain/storage";
import { symbolCatalog } from "../domain/symbols";
import { HAND_ORDER } from "../domain/types";
import type {
  HandId,
  Locale,
  PersistedState,
  SavedReading,
  ThemeMode,
} from "../domain/types";

interface ReadingStop {
  symbolId: number;
  startAngle: number;
  stopAngle: number;
  startTimeMs: number;
  arriveTimeMs: number;
  endTimeMs: number;
}

interface ReadingMotion {
  startedAt: number;
  totalDurationMs: number;
  stops: ReadingStop[];
}

interface SaveReadingDraft {
  questionText?: string;
  answerText?: string;
}

const EMPTY_MEANINGS: string[] = [];

function createEntryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `reading-${Date.now()}`;
}

function wrapSymbolId(value: number) {
  return ((value % 36) + 36) % 36;
}

function shortestSymbolStep(from: number, to: number) {
  const forward = wrapSymbolId(to - from);
  const backward = forward - 36;

  return Math.abs(forward) <= Math.abs(backward) ? forward : backward;
}

function createRevealTrail(from: number, to: number) {
  const step = shortestSymbolStep(from, to);
  const distance = Math.abs(step);

  if (distance <= 1) {
    return [to];
  }

  const trailLength = Math.min(4, Math.max(2, Math.round(distance / 4)));
  const trail: number[] = [];

  for (let index = 1; index <= trailLength; index += 1) {
    const progress = index / (trailLength + 1);
    const symbolId = wrapSymbolId(from + Math.round(step * progress));

    if (symbolId !== to && trail.at(-1) !== symbolId) {
      trail.push(symbolId);
    }
  }

  return [...trail, to];
}

function forwardSymbolDistance(from: number, to: number) {
  const normalized = wrapSymbolId(to - from);

  return normalized === 0 ? 36 : normalized;
}

function buildReadingMotion(startSymbol: number, answerSymbols: number[]): ReadingMotion {
  let currentSymbol = startSymbol;
  let currentAngle = startSymbol * 10;
  let currentTimeMs = 0;

  const stops = answerSymbols.map((symbolId) => {
    const distance = forwardSymbolDistance(currentSymbol, symbolId);
    const angleDelta = distance * 10;
    const moveDurationMs = Math.max(520, Math.round((distance / 36) * 2200));
    const holdDurationMs = 1500;
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
    startedAt: performance.now(),
    totalDurationMs: currentTimeMs,
    stops,
  };
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();

  return normalized || undefined;
}

export function useAlethiometerApp() {
  const fallbackLocale = resolveBrowserLocale(
    typeof navigator === "undefined" ? undefined : navigator.language,
  );

  const [persisted, setPersisted] = useState<PersistedState>(() =>
    typeof window === "undefined"
      ? createDefaultState(fallbackLocale)
      : loadState(fallbackLocale),
  );
  const [selectedSymbolId, setSelectedSymbolId] = useState(
    persisted.hands["query-1"],
  );
  const [activeHand, setActiveHand] = useState<HandId>("query-1");
  const [draftMeaningItems, setDraftMeaningItems] = useState<string[]>([]);
  const [newMeaningDraft, setNewMeaningDraft] = useState("");
  const [isEditingMeanings, setIsEditingMeanings] = useState(false);
  const [answerSymbols, setAnswerSymbols] = useState<number[]>([]);
  const [answerHandAngle, setAnswerHandAngle] = useState(
    persisted.hands["query-3"] * 10,
  );
  const [status, setStatus] = useState<"idle" | "countdown" | "revealing">(
    "idle",
  );
  const [readingMotion, setReadingMotion] = useState<ReadingMotion | null>(null);
  const [countdownProgress, setCountdownProgress] = useState(0);
  const [countdownSecondsLeft, setCountdownSecondsLeft] = useState(0);
  const [openedReadingId, setOpenedReadingId] = useState<string | null>(null);

  const locale = persisted.locale;
  const theme = persisted.theme;
  const hands = persisted.hands;
  const journal = persisted.journal;
  const customMeanings = persisted.customMeanings;
  const localeCustomMeanings = customMeanings[locale];

  const currentSymbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const defaultMeaningItems = currentSymbol.meanings[locale];
  const personalMeaningItems =
    localeCustomMeanings[String(selectedSymbolId)] ?? EMPTY_MEANINGS;

  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const completeReadingMotion = useEffectEvent((motion: ReadingMotion) => {
    const finalStop = motion.stops.at(-1);

    if (finalStop) {
      setAnswerHandAngle(finalStop.stopAngle);
    }

    setReadingMotion(null);
    setCountdownProgress(1);
    setCountdownSecondsLeft(0);
    setStatus("idle");
  });

  useEffect(() => {
    if (!readingMotion) {
      return;
    }

    let frame = 0;
    let revealedCount = 0;

    const tick = () => {
      const elapsedMs = performance.now() - readingMotion.startedAt;
      const remainingMs = Math.max(readingMotion.totalDurationMs - elapsedMs, 0);
      const currentStop =
        readingMotion.stops.find((stop) => elapsedMs < stop.endTimeMs) ??
        readingMotion.stops.at(-1);

      if (!currentStop) {
        completeReadingMotion(readingMotion);
        return;
      }

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

        setAnswerHandAngle(
          currentStop.startAngle + (currentStop.stopAngle - currentStop.startAngle) * moveProgress,
        );
      } else {
        setAnswerHandAngle(currentStop.stopAngle);

        while (
          revealedCount < readingMotion.stops.length &&
          elapsedMs >= readingMotion.stops[revealedCount]!.arriveTimeMs
        ) {
          const revealedSymbol = readingMotion.stops[revealedCount]!.symbolId;

          startTransition(() => {
            setAnswerSymbols((current) => [...current, revealedSymbol]);
            setSelectedSymbolId(revealedSymbol);
          });
          revealedCount += 1;
        }
      }

      setCountdownProgress(
        readingMotion.totalDurationMs > 0
          ? Math.min(elapsedMs / readingMotion.totalDurationMs, 1)
          : 1,
      );
      setCountdownSecondsLeft(Math.ceil(remainingMs / 1000));

      if (elapsedMs >= readingMotion.totalDurationMs) {
        completeReadingMotion(readingMotion);
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [completeReadingMotion, readingMotion]);

  function patchPersisted(patch: Partial<PersistedState>) {
    setPersisted((current) => ({
      ...current,
      ...patch,
    }));
  }

  function clearCurrentAnswer() {
    setAnswerSymbols([]);
    setReadingMotion(null);
    setCountdownProgress(0);
    setCountdownSecondsLeft(0);
    setOpenedReadingId(null);
    setStatus("idle");
  }

  function updateHands(nextHands: PersistedState["hands"]) {
    setPersisted((current) => ({
      ...current,
      hands: nextHands,
    }));
  }

  function flushMeaningDraft(symbolId: number) {
    if (!isEditingMeanings) {
      return;
    }

    const nextItems = newMeaningDraft.trim()
      ? [...draftMeaningItems, newMeaningDraft]
      : draftMeaningItems;

    persistDraftMeaning(symbolId, nextItems);
    setDraftMeaningItems([]);
    setNewMeaningDraft("");
    setIsEditingMeanings(false);
  }

  function chooseSymbol(symbolId: number) {
    if (symbolId !== selectedSymbolId) {
      flushMeaningDraft(selectedSymbolId);
    }

    setSelectedSymbolId(symbolId);
  }

  function inspectSymbol(symbolId: number) {
    if (symbolId !== selectedSymbolId) {
      flushMeaningDraft(selectedSymbolId);
    }

    setSelectedSymbolId(symbolId);
  }

  function focusHand(handId: HandId) {
    setActiveHand(handId);
    setSelectedSymbolId(hands[handId]);
  }

  function assignSymbolToHand(symbolId: number, handId: HandId) {
    const nextSymbol = wrapSymbolId(symbolId);

    if (status === "idle" && (answerSymbols.length > 0 || openedReadingId != null)) {
      clearCurrentAnswer();
    }

    updateHands({
      ...hands,
      [handId]: nextSymbol,
    });
    setActiveHand(handId);
    setSelectedSymbolId(nextSymbol);
  }

  function setHandSymbol(handId: HandId, symbolId: number) {
    assignSymbolToHand(symbolId, handId);
  }

  function nudgeHand(handId: HandId, direction: number) {
    if (status === "idle" && (answerSymbols.length > 0 || openedReadingId != null)) {
      clearCurrentAnswer();
    }

    setPersisted((current) => {
      const nextSymbol = wrapSymbolId(current.hands[handId] + direction);

      setActiveHand(handId);
      setSelectedSymbolId(nextSymbol);

      return {
        ...current,
        hands: {
          ...current.hands,
          [handId]: nextSymbol,
        },
      };
    });
  }

  function setLocale(nextLocale: Locale) {
    patchPersisted({ locale: nextLocale });
  }

  function setTheme(nextTheme: ThemeMode) {
    patchPersisted({ theme: nextTheme });
  }

  function askAlethiometer() {
    if (status !== "idle") {
      return;
    }

    const questionSymbols: [number, number, number] = [
      hands["query-1"],
      hands["query-2"],
      hands["query-3"],
    ];
    const generated = createReading(questionSymbols);
    const motion = buildReadingMotion(questionSymbols[2], generated.answerSymbols);

    setReadingMotion(motion);
    setAnswerSymbols([]);
    setAnswerHandAngle(questionSymbols[2] * 10);
    setCountdownProgress(0);
    setCountdownSecondsLeft(Math.ceil(motion.totalDurationMs / 1000));
    setOpenedReadingId(null);
    setStatus("countdown");
  }

  function saveCurrentReading(draft: SaveReadingDraft) {
    if (status !== "idle" || answerSymbols.length === 0) {
      return;
    }

    const entry: SavedReading = {
      id: createEntryId(),
      createdAt: new Date().toISOString(),
      locale,
      questionSymbols: HAND_ORDER.map((handId) => hands[handId]),
      answerSymbols: [...answerSymbols],
      questionText: normalizeOptionalText(draft.questionText),
      answerText: normalizeOptionalText(draft.answerText),
    };

    setPersisted((current) => ({
      ...current,
      journal: [entry, ...current.journal].slice(0, 16),
    }));
    setOpenedReadingId(entry.id);
  }

  function deleteReading(readingId: string) {
    setPersisted((current) => ({
      ...current,
      journal: current.journal.filter((entry) => entry.id !== readingId),
    }));

    setOpenedReadingId((current) => (current === readingId ? null : current));
  }

  function openReading(entry: SavedReading) {
    updateHands({
      "query-1": entry.questionSymbols[0] ?? hands["query-1"],
      "query-2": entry.questionSymbols[1] ?? hands["query-2"],
      "query-3": entry.questionSymbols[2] ?? hands["query-3"],
    });
    setReadingMotion(null);
    setCountdownProgress(0);
    setCountdownSecondsLeft(0);
    setAnswerSymbols(entry.answerSymbols);
    setAnswerHandAngle((entry.answerSymbols.at(-1) ?? entry.questionSymbols[2] ?? 0) * 10);
    setSelectedSymbolId(entry.answerSymbols[0] ?? entry.questionSymbols[0] ?? 0);
    setOpenedReadingId(entry.id);
    setStatus("idle");
  }

  function updateDraftMeaningItem(index: number, value: string) {
    setDraftMeaningItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function updateNewMeaningDraft(value: string) {
    setNewMeaningDraft(value);
  }

  function addDraftMeaningItem() {
    const normalized = newMeaningDraft.trim();

    if (!normalized) {
      return;
    }

    setDraftMeaningItems((current) => [...current, normalized]);
    setNewMeaningDraft("");
  }

  function removeDraftMeaningItem(index: number) {
    setDraftMeaningItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function persistDraftMeaning(symbolId: number, items: string[]) {
    const normalized = normalizeMeaningItems(items);

    if (normalized.length === 0) {
      const nextLocaleMeanings = { ...customMeanings[locale] };
      delete nextLocaleMeanings[String(symbolId)];

      patchPersisted({
        customMeanings: {
          ...customMeanings,
          [locale]: nextLocaleMeanings,
        },
      });
      return;
    }

    patchPersisted({
      customMeanings: {
        ...customMeanings,
        [locale]: {
          ...customMeanings[locale],
          [String(symbolId)]: normalized,
        },
      },
    });
  }

  function closeLexicon() {
    flushMeaningDraft(selectedSymbolId);
  }

  function openLexicon() {
    setDraftMeaningItems([...personalMeaningItems]);
    setNewMeaningDraft("");
    setIsEditingMeanings(true);
  }

  return {
    locale,
    theme,
    hands,
    activeHand,
    status,
    selectedSymbolId,
    currentSymbol,
    defaultMeaningItems,
    personalMeaningItems,
    isEditingMeanings,
    draftMeaningItems,
    newMeaningDraft,
    journal,
    answerSymbols,
    answerHandAngle,
    countdownProgress,
    countdownSecondsLeft,
    symbolCatalog,
    openedReadingId,
    canSaveReading: status === "idle" && answerSymbols.length > 0,
    chooseSymbol,
    inspectSymbol,
    focusHand,
    assignSymbolToHand,
    setHandSymbol,
    nudgeHand,
    setLocale,
    setTheme,
    askAlethiometer,
    saveCurrentReading,
    deleteReading,
    openReading,
    updateDraftMeaningItem,
    updateNewMeaningDraft,
    addDraftMeaningItem,
    removeDraftMeaningItem,
    openLexicon,
    closeLexicon,
  };
}
