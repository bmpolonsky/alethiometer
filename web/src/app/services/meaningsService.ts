import { normalizeMeaningItems } from "../../domain/meanings";
import { meaningsStore } from "../store/meaningsStore";
import { preferencesStore } from "../store/preferencesStore";
import { symbolStore } from "../store/symbolStore";

const EMPTY_MEANINGS: string[] = [];

export function getPersonalMeaningItems(symbolId: number) {
  const { locale } = preferencesStore.getState();
  const { customMeanings } = meaningsStore.getState();

  return customMeanings[locale][String(symbolId)] ?? EMPTY_MEANINGS;
}

class MeaningsService {
  private writeMeaningItems(
    symbolId: number,
    items: string[],
    { normalize = false }: { normalize?: boolean } = {},
  ) {
    const nextItems = normalize ? normalizeMeaningItems(items) : items;
    const { locale } = preferencesStore.getState();

    meaningsStore.update((current) => {
      if (nextItems.length === 0) {
        const nextLocaleMeanings = { ...current.customMeanings[locale] };
        delete nextLocaleMeanings[String(symbolId)];

        return {
          ...current,
          customMeanings: {
            ...current.customMeanings,
            [locale]: nextLocaleMeanings,
          },
        };
      }

      return {
        ...current,
        customMeanings: {
          ...current.customMeanings,
          [locale]: {
            ...current.customMeanings[locale],
            [String(symbolId)]: nextItems,
          },
        },
      };
    });

  }

  normalizeSymbolMeanings = (
    symbolId = symbolStore.getState().selectedSymbolId,
  ) => {
    const items = [...getPersonalMeaningItems(symbolId)];
    const normalized = normalizeMeaningItems(items);

    if (
      normalized.length === items.length &&
      normalized.every((item, index) => item === items[index])
    ) {
      return;
    }

    this.writeMeaningItems(symbolId, normalized, { normalize: false });
  };

  openEditor = (_symbolId = symbolStore.getState().selectedSymbolId) => {
    meaningsStore.update((current) => ({
      ...current,
      newMeaningDraft: "",
      isEditingMeanings: true,
    }));
  };

  closeEditor = (symbolId = symbolStore.getState().selectedSymbolId) => {
    this.normalizeSymbolMeanings(symbolId);
    meaningsStore.update((current) => ({
      ...current,
      newMeaningDraft: "",
      isEditingMeanings: false,
    }));
  };

  updateMeaningItem = (
    index: number,
    value: string,
    symbolId = symbolStore.getState().selectedSymbolId,
  ) => {
    const nextItems = [...getPersonalMeaningItems(symbolId)];

    if (index < 0 || index >= nextItems.length) {
      return;
    }

    nextItems[index] = value;
    this.writeMeaningItems(symbolId, nextItems);
  };

  updateNewMeaningDraft = (value: string) => {
    meaningsStore.update((current) => ({
      ...current,
      newMeaningDraft: value,
    }));
  };

  addDraftMeaningItem = () => {
    const normalized = meaningsStore.getState().newMeaningDraft.trim();
    const symbolId = symbolStore.getState().selectedSymbolId;

    if (!normalized) {
      return;
    }

    const nextItems = [...getPersonalMeaningItems(symbolId), normalized];
    this.writeMeaningItems(symbolId, nextItems, { normalize: true });

    meaningsStore.update((current) => ({
      ...current,
      newMeaningDraft: "",
    }));
  };

  removeMeaningItem = (
    index: number,
    symbolId = symbolStore.getState().selectedSymbolId,
  ) => {
    const nextItems = getPersonalMeaningItems(symbolId).filter(
      (_, itemIndex) => itemIndex !== index,
    );
    this.writeMeaningItems(symbolId, nextItems, { normalize: true });
  };
}

export const meaningsService = new MeaningsService();
