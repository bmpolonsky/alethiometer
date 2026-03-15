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

interface PendingReading {
  questionSymbols: number[];
  answerSymbols: number[];
  durationMs: number;
  endsAt: number;
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
  const [answerSymbols, setAnswerSymbols] = useState<number[]>([]);
  const [revealPlan, setRevealPlan] = useState<number[]>([]);
  const [answerHandSymbolId, setAnswerHandSymbolId] = useState<number | null>(
    null,
  );
  const [status, setStatus] = useState<"idle" | "countdown" | "revealing">(
    "idle",
  );
  const [pendingReading, setPendingReading] = useState<PendingReading | null>(
    null,
  );
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

  const finishCountdown = useEffectEvent(() => {
    if (!pendingReading) {
      return;
    }

    setPendingReading(null);
    setCountdownProgress(1);
    setCountdownSecondsLeft(0);
    setRevealPlan(pendingReading.answerSymbols);
    setAnswerSymbols([]);
    setAnswerHandSymbolId(pendingReading.questionSymbols[2] ?? null);
    setOpenedReadingId(null);
    setStatus("revealing");
  });

  useEffect(() => {
    if (!pendingReading) {
      return;
    }

    let frame = 0;

    const loop = () => {
      const remainingMs = pendingReading.endsAt - Date.now();

      if (remainingMs <= 0) {
        finishCountdown();
        return;
      }

      setCountdownProgress(1 - remainingMs / pendingReading.durationMs);
      setCountdownSecondsLeft(Math.ceil(remainingMs / 1000));
      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [finishCountdown, pendingReading]);

  useEffect(() => {
    if (status !== "revealing") {
      return;
    }

    if (answerSymbols.length >= revealPlan.length) {
      const settleTimeout = window.setTimeout(() => {
        setStatus("idle");
      }, 680);

      return () => {
        window.clearTimeout(settleTimeout);
      };
    }

    const nextSymbol = revealPlan[answerSymbols.length];

    if (nextSymbol == null) {
      return;
    }

    const previousSymbol =
      answerSymbols.at(-1) ??
      hands["query-3"] ??
      hands["query-2"] ??
      hands["query-1"];
    const trail = createRevealTrail(previousSymbol, nextSymbol);
    const timeouts: number[] = [];

    trail.forEach((symbolId, index) => {
      const timeout = window.setTimeout(() => {
        setAnswerHandSymbolId(symbolId);
      }, index * 180);

      timeouts.push(timeout);
    });

    const revealDelay = trail.length * 180 + 260;
    const commitDelay = revealDelay + 320;

    timeouts.push(
      window.setTimeout(() => {
        startTransition(() => {
          setAnswerSymbols((current) => [...current, nextSymbol]);
          setSelectedSymbolId(nextSymbol);
        });
      }, commitDelay),
    );

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [answerSymbols, hands, revealPlan, status]);

  function patchPersisted(patch: Partial<PersistedState>) {
    setPersisted((current) => ({
      ...current,
      ...patch,
    }));
  }

  function clearCurrentAnswer() {
    setPendingReading(null);
    setRevealPlan([]);
    setAnswerSymbols([]);
    setAnswerHandSymbolId(null);
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

  function chooseSymbol(symbolId: number) {
    setSelectedSymbolId(symbolId);
  }

  function inspectSymbol(symbolId: number) {
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
    const durationMs = generated.waitSeconds * 1000;

    setPendingReading({
      questionSymbols,
      answerSymbols: generated.answerSymbols,
      durationMs,
      endsAt: Date.now() + durationMs,
    });
    setRevealPlan(generated.answerSymbols);
    setAnswerSymbols([]);
    setAnswerHandSymbolId(null);
    setCountdownProgress(0);
    setCountdownSecondsLeft(generated.waitSeconds);
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
    setPendingReading(null);
    setCountdownProgress(0);
    setCountdownSecondsLeft(0);
    setRevealPlan(entry.answerSymbols);
    setAnswerSymbols(entry.answerSymbols);
    setAnswerHandSymbolId(entry.answerSymbols.at(-1) ?? null);
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
    const nextItems = newMeaningDraft.trim()
      ? [...draftMeaningItems, newMeaningDraft]
      : draftMeaningItems;

    persistDraftMeaning(selectedSymbolId, nextItems);
    setDraftMeaningItems([]);
    setNewMeaningDraft("");
  }

  function openLexicon() {
    setDraftMeaningItems([...personalMeaningItems]);
    setNewMeaningDraft("");
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
    draftMeaningItems,
    newMeaningDraft,
    journal,
    answerSymbols,
    answerHandSymbolId,
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
