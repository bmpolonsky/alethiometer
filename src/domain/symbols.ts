import type { LocalizedText, SymbolEntry } from "./types";

interface SymbolSeed {
  imageFile: string;
  title: LocalizedText;
  meanings: LocalizedText<string[]>;
}

const symbolSeeds: SymbolSeed[] = [
  {
    imageFile: "Hourglass.webp",
    title: { ru: "Песочные часы", en: "Hourglass" },
    meanings: {
      ru: ["Время", "Смерть", "Изменения"],
      en: ["Time", "Death", "Change"],
    },
  },
  {
    imageFile: "Sun.webp",
    title: { ru: "Солнце", en: "Sun" },
    meanings: {
      ru: ["День", "Власть", "Истина"],
      en: ["Day", "Authority", "Truth"],
    },
  },
  {
    imageFile: "Alpha_and_Omega.webp",
    title: { ru: "Альфа и Омега", en: "Alpha and Omega" },
    meanings: {
      ru: ["Завершённость", "Процесс", "Неизбежное"],
      en: ["Finality", "Process", "Inevitability"],
    },
  },
  {
    imageFile: "Marionette.webp",
    title: { ru: "Марионетка", en: "Marionette" },
    meanings: {
      ru: ["Повиновение", "Покорность", "Грация"],
      en: ["Obedience", "Submission", "Grace"],
    },
  },
  {
    imageFile: "Serpent.webp",
    title: { ru: "Змея", en: "Serpent" },
    meanings: {
      ru: ["Зло", "Вероломство", "Врождённая мудрость"],
      en: ["Evil", "Guile", "Natural wisdom"],
    },
  },
  {
    imageFile: "Caidron_crucible.webp",
    title: { ru: "Тигель", en: "Crucible" },
    meanings: {
      ru: ["Алхимия", "Ремесло", "Приобретённая мудрость"],
      en: ["Alchemy", "Craft", "Acquired wisdom"],
    },
  },
  {
    imageFile: "Anchor.webp",
    title: { ru: "Якорь", en: "Anchor" },
    meanings: {
      ru: ["Надежда", "Устойчивость", "Предотвращение"],
      en: ["Hope", "Steadfastness", "Prevention"],
    },
  },
  {
    imageFile: "Angel.webp",
    title: { ru: "Ангел", en: "Angel" },
    meanings: {
      ru: ["Посланник", "Иерархия", "Непослушание"],
      en: ["Messenger", "Hierarchy", "Disobedience"],
    },
  },
  {
    imageFile: "Helmet.webp",
    title: { ru: "Шлем", en: "Helmet" },
    meanings: {
      ru: ["Война", "Защита", "Узость взглядов"],
      en: ["War", "Protection", "Narrow vision"],
    },
  },
  {
    imageFile: "Beehive.webp",
    title: { ru: "Улей", en: "Beehive" },
    meanings: {
      ru: ["Плодотворный труд", "Сладость", "Свет"],
      en: ["Productive work", "Sweetness", "Light"],
    },
  },
  {
    imageFile: "Moon.webp",
    title: { ru: "Луна", en: "Moon" },
    meanings: {
      ru: ["Целомудрие", "Тайна", "Сверхъестественное"],
      en: ["Chastity", "Mystery", "The uncanny"],
    },
  },
  {
    imageFile: "Madonna.webp",
    title: { ru: "Богоматерь", en: "Madonna" },
    meanings: {
      ru: ["Материнство", "Женское начало", "Поклонение"],
      en: ["Motherhood", "The feminine", "Worship"],
    },
  },
  {
    imageFile: "Apple.webp",
    title: { ru: "Яблоко", en: "Apple" },
    meanings: {
      ru: ["Грех", "Знание", "Тщеславие"],
      en: ["Sin", "Knowledge", "Vanity"],
    },
  },
  {
    imageFile: "Bird.webp",
    title: { ru: "Птица", en: "Bird" },
    meanings: {
      ru: ["Душа (деймон)", "Весна", "Брак"],
      en: ["The soul (daemon)", "Spring", "Marriage"],
    },
  },
  {
    imageFile: "Bread.webp",
    title: { ru: "Хлеб", en: "Bread" },
    meanings: {
      ru: ["Пища", "Христос", "Жертва"],
      en: ["Nourishment", "Christ", "Sacrifice"],
    },
  },
  {
    imageFile: "Ant.webp",
    title: { ru: "Муравей", en: "Ant" },
    meanings: {
      ru: ["Однообразный труд", "Прилежание", "Скука"],
      en: ["Mechanical work", "Diligence", "Tedium"],
    },
  },
  {
    imageFile: "Bull.webp",
    title: { ru: "Бык", en: "Bull" },
    meanings: {
      ru: ["Земля", "Мощь", "Честность"],
      en: ["Earth", "Power", "Honesty"],
    },
  },
  {
    imageFile: "Candle.webp",
    title: { ru: "Свеча", en: "Candle" },
    meanings: {
      ru: ["Огонь", "Вера", "Обучение"],
      en: ["Fire", "Faith", "Learning"],
    },
  },
  {
    imageFile: "Cornucopia.webp",
    title: { ru: "Рог изобилия", en: "Cornucopia" },
    meanings: {
      ru: ["Богатство", "Осень", "Радушие"],
      en: ["Wealth", "Autumn", "Hospitality"],
    },
  },
  {
    imageFile: "Chameleon.webp",
    title: { ru: "Хамелеон", en: "Chameleon" },
    meanings: {
      ru: ["Воздух", "Жадность", "Терпение"],
      en: ["Air", "Greed", "Patience"],
    },
  },
  {
    imageFile: "Thunderbolt.webp",
    title: { ru: "Молния", en: "Thunderbolt" },
    meanings: {
      ru: ["Вдохновение", "Судьба", "Шанс"],
      en: ["Inspiration", "Fate", "Chance"],
    },
  },
  {
    imageFile: "Dolphin.webp",
    title: { ru: "Дельфин", en: "Dolphin" },
    meanings: {
      ru: ["Вода", "Возрождение", "Поддержка"],
      en: ["Water", "Resurrection", "Succour"],
    },
  },
  {
    imageFile: "Walled_Garden.webp",
    title: { ru: "Сад за стеной", en: "Walled Garden" },
    meanings: {
      ru: ["Природа", "Невинность", "Порядок"],
      en: ["Nature", "Innocence", "Order"],
    },
  },
  {
    imageFile: "Globe.webp",
    title: { ru: "Глобус", en: "Globe" },
    meanings: {
      ru: ["Политика", "Независимость", "Слава"],
      en: ["Politics", "Sovereignty", "Fame"],
    },
  },
  {
    imageFile: "Sword.webp",
    title: { ru: "Меч", en: "Sword" },
    meanings: {
      ru: ["Правосудие", "Сила духа", "Церковь"],
      en: ["Justice", "Fortitude", "The Church"],
    },
  },
  {
    imageFile: "Griffin.webp",
    title: { ru: "Грифон", en: "Griffin" },
    meanings: {
      ru: ["Сокровище", "Бдительность", "Храбрость"],
      en: ["Treasure", "Watchfulness", "Courage"],
    },
  },
  {
    imageFile: "Horse.webp",
    title: { ru: "Лошадь", en: "Horse" },
    meanings: {
      ru: ["Европа", "Путешествия", "Верность"],
      en: ["Europe", "Journeys", "Fidelity"],
    },
  },
  {
    imageFile: "Camel.webp",
    title: { ru: "Верблюд", en: "Camel" },
    meanings: {
      ru: ["Азия", "Лето", "Упорство"],
      en: ["Asia", "Summer", "Perseverance"],
    },
  },
  {
    imageFile: "Elephant.webp",
    title: { ru: "Слон", en: "Elephant" },
    meanings: {
      ru: ["Африка", "Милосердие", "Сдержанность"],
      en: ["Africa", "Charity", "Continence"],
    },
  },
  {
    imageFile: "Crocodile_caiman.webp",
    title: { ru: "Крокодил", en: "Crocodile" },
    meanings: {
      ru: ["Америка", "Ненасытность", "Предприимчивость"],
      en: ["America", "Rapacity", "Enterprise"],
    },
  },
  {
    imageFile: "Baby.webp",
    title: { ru: "Ребёнок", en: "Baby" },
    meanings: {
      ru: ["Будущее", "Податливость", "Беспомощность"],
      en: ["Future", "Malleability", "Helplessness"],
    },
  },
  {
    imageFile: "Compass.webp",
    title: { ru: "Циркуль", en: "Compass" },
    meanings: {
      ru: ["Измерение", "Математика", "Наука"],
      en: ["Measurement", "Mathematics", "Science"],
    },
  },
  {
    imageFile: "Lute.webp",
    title: { ru: "Лютня", en: "Lute" },
    meanings: {
      ru: ["Поэзия", "Ораторство", "Философия"],
      en: ["Poetry", "Rhetoric", "Philosophy"],
    },
  },
  {
    imageFile: "Tree.webp",
    title: { ru: "Дерево", en: "Tree" },
    meanings: {
      ru: ["Стойкость", "Укрытие", "Плодородие"],
      en: ["Firmness", "Shelter", "Fertility"],
    },
  },
  {
    imageFile: "Wild_man.webp",
    title: { ru: "Дикарь", en: "Wild Man" },
    meanings: {
      ru: ["Варвар", "Мужское начало", "Похоть"],
      en: ["Wild man", "The masculine", "Lust"],
    },
  },
  {
    imageFile: "Owl.webp",
    title: { ru: "Сова", en: "Owl" },
    meanings: {
      ru: ["Ночь", "Зима", "Страх"],
      en: ["Night", "Winter", "Fear"],
    },
  },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/\(.+?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const symbolCatalog: SymbolEntry[] = symbolSeeds.map((symbol, index) => ({
  id: index,
  slug: slugify(symbol.title.en),
  imageSrc: `${import.meta.env.BASE_URL}assets/symbols/${symbol.imageFile}`,
  title: symbol.title,
  meanings: symbol.meanings,
}));
