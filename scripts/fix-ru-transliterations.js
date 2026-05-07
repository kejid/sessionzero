// Phase 1: surgical fixes to Russian transliterations and naming inconsistencies
// flagged by the editorial critic agent.

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'systems');

// id -> [[old, new], ...] — string-level replacements within that file only
const FIXES = {
  'mutant-year-zero': [
    // "грубы" reads as a non-word in RU; replace with "паёк" everywhere except where it's a culture-specific brand term
    ['Грубы кончаются', 'Паёк кончается'],
    ['даёт грубы (универсальную еду)', 'даёт паёк (универсальную еду)'],
    ['+1 Грубы', '+1 Паёк'],
    ['поиск груб', 'поиск пайка'],
    // "Зачистщик" → "Сталкер" (the canonical RU MYZ term)
    ['«Зачистщик Ковчега', '«Сталкер Ковчега'],
    // "Гексплорейшн" → "Гексокроул" (matches Land of Eem house style)
    ['Гексплорейшн Зоны', 'Гексокроул Зоны'],
  ],
  'traveller': [
    // "Hard-ish" → "Hard" (drop the hedge in tagShort)
    ['Хард-сай-фай про вольных торговцев', 'Хардовая сай-фай про вольных торговцев'],
    ['"Hard-ish sci-fi about freelance traders"', '"Hard sci-fi about freelance traders"'],
    // tagShort English variant
    ['Hard-ish sci-fi about freelance traders', 'Hard sci-fi about freelance traders'],
    // "сроками" → "контрактами" (less prison-coded)
    ['седой ветеран с тремя сроками', 'седой ветеран с тремя контрактами'],
    // d20 vocab fix
    ['Кубики двадцатиугольникам не нужны', 'Двадцатигранник не нужен'],
  ],
  'runequest': [
    // "Бродсворд" → "Меч (Broadsword)"
    ['Бросок d100 на Бродсворд: 23, успех', 'Бросок d100 на Меч (Broadsword): 23, успех'],
    // "медленная" → "вдумчивая" in the closer
    ['Жёсткая, медленная, мифологическая', 'Жёсткая, вдумчивая, мифологическая'],
    // "флаф" calque → native phrase
    ['Это не флаф', 'Это не просто декорация'],
  ],
  'starfinder-2e': [
    // kasatha → касатха
    ['наследия (ancestries) от андроидов до кашрит', 'наследия (ancestries) от андроидов до касатхи'],
    // Triune → Триуна (nominative form, not dative)
    ['придуманное богиней Триуне', 'придуманное богиней Триуной'],
    // "зеро-g" → "невесомость"
    ['Соларианец в зеро-g переключает', 'Соларианец в невесомости переключает'],
    // strip stray English action sequences mid-RU vignette
    ['Maneuver, Fire, Reload', 'Манёвр, Огонь, Перезарядка'],
  ],
  'fabula-ultima': [
    // Publisher: remove the bogus "Rooster Games" credit
    ['"publisher": "Need Games / Rooster Games"', '"publisher": "Need Games"'],
    // Drop the unverified "Gold" medal claim — keep "ENnie winner"
    ['Лауреат Gold ENnie 2023 за Best Game', 'Лауреат ENnie 2023 за Best Game и Product of the Year'],
    ['Winner of Gold ENnie 2023 for Best Game', 'Winner of 2023 ENnies for Best Game and Product of the Year'],
    // "Турновый бой" → "Пошаговый бой"
    ['Турновый бой, как в классических JRPG', 'Пошаговый бой, как в классических JRPG'],
    // also referenced in description? no, just vignette
    // "Чистый Final Fantasy" → broaden to match description's promise
    ['Чистый Final Fantasy', 'Чистый JRPG: Final Fantasy, Suikoden, Chrono Trigger'],
    ['Pure Final Fantasy', 'Pure JRPG: Final Fantasy, Suikoden, Chrono Trigger'],
  ],
  'daggerheart': [
    // tagShort: keep "Critical Role" hook for SEO but precise the publisher
    ['"tagShort": "Narrative fantasy from Critical Role"', '"tagShort": "Narrative fantasy by Darrington Press (Critical Role)"'],
    ['"tagShort": "Фэнтези от создателей Critical Role"', '"tagShort": "Фэнтези от Darrington Press (Critical Role)"'],
    // "Кампания-фреймы" → "Сюжетные рамки"
    ['Кампания-фреймы (Age of Umbra, Sablewood и др.)', 'Сюжетные рамки (Age of Umbra, Sablewood и др.)'],
    // "Stress и урон" — Latin "Stress" mid-Cyrillic
    ['"title": "Stress и урон"', '"title": "Стресс и урон"'],
    // Vignette: explicit DC for newcomers
    ['9 и 11 — успех с перевесом Страха.', '9 и 11 = 20, выше DC 12 — успех с перевесом Страха.'],
    ['9 and 11 — success with Fear.', '9 and 11 = 20, beats DC 12 — success with Fear.'],
  ],
  'land-of-eem': [
    // "Игривая" (can imply flirtatious in RU) → "Уютная"
    ['Игривая фэнтези-RPG Land of Eem', 'Уютная фэнтези-RPG Land of Eem'],
  ],
};

let totalChanges = 0;
let filesChanged = 0;
for (const [id, replacements] of Object.entries(FIXES)) {
  const fp = path.join(dir, id + '.js');
  let src = fs.readFileSync(fp, 'utf8');
  let count = 0;
  const failed = [];
  for (const [oldStr, newStr] of replacements) {
    if (src.includes(oldStr)) {
      src = src.split(oldStr).join(newStr);
      count++;
    } else {
      failed.push(oldStr.slice(0, 60));
    }
  }
  fs.writeFileSync(fp, src);
  if (count) filesChanged++;
  totalChanges += count;
  console.log(`${id}: ${count}/${replacements.length} replacements applied`);
  if (failed.length) failed.forEach(f => console.log(`  MISS: "${f}..."`));
}
console.log(`\nTotal: ${totalChanges} replacements across ${filesChanged} files.`);
