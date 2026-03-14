import type { Locale, SymbolEntry } from "./types";

const rawRu = String.raw`○Песочные часы — Время, Смерть, изменения.○Солнце — День, Власть, истина.○Альфа и Омега — Завершенность, Процесс, неизбежное.○Марионетка — Повиновение, Покорность, учтивость.○Змея — Зло, Вероломство, врожденная мудрость.○Котел (тигель) — Алхимия, Ремесло, приобретенная мудрость.○Якорь — Надежда, Устойчивость, предотвращение.○Ангел — Посланник, Иерархия, непослушание.○Шлем — Война, Защита, узость взглядов.○Улей — Плодотворный труд, Сладость, свет.○Луна — Целомудрие, Тайна, сверхъестественное.○Богоматерь — Материнство, Женское, поклонение.○Яблоко — Грех, Знание, тщеславие.○Птица — Душа (деймон), Весна, брак.○Хлеб — Пища, Христос, жертва.○Муравей — Однообразный труд, Прилежание, скука.○Бык — Земля, Мощь, честность.○Свеча — Огонь, Вера, обучение.○Рог изобилия — Богатство, Осень, радушие.○Хамелеон — Воздух, Скупость, терпение.○Молния — Вдохновение, Судьба, шанс.○Дельфин — Вода, Возрождение, поддержка.○Сад за стеной — Природа, Невинность, порядок.○Глобус — Политика, Независимость, известность.○Меч — Правосудие, Сила духа, Церковь.○Грифон — Сокровище, Бдительность, храбрость.○Лошадь — Европа, Путешествия, верность.○Верблюд — Азия, Лето, упорство.○Слон — Африка, Милосердие, сдержанность.○Крокодил (кайман) — Америка, Ненасытность, предприимчивость.○Ребенок — Будущее, Податливость, беспомощность.○Циркуль — Измерение, Математика, наука.○Лютня — Поэзия, Ораторство, философия.○Дерево — Неколебимость, Укрытие, плодородие.○Дикарь — Варвар, Мужское, похоть.○Сова — Ночь, Зима, страх.○`;

const rawEn = String.raw`○Hourglass — Time, Death, change.○Sun — Day, Authority, truth.○Alpha and Omega — Finality, Process, inevitability.○Marionette — Obedience, Submission, grace.○Serpent — Evil, Guile, natural wisdom.○Cauldron (crucible) — Alchemy, Craft, achieved wisdom.○Anchor — Hope, Steadfastness, prevention.○Angel — Messenger, Hierarchy, disobedience.○Helmet — War, Protection, narrow vision.○Beehive — Productive work, Sweetness, light.○Moon — Chastity, Mystery, the uncanny.○Madonna — Motherhood, The feminine, worship.○Apple — Sin, Knowledge, vanity.○Bird — The soul (the daemon), Spring, marriage.○Bread — Nourishment, Christ, sacrifice.○Ant — Mechanical work, Diligence, tedium.○Bull — Earth, Power, honesty.○Candle — Fire, Faith, learning.○Cornucopia — Wealth, Autumn, hospitality.○Chameleon — Air, Greed, patience.○Thunderbolt — Inspiration, Fate, chance.○Dolphin — Water, Resurrection, succour.○Walled Garden — Nature, Innocence, order.○Globe — Politics, Sovereignty, fame.○Sword — Justice, Fortitude, the Church.○Griffin — Treasure, Watchfulness, courage.○Horse — Europe, Journeys, fidelity.○Camel — Asia, Summer, perseverance.○Elephant — Africa, Charity, continence.○Crocodile (caiman) — America, Rapacity, enterprise.○Baby — The future, Malleability, helplessness.○Compass — Measurement, Mathematics, science.○Lute — Poetry, Rhetoric, philosophy.○Tree — Firmness, Shelter, fertility.○Wild man — Wild man, The masculine, lust.○Owl — Night, Winter, fear.○`;

const symbolImageFiles = [
  "Hourglass.jpg",
  "Sun.jpg",
  "Alpha_and_Omega.jpg",
  "Marionette.jpg",
  "Serpent.jpg",
  "Caidron_crucible.jpg",
  "Anchor.jpg",
  "Angel.jpg",
  "Helmet.jpg",
  "Beehive.jpg",
  "Moon.jpg",
  "Madonna.jpg",
  "Apple.jpg",
  "Bird.jpg",
  "Bread.jpg",
  "Ant.jpg",
  "Bull.jpg",
  "Candle.jpg",
  "Cornucopia.jpg",
  "Chameleon.jpg",
  "Thunderbolt.jpg",
  "Dolphin.jpg",
  "Walled_Garden.jpg",
  "Globe.jpg",
  "Sword.jpg",
  "Griffin.jpg",
  "Horse.jpg",
  "Camel.jpg",
  "Elephant.jpg",
  "Crocodile_caiman.jpg",
  "Baby.jpg",
  "Compass.jpg",
  "Lute.jpg",
  "Tree.jpg",
  "Wild_man.jpg",
  "Owl.jpg",
];

function parseCatalog(source: string) {
  return source
    .split("○")
    .filter(Boolean)
    .map((entry) => {
      const [title, meaning] = entry.split(" — ");

      return {
        title: title?.trim() ?? "",
        meaning: meaning?.trim() ?? "",
      };
    });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\(.+?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ruSymbols = parseCatalog(rawRu);
const enSymbols = parseCatalog(rawEn);

export const symbolCatalog: SymbolEntry[] = ruSymbols.map((ruSymbol, index) => {
  const enSymbol = enSymbols[index];

  return {
    id: index,
    slug: slugify(enSymbol?.title ?? `symbol-${index + 1}`),
    imageSrc: `/assets/symbols/${symbolImageFiles[index]}`,
    title: {
      ru: ruSymbol.title,
      en: enSymbol?.title ?? ruSymbol.title,
    },
    meanings: {
      ru: ruSymbol.meaning,
      en: enSymbol?.meaning ?? ruSymbol.meaning,
    },
  };
});

export const guidanceText: Record<Locale, string[]> = {
  ru: [
    "Выбери три символа, которые лучше всего описывают вопрос, и мысленно держи формулировку, пока прибор молчит.",
    "После паузы ответ проявится цепочкой знаков. Читай их как образный язык, а не как буквальный текст.",
    "Стандартные значения можно переписывать под себя: личный словарь и есть главное умение работы с алетиометром.",
  ],
  en: [
    "Choose three symbols that best frame the question and keep the thought in mind while the instrument stays silent.",
    "After a short pause the answer appears as a sequence of signs. Read it as a symbolic language, not a literal sentence.",
    "You can reshape the default meanings into your own lexicon. That personal vocabulary is part of the craft.",
  ],
};
