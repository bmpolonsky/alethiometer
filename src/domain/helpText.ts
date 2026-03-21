import type { Locale } from "./types";

interface HelpSection {
  title: string;
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
      "Алетиометр отвечает образами: ты задаёшь вопрос тремя символами, а прибор возвращает цепочку ответа.",
    guidanceSteps:
      "Выбери три символа колесиками или через селект, нажми «Спросить», дождись ответа и потом прочитай его через базовые и личные трактовки.",
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
    guidanceTitle: "How to read",
    guidancePreview:
      "The alethiometer answers in images: you frame the question with three symbols and the instrument returns a chain of signs.",
    guidanceSteps:
      "Choose three symbols with the wheels or the picker, press Ask, wait for the answer, then read it through the default and personal meanings.",
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
