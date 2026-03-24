import type { Locale } from "./types";

interface HelpSection {
  title: string;
  intro?: string;
  items: string[];
}

export interface HelpText {
  guidanceTitle: string;
  guidancePreview: string;
  guidanceSteps: string;
  helpIntro: string;
  helpSections: HelpSection[];
}

export const helpText: Record<Locale, HelpText> = {
  ru: {
    guidanceTitle: "Как пользоваться",
    guidancePreview:
      "Алетиометр не отвечает готовой фразой: он показывает ответ знаками, которые нужно читать через контекст вопроса и свой словарь.",
    guidanceSteps:
      "Выбери три символа колёсиками или через список, задай вопрос кнопкой «Спросить» или долгим нажатием на сам прибор, дождись ответа и прочитай его через базовые значения, личные трактовки и контекст вопроса.",
    helpIntro:
      "Алетиометр лучше работает как образный прибор: он не произносит готовую фразу, а отвечает знаками, смысл которых складывается из порядка, сочетаний и связи с твоим вопросом.",
    helpSections: [
      {
        title: "Как задавать вопрос",
        items: [
          "Выбери три символа, которые точнее всего описывают ситуацию, а не тот ответ, который хочется услышать.",
          "Сформулируй вопрос коротко и удерживай его в голове, пока задаёшь его кнопкой «Спросить» или долгим нажатием на сам прибор.",
          "Если вопрос получается расплывчатым, сначала уточни его смысл и только потом спрашивай.",
        ],
      },
      {
        title: "Как читать ответ",
        items: [
          "Ответ складывается из нескольких знаков: важен не только каждый символ, но и порядок их появления.",
          "Сначала опирайся на базовые значения, затем добавляй личные ассоциации и контекст вопроса.",
          "Не пытайся слишком рано переводить ответ в буквальное предложение: алетиометр говорит образами.",
        ],
      },
      {
        title: "Как читать сочетания",
        items: [
          "Иногда один символ не сообщает новый смысл сам по себе, а подсказывает, в каком ключе читать следующий знак.",
          "Если хамелеон встаёт рядом с грифоном, акцент может сместиться с храбрости на терпение, выжидание или осторожность.",
          "Полезно замечать не только отдельные знаки, но и небольшие пары и связки, которые начинают повторяться именно у тебя.",
        ],
      },
      {
        title: "Как вести словарь",
        items: [
          "Базовые значения остаются фиксированной опорой и не редактируются.",
          "Личные трактовки лучше хранить короткими отдельными пунктами, чтобы их было легче пересматривать и уточнять со временем.",
          "После важного ответа полезно оставлять заметку: со временем по архиву видно, как менялся твой язык символов.",
        ],
      },
      {
        title: "Примеры личного словаря",
        intro:
          "Ниже несколько авторских примеров личного словаря. Это не канон, а скорее образец того, как со временем складывается личный язык прибора.",
        items: [
          "Альфа и Омега — язык, разговор.",
          "Змея — ожидание перед броском.",
          "Якорь — связь.",
          "Ангел — воспоминания.",
          "Улей — город, люди, страна.",
          "Дельфин — дружба, друг.",
          "Сад за стеной — девушка, возлюбленная.",
          "Меч — драка, рана, боль.",
          "Лошадь — расстояние.",
          "Сова — мудрость.",
        ],
      },
      {
        title: "Как не потерять данные",
        items: [
          "Архив и личные трактовки хранятся прямо в браузере на этом устройстве.",
          "Если очистить кэш или данные сайта, они могут исчезнуть.",
          "Чтобы сохранить их отдельно, открой настройки и сделай экспорт резервной копии в JSON-файл.",
        ],
      },
    ],
  },
  en: {
    guidanceTitle: "How to use it",
    guidancePreview:
      "The alethiometer does not answer with a literal sentence: it shows its answer through signs that need to be read through the context of the question and your own lexicon.",
    guidanceSteps:
      "Choose three symbols with the wheels or from the list, ask with the Ask button or by long-pressing the device itself, wait for the answer, then read it through the default meanings, your personal interpretations, and the context of the question.",
    helpIntro:
      "The alethiometer works best as a symbolic instrument: it does not give a ready-made sentence, but answers through signs whose meaning comes from their order, combinations, and relation to your question.",
    helpSections: [
      {
        title: "Framing the question",
        items: [
          "Choose three symbols that describe the situation itself, not the answer you hope to hear.",
          "Keep the wording short and hold it in mind while asking with the Ask button or a long press on the device itself.",
          "If the question feels unclear, refine it first and only then ask it.",
        ],
      },
      {
        title: "Reading the answer",
        items: [
          "The answer is made up of several signs, so both the symbols and their order matter.",
          "Start with the default meanings, then layer in your personal associations and the context of the question.",
          "Do not turn the answer into a literal sentence too early. The alethiometer speaks in images.",
        ],
      },
      {
        title: "Reading combinations",
        items: [
          "Sometimes one symbol does not add a new meaning on its own, but tells you how the next sign should be read.",
          "If the chameleon appears beside the griffin, the emphasis may shift from courage toward patience, waiting, or caution.",
          "It helps to notice not only single signs, but also small pairs and combinations that start recurring for you personally.",
        ],
      },
      {
        title: "Keeping a lexicon",
        items: [
          "Default meanings remain a fixed point of reference.",
          "Personal meanings work best as short separate entries that can be revised over time.",
          "Adding notes after an important answer helps you see how your own symbolic language changes over time.",
        ],
      },
      {
        title: "Examples from the author's lexicon",
        intro:
          "Below are a few personal examples from the author's lexicon. They are not canon, only a glimpse of how a private symbolic language can grow around the device.",
        items: [
          "Alpha and Omega — language, conversation.",
          "Serpent — waiting before a lunge.",
          "Anchor — link.",
          "Angel — memories.",
          "Beehive — city, people, country.",
          "Dolphin — friendship, friend.",
          "Walled Garden — girl, beloved.",
          "Sword — fight, injury, pain.",
          "Horse — distance.",
          "Owl — wisdom.",
        ],
      },
      {
        title: "How to keep your data safe",
        items: [
          "Your archive and personal interpretations are stored in the browser on this device.",
          "If you clear cache or site data, they may disappear.",
          "To keep a separate copy, open Settings and export a JSON backup.",
        ],
      },
    ],
  },
};
