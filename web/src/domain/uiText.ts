import type { HandId, Locale } from "./types";

interface UiText {
  questionTitle: string;
  questionHint: string;
  handLabels: Record<HandId, string>;
  ask: string;
  saveReading: string;
  countdownStatus: string;
  revealStatus: string;
  symbolTitle: string;
  defaultMeaning: string;
  personalMeaning: string;
  noPersonalMeaning: string;
  editMeaning: string;
  personalLexicon: string;
  personalHint: string;
  customBadge: string;
  saveMeaning: string;
  resetMeaning: string;
  close: string;
  lexiconTitle: string;
  settingsTitle: string;
  settingsButton: string;
  language: string;
  theme: string;
  density: string;
  dawn: string;
  night: string;
  normal: string;
  large: string;
  guidanceTitle: string;
  journalTitle: string;
  emptyJournal: string;
  answerTitle: string;
  openSaved: string;
  savedAt: string;
}

export const uiText: Record<Locale, UiText> = {
  ru: {
    questionTitle: "Текущий вопрос",
    questionHint:
      "Выбери три символа и подтяни нужные колесики на самом приборе.",
    handLabels: {
      "query-1": "Большая стрелка",
      "query-2": "Средняя стрелка",
      "query-3": "Малая стрелка",
    },
    ask: "Спросить прибор",
    saveReading: "Сохранить ответ",
    countdownStatus: "Прибор слушает и обдумывает.",
    revealStatus: "Ответ проявляется по знакам.",
    symbolTitle: "Чтение символа",
    defaultMeaning: "Базовые значения",
    personalMeaning: "Личные трактовки",
    noPersonalMeaning: "Для этого символа пока нет личных трактовок.",
    editMeaning: "Редактировать словарь",
    personalLexicon: "Личный словарь",
    personalHint:
      "Здесь можно переписать трактовку под свой опыт чтения алетиометра. Это отдельный слой, не часть самого ритуала вопроса.",
    customBadge: "свое",
    saveMeaning: "Сохранить толкование",
    resetMeaning: "Вернуть базовое",
    close: "Закрыть",
    lexiconTitle: "Редактирование словаря",
    settingsTitle: "Настройки",
    settingsButton: "Настройки",
    language: "Язык",
    theme: "Тема",
    density: "Размер текста",
    dawn: "Светлая",
    night: "Ночная",
    normal: "Обычный",
    large: "Крупный",
    guidanceTitle: "Как читать ответ",
    journalTitle: "Сохраненные ответы",
    emptyJournal: "Пока ни одного сохраненного ответа.",
    answerTitle: "Ответ прибора",
    openSaved: "Открыть",
    savedAt: "Сохранено",
  },
  en: {
    questionTitle: "Current question",
    questionHint:
      "Choose three symbols and tune the rollers directly on the instrument.",
    handLabels: {
      "query-1": "Large hand",
      "query-2": "Middle hand",
      "query-3": "Small hand",
    },
    ask: "Consult the instrument",
    saveReading: "Save reading",
    countdownStatus: "The instrument is listening and thinking.",
    revealStatus: "The answer is revealing itself symbol by symbol.",
    symbolTitle: "Symbol reading",
    defaultMeaning: "Default meaning",
    personalMeaning: "Personal meanings",
    noPersonalMeaning: "No personal meanings have been saved for this symbol yet.",
    editMeaning: "Edit lexicon",
    personalLexicon: "Personal lexicon",
    personalHint:
      "Rewrite the meaning as your own reading vocabulary develops. This lives outside the main asking flow.",
    customBadge: "custom",
    saveMeaning: "Save meaning",
    resetMeaning: "Restore default",
    close: "Close",
    lexiconTitle: "Lexicon editor",
    settingsTitle: "Settings",
    settingsButton: "Settings",
    language: "Language",
    theme: "Theme",
    density: "Text size",
    dawn: "Dawn",
    night: "Night",
    normal: "Normal",
    large: "Large",
    guidanceTitle: "How to read an answer",
    journalTitle: "Saved readings",
    emptyJournal: "No saved readings yet.",
    answerTitle: "Instrument answer",
    openSaved: "Open",
    savedAt: "Saved",
  },
};
