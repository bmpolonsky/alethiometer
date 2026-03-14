import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { createReading } from "../domain/engine";
import { symbolCatalog } from "../domain/symbols";
import {
  createDefaultState,
  loadState,
  resolveBrowserLocale,
  saveState,
} from "../domain/storage";
import { HAND_ORDER } from "../domain/types";
import type {
  HandId,
  Locale,
  PersistedState,
  SavedReading,
  TextDensity,
  ThemeMode,
} from "../domain/types";

interface PendingReading {
  questionSymbols: number[];
  answerSymbols: number[];
  durationMs: number;
  endsAt: number;
}

function createEntryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `reading-${Date.now()}`;
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
  const [draftMeaning, setDraftMeaning] = useState("");
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
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);

  const locale = persisted.locale;
  const theme = persisted.theme;
  const density = persisted.density;
  const hands = persisted.hands;
  const journal = persisted.journal;
  const customMeanings = persisted.customMeanings;

  const currentSymbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const activeMeaning =
    customMeanings[locale][String(selectedSymbolId)] ??
    currentSymbol.meanings[locale];
  const personalMeaning = customMeanings[locale][String(selectedSymbolId)] ?? null;

  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.density = density;
  }, [theme, density]);

  useEffect(() => {
    setDraftMeaning(activeMeaning);
  }, [activeMeaning, locale, selectedSymbolId]);

  const finishCountdown = useEffectEvent(() => {
    if (!pendingReading) {
      return;
    }

    setPendingReading(null);
    setCountdownProgress(1);
    setCountdownSecondsLeft(0);
    setRevealPlan(pendingReading.answerSymbols);
    setAnswerSymbols([]);
    setAnswerHandSymbolId(pendingReading.answerSymbols[0] ?? null);
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
      }, 520);

      return () => {
        window.clearTimeout(settleTimeout);
      };
    }

    const nextSymbol = revealPlan[answerSymbols.length];
    setAnswerHandSymbolId(nextSymbol ?? null);

    const revealTimeout = window.setTimeout(() => {
      if (nextSymbol == null) {
        return;
      }

      startTransition(() => {
        setAnswerSymbols((current) => [...current, nextSymbol]);
        setSelectedSymbolId(nextSymbol);
      });
    }, 920);

    return () => {
      window.clearTimeout(revealTimeout);
    };
  }, [answerSymbols, revealPlan, status]);

  function patchPersisted(patch: Partial<PersistedState>) {
    setPersisted((current) => ({
      ...current,
      ...patch,
    }));
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
    const nextSymbol = ((symbolId % 36) + 36) % 36;

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
    setPersisted((current) => {
      const nextSymbol = ((current.hands[handId] + direction) % 36 + 36) % 36;

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

  function setDensity(nextDensity: TextDensity) {
    patchPersisted({ density: nextDensity });
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
    setStatus("countdown");
  }

  function saveCurrentReading() {
    if (status !== "idle" || answerSymbols.length === 0) {
      return;
    }

    const entry: SavedReading = {
      id: createEntryId(),
      createdAt: new Date().toISOString(),
      locale,
      questionSymbols: HAND_ORDER.map((handId) => hands[handId]),
      answerSymbols: [...answerSymbols],
    };

    setPersisted((current) => ({
      ...current,
      journal: [entry, ...current.journal].slice(0, 12),
    }));
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
    setStatus("idle");
  }

  function updateDraftMeaning(value: string) {
    setDraftMeaning(value);
  }

  function saveMeaning() {
    const normalized = draftMeaning.trim();

    if (!normalized) {
      resetMeaning();
      setIsLexiconOpen(false);
      return;
    }

    const nextCustom = {
      ...customMeanings,
      [locale]: {
        ...customMeanings[locale],
        [String(selectedSymbolId)]: normalized,
      },
    };

    patchPersisted({ customMeanings: nextCustom });
    setIsLexiconOpen(false);
  }

  function resetMeaning() {
    const nextLocaleMeanings = { ...customMeanings[locale] };
    delete nextLocaleMeanings[String(selectedSymbolId)];

    patchPersisted({
      customMeanings: {
        ...customMeanings,
        [locale]: nextLocaleMeanings,
      },
    });
    setDraftMeaning(currentSymbol.meanings[locale]);
  }

  return {
    locale,
    theme,
    density,
    hands,
    activeHand,
    status,
    selectedSymbolId,
    currentSymbol,
    defaultMeaning: currentSymbol.meanings[locale],
    activeMeaning,
    personalMeaning,
    draftMeaning,
    journal,
    answerSymbols,
    answerHandSymbolId,
    countdownProgress,
    countdownSecondsLeft,
    symbolCatalog,
    canSaveReading: status === "idle" && answerSymbols.length > 0,
    isLexiconOpen,
    hasCustomMeaning:
      customMeanings[locale][String(selectedSymbolId)] != null &&
      customMeanings[locale][String(selectedSymbolId)] !== "",
    chooseSymbol,
    inspectSymbol,
    focusHand,
    assignSymbolToHand,
    setHandSymbol,
    nudgeHand,
    setLocale,
    setTheme,
    setDensity,
    askAlethiometer,
    saveCurrentReading,
    openReading,
    updateDraftMeaning,
    saveMeaning,
    resetMeaning,
    openLexicon: () => setIsLexiconOpen(true),
    closeLexicon: () => setIsLexiconOpen(false),
  };
}
