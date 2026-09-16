const roiMajors = [
  { id:"computer-science", salary:85000, uk:"Комп’ютерні науки", ru:"Компьютерные науки", en:"Computer Science" },
  { id:"data-science", salary:82000, uk:"Наука про дані", ru:"Наука о данных", en:"Data Science" },
  { id:"electrical-engineering", salary:80000, uk:"Електротехніка", ru:"Электротехника", en:"Electrical Engineering" },
  { id:"chemical-engineering", salary:79000, uk:"Хімічна інженерія", ru:"Химическая инженерия", en:"Chemical Engineering" },
  { id:"mechanical-engineering", salary:75000, uk:"Механічна інженерія", ru:"Механическая инженерия", en:"Mechanical Engineering" },
  { id:"biomedical-engineering", salary:72000, uk:"Біомедична інженерія", ru:"Биомедицинская инженерия", en:"Biomedical Engineering" },
  { id:"finance", salary:72000, uk:"Фінанси", ru:"Финансы", en:"Finance" },
  { id:"civil-engineering", salary:68000, uk:"Цивільна інженерія", ru:"Гражданская инженерия", en:"Civil Engineering" },
  { id:"nursing", salary:68000, uk:"Сестринська справа", ru:"Сестринское дело", en:"Nursing" },
  { id:"business", salary:65000, uk:"Бізнес та менеджмент", ru:"Бизнес и менеджмент", en:"Business & Management" },
  { id:"mathematics", salary:65000, uk:"Математика", ru:"Математика", en:"Mathematics" },
  { id:"economics", salary:62000, uk:"Економіка", ru:"Экономика", en:"Economics" },
  { id:"physics", salary:62000, uk:"Фізика", ru:"Физика", en:"Physics" },
  { id:"architecture", salary:61000, uk:"Архітектура", ru:"Архитектура", en:"Architecture" },
  { id:"accounting", salary:60000, uk:"Бухгалтерський облік", ru:"Бухгалтерский учёт", en:"Accounting" },
  { id:"marketing", salary:58000, uk:"Маркетинг", ru:"Маркетинг", en:"Marketing" },
  { id:"chemistry", salary:55000, uk:"Хімія", ru:"Химия", en:"Chemistry" },
  { id:"public-health", salary:55000, uk:"Громадське здоров’я", ru:"Общественное здравоохранение", en:"Public Health" },
  { id:"biology", salary:52000, uk:"Біологія", ru:"Биология", en:"Biology" },
  { id:"environmental-science", salary:52000, uk:"Екологічні науки", ru:"Экологические науки", en:"Environmental Science" },
  { id:"international-relations", salary:52000, uk:"Міжнародні відносини", ru:"Международные отношения", en:"International Relations" },
  { id:"political-science", salary:50000, uk:"Політологія", ru:"Политология", en:"Political Science" },
  { id:"communications", salary:50000, uk:"Комунікації", ru:"Коммуникации", en:"Communications" },
  { id:"journalism", salary:48000, uk:"Журналістика", ru:"Журналистика", en:"Journalism" },
  { id:"graphic-design", salary:48000, uk:"Графічний дизайн", ru:"Графический дизайн", en:"Graphic Design" },
  { id:"film", salary:47000, uk:"Кіно та медіа", ru:"Кино и медиа", en:"Film & Media" },
  { id:"education", salary:47000, uk:"Освіта та педагогіка", ru:"Образование и педагогика", en:"Education" },
  { id:"sociology", salary:46000, uk:"Соціологія", ru:"Социология", en:"Sociology" },
  { id:"psychology", salary:45000, uk:"Психологія", ru:"Психология", en:"Psychology" },
  { id:"english", salary:44000, uk:"Англійська мова та література", ru:"Английский язык и литература", en:"English & Literature" }
];

const roiCountryCosts = [
  { id:"ukraine", documents:420, flight:850, uk:"Україна", ru:"Украина", en:"Ukraine" },
  { id:"poland", documents:340, flight:700, uk:"Польща", ru:"Польша", en:"Poland" },
  { id:"germany", documents:300, flight:650, uk:"Німеччина", ru:"Германия", en:"Germany" },
  { id:"uk", documents:260, flight:700, uk:"Велика Британія", ru:"Великобритания", en:"United Kingdom" },
  { id:"canada", documents:240, flight:350, uk:"Канада", ru:"Канада", en:"Canada" },
  { id:"india", documents:500, flight:1000, uk:"Індія", ru:"Индия", en:"India" },
  { id:"china", documents:600, flight:1100, uk:"Китай", ru:"Китай", en:"China" },
  { id:"brazil", documents:480, flight:900, uk:"Бразилія", ru:"Бразилия", en:"Brazil" },
  { id:"mexico", documents:350, flight:550, uk:"Мексика", ru:"Мексика", en:"Mexico" },
  { id:"other", documents:450, flight:900, uk:"Інша країна", ru:"Другая страна", en:"Other country" }
];

const roiVisaProfiles = [
  { id:"new-f1", visa:185, sevis:350, uk:"Нова студентська віза F-1", ru:"Новая студенческая виза F-1", en:"New F-1 student visa" },
  { id:"renew-f1", visa:185, sevis:0, uk:"Поновлення F-1 (без нового SEVIS)", ru:"Продление F-1 (без нового SEVIS)", en:"F-1 renewal (no new SEVIS fee)" },
  { id:"transfer-f1", visa:0, sevis:0, uk:"Активний F-1 / переведення SEVIS", ru:"Активный F-1 / перевод SEVIS", en:"Active F-1 / SEVIS transfer" },
  { id:"resident", visa:0, sevis:0, uk:"Громадянин США або постійний резидент", ru:"Гражданин США или постоянный резидент", en:"U.S. citizen or permanent resident" }
];
