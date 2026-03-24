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
  actionsTitle: string;
  settingsSection: string;
  meditativeMode: string;
  immersiveModeOff: string;
  symbolsSection: string;
  archiveSection: string;
  helpSection: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
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
    saveReading: "Сохранить в архив",
    saveReadingTitle: "Сохранить в архив",
    saveReadingQuestionLabel: "Формулировка вопроса",
    saveReadingQuestionPlaceholder: "Коротко: в чём был вопрос",
    saveReadingAnswerLabel: "Твоя трактовка",
    saveReadingAnswerPlaceholder: "Коротко сформулируй, что для тебя значит этот ответ",
    confirmSaveReading: "Сохранить",
    cancel: "Отмена",
    listeningStatus: "Прибор ищет ответ.",
    symbolTitle: "Значение символа",
    defaultMeaning: "Базовые значения",
    personalMeaning: "Личные трактовки",
    emptyPersonalMeaning: "Пока нет личных трактовок.",
    editMeaning: "Редактировать",
    doneEditing: "Готово",
    personalHint:
      "Базовые значения остаются опорой. Личные трактовки хранятся отдельными пунктами, и каждую из них можно редактировать отдельно.",
    addMeaning: "Добавить",
    deleteMeaning: "Удалить",
    newMeaningPlaceholder: "Новая трактовка",
    close: "Закрыть",
    settingsTitle: "Меню",
    settingsButton: "Меню",
    actionsTitle: "Действия",
    settingsSection: "Настройки",
    meditativeMode: "Медитативный режим",
    immersiveModeOff: "Обычный режим",
    symbolsSection: "Символы",
    archiveSection: "Архив",
    helpSection: "Справка",
    language: "Язык",
    theme: "Тема",
    light: "Светлая",
    dark: "Темная",
    journalTitle: "Архив",
    catalogTitle: "Все символы",
    catalogHint:
      "Здесь можно открыть любой знак, посмотреть его базовые значения и перейти к редактированию личных трактовок.",
    lexiconTitle: "Словарь символа",
    lexiconSymbolLabel: "Редактируемый символ",
    archiveHint:
      "В архиве сохраняются вопрос, ответ и твоя трактовка.",
    emptyJournal: "Пока в архиве ничего нет.",
    answerTitle: "Ответ",
    answerPlaceholder: "Ответ появится здесь после короткой паузы.",
    openSaved: "Открыть",
    savedAt: "Сохранено",
    deleteSaved: "Удалить",
    answerSummaryLabel: "Твоя трактовка",
    chooseSymbolTitle: "Выбери символ",
    chooseSymbolHint: "Прокрути список и выбери знак для этой части вопроса.",
  },
  en: {
    questionTitle: "Question",
    ask: "Ask",
    saveReading: "Save to archive",
    saveReadingTitle: "Save to archive",
    saveReadingQuestionLabel: "Question wording",
    saveReadingQuestionPlaceholder: "Briefly: what the question was",
    saveReadingAnswerLabel: "Your interpretation",
    saveReadingAnswerPlaceholder: "How you understand this answer right now",
    confirmSaveReading: "Save",
    cancel: "Cancel",
    listeningStatus: "The instrument is searching for an answer.",
    symbolTitle: "Symbol meaning",
    defaultMeaning: "Default meanings",
    personalMeaning: "Personal interpretations",
    emptyPersonalMeaning: "No personal meanings yet.",
    editMeaning: "Edit",
    doneEditing: "Done",
    personalHint:
      "Default meanings remain a reference point. Personal interpretations are stored as separate entries and can be edited one by one.",
    addMeaning: "Add",
    deleteMeaning: "Delete",
    newMeaningPlaceholder: "New meaning",
    close: "Close",
    settingsTitle: "Menu",
    settingsButton: "Menu",
    actionsTitle: "Actions",
    settingsSection: "Settings",
    meditativeMode: "Meditative mode",
    immersiveModeOff: "Standard mode",
    symbolsSection: "Symbols",
    archiveSection: "Archive",
    helpSection: "Help",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    journalTitle: "Archive",
    catalogTitle: "All symbols",
    catalogHint:
      "Open any sign here, review its default meanings, and edit your personal interpretations.",
    lexiconTitle: "Symbol lexicon",
    lexiconSymbolLabel: "Editing symbol",
    archiveHint:
      "The archive keeps the question, the answer, and your interpretation.",
    emptyJournal: "The archive is empty for now.",
    answerTitle: "Answer",
    answerPlaceholder: "The answer will appear here after a short pause.",
    openSaved: "Open",
    savedAt: "Saved",
    deleteSaved: "Delete",
    answerSummaryLabel: "Your interpretation",
    chooseSymbolTitle: "Choose a symbol",
    chooseSymbolHint: "Scroll through the list and pick the sign for this part of the question.",
  },
};
