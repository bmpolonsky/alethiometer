import type { Locale } from "./types";

interface UiText {
  questionTitle: string;
  ask: string;
  saveReading: string;
  saveReadingTitle: string;
  saveReadingQuestionLabel: string;
  saveReadingQuestionPlaceholder: string;
  saveReadingAnswerLabel: string;
  saveReadingAnswerPlaceholder: string;
  confirmSaveReading: string;
  cancel: string;
  listeningStatus: string;
  symbolTitle: string;
  defaultMeaning: string;
  personalMeaning: string;
  emptyPersonalMeaning: string;
  editMeaning: string;
  doneEditing: string;
  personalHint: string;
  addMeaning: string;
  deleteMeaning: string;
  newMeaningPlaceholder: string;
  close: string;
  settingsTitle: string;
  settingsButton: string;
  settingsSection: string;
  meditativeMode: string;
  immersiveModeOff: string;
  symbolsSection: string;
  archiveSection: string;
  helpSection: string;
  language: string;
  theme: string;
  dawn: string;
  night: string;
  journalTitle: string;
  catalogTitle: string;
  catalogHint: string;
  lexiconTitle: string;
  lexiconSymbolLabel: string;
  archiveHint: string;
  emptyJournal: string;
  answerTitle: string;
  answerPlaceholder: string;
  openSaved: string;
  savedAt: string;
  deleteSaved: string;
  answerSummaryLabel: string;
  chooseSymbolTitle: string;
  chooseSymbolHint: string;
}

export const uiText: Record<Locale, UiText> = {
  ru: {
    questionTitle: "Вопрос",
    ask: "Спросить",
    saveReading: "Сохранить ответ",
    saveReadingTitle: "Сохранить чтение",
    saveReadingQuestionLabel: "Формулировка вопроса",
    saveReadingQuestionPlaceholder: "Коротко: что именно спрашивалось",
    saveReadingAnswerLabel: "Формулировка ответа",
    saveReadingAnswerPlaceholder: "Как ты сейчас читаешь полученный ответ",
    confirmSaveReading: "Сохранить",
    cancel: "Отмена",
    listeningStatus: "Прибор слушает и обдумывает.",
    symbolTitle: "Значение",
    defaultMeaning: "Базовые",
    personalMeaning: "Личные",
    emptyPersonalMeaning: "Пока нет личных трактовок.",
    editMeaning: "Редактировать",
    doneEditing: "Готово",
    personalHint:
      "Базовые значения остаются опорой. Личные трактовки хранятся отдельными пунктами и редактируются независимо.",
    addMeaning: "Добавить",
    deleteMeaning: "Удалить",
    newMeaningPlaceholder: "Новая трактовка",
    close: "Закрыть",
    settingsTitle: "Меню",
    settingsButton: "Меню",
    settingsSection: "Настройки",
    meditativeMode: "Медитативный режим",
    immersiveModeOff: "Обычный режим",
    symbolsSection: "Символы",
    archiveSection: "Архив",
    helpSection: "Справка",
    language: "Язык",
    theme: "Тема",
    dawn: "Светлая",
    night: "Ночная",
    journalTitle: "Архив",
    catalogTitle: "Все символы",
    catalogHint:
      "Здесь можно открыть любой знак, посмотреть базовые смыслы и перейти к редактированию личных трактовок.",
    lexiconTitle: "Словарь символа",
    lexiconSymbolLabel: "Редактируемый символ",
    archiveHint:
      "Сохраненные чтения держат формулировку вопроса, цепочку ответа и твою собственную формулировку смысла.",
    emptyJournal: "Пока ни одного сохраненного ответа.",
    answerTitle: "Ответ",
    answerPlaceholder: "Ответ проявится здесь после паузы.",
    openSaved: "Открыть",
    savedAt: "Сохранено",
    deleteSaved: "Удалить",
    answerSummaryLabel: "Смысл ответа",
    chooseSymbolTitle: "Выбери символ",
    chooseSymbolHint: "Прокрути список и выбери знак для текущей позиции вопроса.",
  },
  en: {
    questionTitle: "Question",
    ask: "Ask",
    saveReading: "Save reading",
    saveReadingTitle: "Save reading",
    saveReadingQuestionLabel: "Question wording",
    saveReadingQuestionPlaceholder: "Briefly: what exactly was being asked",
    saveReadingAnswerLabel: "Answer wording",
    saveReadingAnswerPlaceholder: "How you currently read the answer",
    confirmSaveReading: "Save",
    cancel: "Cancel",
    listeningStatus: "The instrument is listening and thinking.",
    symbolTitle: "Meaning",
    defaultMeaning: "Default",
    personalMeaning: "Personal",
    emptyPersonalMeaning: "No personal meanings yet.",
    editMeaning: "Edit",
    doneEditing: "Done",
    personalHint:
      "Default meanings stay fixed as reference. Personal meanings live as separate entries and can be edited independently.",
    addMeaning: "Add",
    deleteMeaning: "Delete",
    newMeaningPlaceholder: "New meaning",
    close: "Close",
    settingsTitle: "Menu",
    settingsButton: "Menu",
    settingsSection: "Settings",
    meditativeMode: "Meditative mode",
    immersiveModeOff: "Standard mode",
    symbolsSection: "Symbols",
    archiveSection: "Archive",
    helpSection: "Help",
    language: "Language",
    theme: "Theme",
    dawn: "Dawn",
    night: "Night",
    journalTitle: "Archive",
    catalogTitle: "All symbols",
    catalogHint:
      "Browse every sign here, review the default meanings, and jump into editing your personal interpretations.",
    lexiconTitle: "Symbol lexicon",
    lexiconSymbolLabel: "Editing symbol",
    archiveHint:
      "Saved readings keep the question wording, the answer chain, and your own short formulation of what it meant.",
    emptyJournal: "No saved readings yet.",
    answerTitle: "Answer",
    answerPlaceholder: "The answer will appear here after the pause.",
    openSaved: "Open",
    savedAt: "Saved",
    deleteSaved: "Delete",
    answerSummaryLabel: "Reading",
    chooseSymbolTitle: "Choose a symbol",
    chooseSymbolHint: "Scroll through the list and pick the sign for this question slot.",
  },
};
