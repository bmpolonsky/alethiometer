import type { Locale } from "./types";

interface HelpSection {
  title: string;
  items: string[];
}

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
  countdownStatus: string;
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
  guidanceTitle: string;
  guidancePreview: string;
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
  helpIntro: string;
  helpSections: HelpSection[];
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
    countdownStatus: "Прибор слушает и обдумывает.",
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
    newMeaningPlaceholder: "Новая личная трактовка",
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
    guidanceTitle: "Как читать",
    guidancePreview:
      "Три символа задают вопрос, ответ приходит цепочкой, а смысл рождается из твоего собственного словаря.",
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
    helpIntro:
      "Алетиометр лучше работает как образный прибор: он не произносит фразу, а собирает направление из знаков, ритма и твоего словаря.",
    helpSections: [
      {
        title: "Как задавать вопрос",
        items: [
          "Выбери три символа, которые точнее всего описывают саму ситуацию, а не желаемый ответ.",
          "Сформулируй вопрос коротко и держи мысль в голове, пока прибор молчит.",
          "Если вопрос выходит рыхлым, сначала уточни его смысл, а уже потом запускай чтение.",
        ],
      },
      {
        title: "Как читать ответ",
        items: [
          "Ответ приходит цепочкой знаков: важен не только каждый символ, но и порядок их появления.",
          "Сначала прочитай базовые значения, затем добавь свои личные ассоциации и контекст вопроса.",
          "Не пытайся переводить ответ в буквальное предложение слишком рано: алетиометр говорит образами.",
        ],
      },
      {
        title: "Как вести словарь",
        items: [
          "Базовые трактовки остаются фиксированной опорой и не редактируются.",
          "Личные значения лучше хранить короткими отдельными пунктами, чтобы их было легко перестраивать со временем.",
          "После сохраненного чтения полезно оставлять заметку: позже по архиву видно, как менялся собственный язык символов.",
        ],
      },
    ],
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
    countdownStatus: "The instrument is listening and thinking.",
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
    newMeaningPlaceholder: "New personal meaning",
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
    guidanceTitle: "How to read",
    guidancePreview:
      "Three symbols frame the question, the answer arrives as a chain, and the meaning grows out of your own lexicon.",
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
    helpIntro:
      "The alethiometer works best as a symbolic instrument: it does not speak in literal sentences, but in signs, pacing, and the vocabulary you build around them.",
    helpSections: [
      {
        title: "Framing the question",
        items: [
          "Choose three symbols that describe the situation itself, not the answer you wish to hear.",
          "Keep the wording short and hold the thought while the instrument stays silent.",
          "If the question feels vague, refine it first and only then begin the reading.",
        ],
      },
      {
        title: "Reading the answer",
        items: [
          "The answer arrives as a sequence of signs, so both the symbols and their order matter.",
          "Read the default meanings first, then layer in your own personal associations and the context of the question.",
          "Do not force the answer into a literal sentence too early. The alethiometer speaks in images.",
        ],
      },
      {
        title: "Keeping a lexicon",
        items: [
          "Default meanings remain fixed as a stable reference point.",
          "Personal meanings work best as short separate entries that can evolve over time.",
          "Adding notes to saved readings helps you see how your own symbolic language changes in practice.",
        ],
      },
    ],
  },
};
