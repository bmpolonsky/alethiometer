import type { LocalizedText, SymbolEntry } from "./types";

interface SymbolSeed {
  imageFile: string;
  title: LocalizedText;
  meanings: LocalizedText<string[]>;
}

const symbolSeeds: SymbolSeed[] = [
  {
    imageFile: "Hourglass.jpg",
    title: { ru: "Песочные часы", en: "Hourglass" },
    meanings: {
      ru: ["Время", "Смерть", "Изменения"],
      en: ["Time", "Death", "Change"],
    },
  },
  {
    imageFile: "Sun.jpg",
    title: { ru: "Солнце", en: "Sun" },
    meanings: {
      ru: ["День", "Власть", "Истина"],
      en: ["Day", "Authority", "Truth"],
    },
  },
  {
    imageFile: "Alpha_and_Omega.jpg",
    title: { ru: "Альфа и Омега", en: "Alpha and Omega" },
    meanings: {
      ru: ["Завершенность", "Процесс", "Неизбежное"],
      en: ["Finality", "Process", "Inevitability"],
    },
  },
  {
    imageFile: "Marionette.jpg",
    title: { ru: "Марионетка", en: "Marionette" },
    meanings: {
      ru: ["Повиновение", "Покорность", "Грация"],
      en: ["Obedience", "Submission", "Grace"],
    },
  },
  {
    imageFile: "Serpent.jpg",
    title: { ru: "Змея", en: "Serpent" },
    meanings: {
      ru: ["Зло", "Вероломство", "Врожденная мудрость"],
      en: ["Evil", "Guile", "Natural wisdom"],
    },
  },
  {
    imageFile: "Caidron_crucible.jpg",
    title: { ru: "Тигель", en: "Crucible" },
    meanings: {
      ru: ["Алхимия", "Ремесло", "Приобретенная мудрость"],
      en: ["Alchemy", "Craft", "Achieved wisdom"],
    },
  },
  {
    imageFile: "Anchor.jpg",
    title: { ru: "Якорь", en: "Anchor" },
    meanings: {
      ru: ["Надежда", "Устойчивость", "Предотвращение"],
      en: ["Hope", "Steadfastness", "Prevention"],
    },
  },
  {
    imageFile: "Angel.jpg",
    title: { ru: "Ангел", en: "Angel" },
    meanings: {
      ru: ["Посланник", "Иерархия", "Непослушание"],
      en: ["Messenger", "Hierarchy", "Disobedience"],
    },
  },
  {
    imageFile: "Helmet.jpg",
    title: { ru: "Шлем", en: "Helmet" },
    meanings: {
      ru: ["Война", "Защита", "Узость взглядов"],
      en: ["War", "Protection", "Narrow vision"],
    },
  },
  {
    imageFile: "Beehive.jpg",
    title: { ru: "Улей", en: "Beehive" },
    meanings: {
      ru: ["Плодотворный труд", "Сладость", "Свет"],
      en: ["Productive work", "Sweetness", "Light"],
    },
  },
  {
    imageFile: "Moon.jpg",
    title: { ru: "Луна", en: "Moon" },
    meanings: {
      ru: ["Целомудрие", "Тайна", "Сверхъестественное"],
      en: ["Chastity", "Mystery", "The uncanny"],
    },
  },
  {
    imageFile: "Madonna.jpg",
    title: { ru: "Богоматерь", en: "Madonna" },
    meanings: {
      ru: ["Материнство", "Женское начало", "Поклонение"],
      en: ["Motherhood", "The feminine", "Worship"],
    },
  },
  {
    imageFile: "Apple.jpg",
    title: { ru: "Яблоко", en: "Apple" },
    meanings: {
      ru: ["Грех", "Знание", "Тщеславие"],
      en: ["Sin", "Knowledge", "Vanity"],
    },
  },
  {
    imageFile: "Bird.jpg",
    title: { ru: "Птица", en: "Bird" },
    meanings: {
      ru: ["Душа (деймон)", "Весна", "Брак"],
      en: ["The soul (the daemon)", "Spring", "Marriage"],
    },
  },
  {
    imageFile: "Bread.jpg",
    title: { ru: "Хлеб", en: "Bread" },
    meanings: {
      ru: ["Пища", "Христос", "Жертва"],
      en: ["Nourishment", "Christ", "Sacrifice"],
    },
  },
  {
    imageFile: "Ant.jpg",
    title: { ru: "Муравей", en: "Ant" },
    meanings: {
      ru: ["Однообразный труд", "Прилежание", "Скука"],
      en: ["Mechanical work", "Diligence", "Tedium"],
    },
  },
  {
    imageFile: "Bull.jpg",
    title: { ru: "Бык", en: "Bull" },
    meanings: {
      ru: ["Земля", "Мощь", "Честность"],
      en: ["Earth", "Power", "Honesty"],
    },
  },
  {
    imageFile: "Candle.jpg",
    title: { ru: "Свеча", en: "Candle" },
    meanings: {
      ru: ["Огонь", "Вера", "Обучение"],
      en: ["Fire", "Faith", "Learning"],
    },
  },
  {
    imageFile: "Cornucopia.jpg",
    title: { ru: "Рог изобилия", en: "Cornucopia" },
    meanings: {
      ru: ["Богатство", "Осень", "Радушие"],
      en: ["Wealth", "Autumn", "Hospitality"],
    },
  },
  {
    imageFile: "Chameleon.jpg",
    title: { ru: "Хамелеон", en: "Chameleon" },
    meanings: {
      ru: ["Воздух", "Жадность", "Терпение"],
      en: ["Air", "Greed", "Patience"],
    },
  },
  {
    imageFile: "Thunderbolt.jpg",
    title: { ru: "Молния", en: "Thunderbolt" },
    meanings: {
      ru: ["Вдохновение", "Судьба", "Шанс"],
      en: ["Inspiration", "Fate", "Chance"],
    },
  },
  {
    imageFile: "Dolphin.jpg",
    title: { ru: "Дельфин", en: "Dolphin" },
    meanings: {
      ru: ["Вода", "Возрождение", "Поддержка"],
      en: ["Water", "Resurrection", "Succour"],
    },
  },
  {
    imageFile: "Walled_Garden.jpg",
    title: { ru: "Сад за стеной", en: "Walled Garden" },
    meanings: {
      ru: ["Природа", "Невинность", "Порядок"],
      en: ["Nature", "Innocence", "Order"],
    },
  },
  {
    imageFile: "Globe.jpg",
    title: { ru: "Глобус", en: "Globe" },
    meanings: {
      ru: ["Политика", "Независимость", "Слава"],
      en: ["Politics", "Sovereignty", "Fame"],
    },
  },
  {
    imageFile: "Sword.jpg",
    title: { ru: "Меч", en: "Sword" },
    meanings: {
      ru: ["Правосудие", "Сила духа", "Церковь"],
      en: ["Justice", "Fortitude", "The Church"],
    },
  },
  {
    imageFile: "Griffin.jpg",
    title: { ru: "Грифон", en: "Griffin" },
    meanings: {
      ru: ["Сокровище", "Бдительность", "Храбрость"],
      en: ["Treasure", "Watchfulness", "Courage"],
    },
  },
  {
    imageFile: "Horse.jpg",
    title: { ru: "Лошадь", en: "Horse" },
    meanings: {
      ru: ["Европа", "Путешествия", "Верность"],
      en: ["Europe", "Journeys", "Fidelity"],
    },
  },
  {
    imageFile: "Camel.jpg",
    title: { ru: "Верблюд", en: "Camel" },
    meanings: {
      ru: ["Азия", "Лето", "Упорство"],
      en: ["Asia", "Summer", "Perseverance"],
    },
  },
  {
    imageFile: "Elephant.jpg",
    title: { ru: "Слон", en: "Elephant" },
    meanings: {
      ru: ["Африка", "Милосердие", "Сдержанность"],
      en: ["Africa", "Charity", "Continence"],
    },
  },
  {
    imageFile: "Crocodile_caiman.jpg",
    title: { ru: "Крокодил", en: "Crocodile" },
    meanings: {
      ru: ["Америка", "Ненасытность", "Предприимчивость"],
      en: ["America", "Rapacity", "Enterprise"],
    },
  },
  {
    imageFile: "Baby.jpg",
    title: { ru: "Ребёнок", en: "Baby" },
    meanings: {
      ru: ["Будущее", "Податливость", "Беспомощность"],
      en: ["The future", "Malleability", "Helplessness"],
    },
  },
  {
    imageFile: "Compass.jpg",
    title: { ru: "Циркуль", en: "Compass" },
    meanings: {
      ru: ["Измерение", "Математика", "Наука"],
      en: ["Measurement", "Mathematics", "Science"],
    },
  },
  {
    imageFile: "Lute.jpg",
    title: { ru: "Лютня", en: "Lute" },
    meanings: {
      ru: ["Поэзия", "Ораторство", "Философия"],
      en: ["Poetry", "Rhetoric", "Philosophy"],
    },
  },
  {
    imageFile: "Tree.jpg",
    title: { ru: "Дерево", en: "Tree" },
    meanings: {
      ru: ["Стойкость", "Укрытие", "Плодородие"],
      en: ["Firmness", "Shelter", "Fertility"],
    },
  },
  {
    imageFile: "Wild_man.jpg",
    title: { ru: "Дикарь", en: "Wild man" },
    meanings: {
      ru: ["Варвар", "Мужское начало", "Похоть"],
      en: ["Wild man", "The masculine", "Lust"],
    },
  },
  {
    imageFile: "Owl.jpg",
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
