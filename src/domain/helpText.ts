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
    guidanceTitle: "Как читать",
    guidancePreview:
      "Алетиометр отвечает образами: ты задаёшь вопрос тремя символами, держишь формулировку в голове, а прибор возвращает цепочку ответа.",
    guidanceSteps:
      "Выбери три символа колесиками или через селект, нажми «Спросить», дождись цепочки ответа и затем прочитай её через базовые значения, личные трактовки и сам контекст вопроса.",
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
        title: "Как читать сочетания",
        items: [
          "Иногда один символ не сообщает новый смысл сам по себе, а подсказывает, в каком ключе читать следующий знак.",
          "Если хамелеон встаёт рядом с грифоном, акцент может сместиться от храбрости к терпению, выжиданию или осторожности.",
          "Полезно замечать не только отдельные знаки, но и маленькие пары и связки, которые начинают повторяться именно у тебя.",
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
      {
        title: "Примеры личного словаря",
        intro:
          "Ниже несколько авторских примеров личного словаря. Это не готовый канон, а скорее образец того, как со временем обрастает личный язык прибора.",
        items: [
          "Альфа и Омега — язык, разговор.",
          "Змея — ожидание перед броском.",
          "Якорь — связь.",
          "Ангел — воспоминания.",
          "Улей — город, люди, страна.",
          "Дельфин — дружба, друг.",
          "Сад за стеной — девушка, объект любви.",
          "Меч — драка, рана, боль.",
          "Лошадь — расстояние.",
          "Сова — мудрость.",
        ],
      },
    ],
  },
  en: {
    guidanceTitle: "How to read",
    guidancePreview:
      "The alethiometer answers in images: you frame the question with three symbols, hold the wording in mind, and the instrument returns a chain of signs.",
    guidanceSteps:
      "Choose three symbols with the wheels or the picker, press Ask, wait for the answer chain, then read it through the default meanings, your personal interpretations, and the context of the question.",
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
        title: "Reading combinations",
        items: [
          "Sometimes one symbol does not add a new meaning on its own, but tells you how the next sign should be read.",
          "If the chameleon stands beside the griffin, the reading may drift from courage toward patience, delay, or caution.",
          "It helps to notice not only single signs, but also small pairs and recurring combinations that become meaningful for you personally.",
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
      {
        title: "Examples from the author's lexicon",
        intro:
          "Below are a few personal examples from the author's lexicon. They are not meant as canon, only as a glimpse of how a private symbolic language can grow around the device.",
        items: [
          "Alpha and Omega — language, conversation.",
          "Serpent — waiting before a lunge.",
          "Anchor — link.",
          "Angel — memories.",
          "Beehive — city, people, country.",
          "Dolphin — friendship, friend.",
          "Walled Garden — girl, the object of love.",
          "Sword — fight, injury, pain.",
          "Horse — distance.",
          "Owl — wisdom.",
        ],
      },
    ],
  },
};
