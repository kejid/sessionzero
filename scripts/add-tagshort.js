#!/usr/bin/env node
// One-off: add tagShort field to en/ru blocks of every system file.
const fs = require('fs');
const path = require('path');

const TAGS = {
  "alien":                     { en: "Year Zero sci-fi horror RPG",      ru: "Sci-fi хоррор по «Чужому»" },
  "blade-runner":              { en: "neo-noir detective RPG",            ru: "Нуар-детектив с репликантами" },
  "blades":                    { en: "FitD heist & crime RPG",            ru: "Криминальная FitD-RPG" },
  "cairn":                     { en: "ultralight folk-horror OSR",        ru: "Ультралёгкая фолк-хоррор OSR" },
  "call-of-cthulhu":           { en: "the classic 1920s horror RPG",      ru: "Классика хоррор-RPG, 1920-е" },
  "coriolis":                  { en: "Arabian-Persian space opera",       ru: "Арабо-персидская космоопера" },
  "cy-borg":                   { en: "neon doom-punk cyberpunk RPG",      ru: "Нео-панк киберпанк RPG" },
  "death-in-space":            { en: "grimy blue-collar sci-fi RPG",      ru: "Грязный sci-fi survival RPG" },
  "delta-green":               { en: "modern Lovecraftian agency RPG",    ru: "Современный Ктулху-хоррор RPG" },
  "dragonbane":                { en: "Swedish heroic fantasy RPG",        ru: "Шведское героическое фэнтези" },
  "draw-steel":                { en: "tactical heroic fantasy RPG",       ru: "Тактическое героическое фэнтези" },
  "electric-bastionland":      { en: "weird urban OSR",                   ru: "Странный городской OSR" },
  "fist":                      { en: "paranormal Cold War merc RPG",      ru: "Паранормальные наёмники Хол.войны" },
  "forbidden-lands":           { en: "dark-fantasy hexcrawl RPG",         ru: "Тёмное фэнтези гексплорейшн" },
  "heart":                     { en: "weird descent RPG",                 ru: "Нарративный спуск" },
  "into-the-odd":              { en: "minimalist industrial OSR",         ru: "Минималистичная OSR-классика" },
  "ironsworn":                 { en: "free solo PbtA dark fantasy",       ru: "Бесплатное соло-фэнтези PbtA" },
  "ker-nethalas":              { en: "solo necropolis crawler",           ru: "Соло-данжен в некрополе" },
  "koriko":                    { en: "solo witch RPG",                    ru: "Соло-журнал ведьмы" },
  "l5r":                       { en: "samurai RPG",                       ru: "Самурайская RPG" },
  "lancer":                    { en: "tactical sci-fi mech combat RPG",   ru: "Тактический sci-fi мех-RPG" },
  "last-tea-shop":             { en: "solo afterlife journal RPG",        ru: "Соло-журнал у границы миров" },
  "mausritter":                { en: "OSR mouse adventure RPG",           ru: "OSR-приключения мышат" },
  "microscope":                { en: "GMless history-building game",      ru: "GMless игра-история без кубиков" },
  "mork-borg":                 { en: "doom-metal art-punk fantasy RPG",   ru: "Doom-metal арт-панк фэнтези" },
  "mothership":                { en: "Alien-style sci-fi horror RPG",     ru: "Sci-fi хоррор на процентах" },
  "mythic-bastionland":        { en: "mythic Arthurian RPG",              ru: "Мифический рыцарский RPG" },
  "nimble":                    { en: "fast D&D 5e-compatible RPG",        ru: "Быстрая альтернатива D&D 5e" },
  "one-ring":                  { en: "Middle-earth Tolkien RPG",          ru: "RPG по Средиземью Толкина" },
  "ose":                       { en: "B/X D&D retroclone OSR",            ru: "Ретроклон B/X D&D 1981" },
  "outgunned":                 { en: "Die Hard cinematic action RPG",     ru: "Кинематографичная экшн-RPG" },
  "pirate-borg":               { en: "cursed pirate art-punk RPG",        ru: "Проклятые пираты арт-панк RPG" },
  "shadowdark":                { en: "modern OSR with real-time torches", ru: "Современный OSR с факелами" },
  "spire":                     { en: "drow rebellion RPG",                ru: "Восстание дроу RPG" },
  "star-wars-ffg":             { en: "narrative dice RPG",                ru: "Нарративные дайсы RPG" },
  "starforged":                { en: "solo sci-fi PbtA RPG",              ru: "Соло sci-fi PbtA RPG" },
  "tales-loop":                { en: "kids '80s mystery RPG",             ru: "Альт-80-е, мистика" },
  "the-wretched":              { en: "solo space-horror Jenga RPG",       ru: "Соло Дженга-хоррор в космосе" },
  "thousand-year-old-vampire": { en: "solo journaling RPG",               ru: "Соло-дневник вампира" },
  "triangle":                  { en: "SCP-meets-X-Files agent RPG",       ru: "RPG про агентов аномалий" },
  "twilight":                  { en: "post-WW3 survival sandbox RPG",     ru: "Пост-ядерный сэндбокс RPG" },
  "uvg":                       { en: "psychedelic OSR",                   ru: "Психоделический OSR" },
  "vaesen":                    { en: "Nordic gothic mystery RPG",         ru: "Скандинавская готика XIX века" },
  "wildsea":                   { en: "weird treetop sailing RPG",         ru: "Корабли по кронам RPG" },
};

const dir = path.join(__dirname, '..', 'data', 'systems');
let ok = 0, fail = 0;

for (const [id, { en, ru }] of Object.entries(TAGS)) {
  const file = path.join(dir, id + '.js');
  if (!fs.existsSync(file)) {
    console.log(`! ${id} — file not found`);
    fail++;
    continue;
  }
  let src = fs.readFileSync(file, 'utf8');

  if (src.includes('"tagShort"')) {
    console.log(`. ${id} — already has tagShort, skipping`);
    continue;
  }

  const enInsert = `\n    "tagShort": ${JSON.stringify(en)},`;
  const ruInsert = `\n    "tagShort": ${JSON.stringify(ru)},`;
  const newSrc = src
    .replace(/(\n  "ru":\s*\{)/, `$1${ruInsert}`)
    .replace(/(\n  "en":\s*\{)/, `$1${enInsert}`);

  const enHits = (newSrc.match(/"tagShort":/g) || []).length;
  if (enHits !== 2) {
    console.log(`! ${id} — expected 2 insertions, got ${enHits}`);
    fail++;
    continue;
  }
  fs.writeFileSync(file, newSrc);
  console.log(`+ ${id}`);
  ok++;
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
