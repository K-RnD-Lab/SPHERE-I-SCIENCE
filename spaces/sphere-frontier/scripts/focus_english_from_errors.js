const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");

function findQuizBanks(root) {
  const out = [path.join(root, "spaces/sphere-frontier/app_data/quiz_bank_v1.json")];
  function walk(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (
        entry.name === "quiz_bank_v1.json" &&
        p.includes("Master Prep Analytics") &&
        p.includes(`${path.sep}trainer${path.sep}app_data${path.sep}`)
      ) {
        out.push(p);
      }
    }
  }
  walk(root);
  return [...new Set(out)];
}

const choicesABCD = (arr) => ({ A: arr[0], B: arr[1], C: arr[2], D: arr[3] });
const choicesABCDEFGH = (arr) => ({
  A: arr[0],
  B: arr[1],
  C: arr[2],
  D: arr[3],
  E: arr[4],
  F: arr[5],
  G: arr[6],
  H: arr[7],
});

function topicNotes(topic) {
  const notes = {
    matching:
      "Шукай не загальну тему, а доказ: одне слово в тексті часто перефразоване в опції. Якщо опція красива, але не має прямого доказу, це пастка.",
    reading_detail:
      "Питання на деталь карає за домисли. Повернись у конкретний абзац і перевір: чи сказано це прямо, чи ти додала висновок від себе.",
    reading_inference:
      "Inference означає обережний висновок із тексту, а не фантазію. Правильна відповідь зазвичай слабша й точніша, ніж яскравий варіант.",
    collocation:
      "Collocation - це пара слів, яка в англійській живе разом: get the chance, make progress, pay attention. Тут граматика може виглядати нормально, але слово не дружить із сусідом.",
    phrasal:
      "Phrasal verb змінює значення через частку: catch on = стати популярним, give up = здатися, turn into = перетворитися.",
    grammar:
      "У grammar cloze дивись на сигнал: since, by the time, if, so, article before noun, relative word before clause.",
    modal_perfect:
      "Modal perfect = modal + have + V3. must have - сильний висновок про минуле; should have - жаль або докір; could have - можливість, яка не обов'язково сталася.",
    conditional:
      "Conditionals ловлять часом і формою. Had I known = If I had known; це інверсія третього conditional.",
    articles:
      "A/an - один новий предмет; the - уже відомий або унікальний; zero article - загальне/незлічуване. Не став the лише тому, що слово звучить знайомо.",
    quantifier:
      "Quantifiers залежать від countable/uncountable і числа: a few students, little information, thousands of, each of those.",
    relative:
      "Relative words: who для людей, which для речей, whose для належності, where для місця, when для часу.",
  };
  return notes[topic] || notes.grammar;
}

function makeQuestion(id, variant, section, topic, prompt, choices, correct, explanation, trap) {
  const choice_explanations = {};
  for (const [key, value] of Object.entries(choices)) {
    choice_explanations[key] =
      key === correct
        ? `✅ Так. ${explanation}`
        : `❌ Ні. "${value}" виглядає можливо, але тут пастка: ${trap}`;
  }
  return {
    id: `english-focus-v${variant}-${String(id).padStart(2, "0")}`,
    subject: "english",
    block: section,
    topic,
    prompt,
    choices,
    correct_answer: correct,
    explanation,
    variant,
    choice_explanations,
    scientific_explanation: `🔬 ${topicNotes(topic)}`,
    real_life_example:
      "🏠 Побутова перевірка: не обирай слово, яке просто звучить знайомо. Постав його назад у речення і перевір, чи воно природно працює з сусідами.",
  };
}

function buildVariant(variant, config) {
  let n = 1;
  const q = [];

  const matchingChoices = choicesABCDEFGH(config.matching.choices);
  for (const item of config.matching.items) {
    q.push(
      makeQuestion(
        n++,
        variant,
        "reading_matching",
        "matching",
        `${config.matching.title}\n\n${item.text}\n\nWhich option best matches this text?`,
        matchingChoices,
        item.correct,
        item.expl,
        "опція може збігатися за темою, але не за доказом у тексті"
      )
    );
  }

  for (const item of config.reading) {
    q.push(
      makeQuestion(
        n++,
        variant,
        "reading_comprehension",
        item.topic,
        `${config.readingTitle}\n\n${config.readingText}\n\n${item.question}`,
        choicesABCD(item.choices),
        item.correct,
        item.expl,
        "у неправильних відповідях часто є слова з тексту, але змінена причина, час або наслідок"
      )
    );
  }

  for (const item of config.lexical) {
    q.push(
      makeQuestion(
        n++,
        variant,
        "use_of_english",
        item.topic,
        `${config.lexicalTitle}\n\n${item.text.replace("__", `(${n - 1}) ___`)}\n\nChoose the best option for gap ${n - 1}.`,
        choicesABCD(item.choices),
        item.correct,
        item.expl,
        "потрібна стала пара слів або phrasal verb, а не буквальний переклад"
      )
    );
  }

  for (const item of config.grammar) {
    q.push(
      makeQuestion(
        n++,
        variant,
        "use_of_english",
        item.topic,
        `${config.grammarTitle}\n\n${item.text.replace("__", `(${n - 1}) ___`)}\n\nChoose the best option for gap ${n - 1}.`,
        choicesABCD(item.choices),
        item.correct,
        item.expl,
        "сигнал у реченні диктує форму: час, артикль, relative word або modal perfect"
      )
    );
  }

  if (q.length !== 30) throw new Error(`Variant ${variant} has ${q.length} questions`);
  return q;
}

const variants = [
  buildVariant(1, {
    matching: {
      title: "Task 1. Matching: unusual study spaces",
      choices: [
        "is designed for silent work with stable internet",
        "turns an old vehicle into a study room",
        "supports a local environmental project",
        "lets visitors practise foreign languages with native speakers",
        "is rebuilt from temporary material every year",
        "combines books with a pay-by-weight system",
        "teaches practical cooking before the meal",
        "uses darkness to sharpen other senses",
      ],
      items: [
        {
          text: "1. The Quiet Desk keeps conversations to a whisper. Every seat has a socket, a lamp and a fast connection, and group calls are not allowed.",
          correct: "A",
          expl: "silent work + internet = designed for quiet study.",
        },
        {
          text: "2. At Page Kilo, visitors choose second-hand books from wooden shelves and pay for them by kilogram before sitting down with coffee.",
          correct: "F",
          expl: "books bought by kilogram = pay-by-weight system.",
        },
        {
          text: "3. The Conversation Table hosts Spanish, German and Polish evenings. Native speakers receive free drinks for chatting with learners.",
          correct: "D",
          expl: "foreign-language practice with native speakers is stated directly.",
        },
        {
          text: "4. The Forest Cabin donates part of every booking to a river-cleaning team and asks guests to join a short clean-up walk.",
          correct: "C",
          expl: "donates and clean-up project = environmental support.",
        },
        {
          text: "5. The Bus Library is built inside a retired city bus. The seats were replaced with desks, but the driver's cabin is still there.",
          correct: "B",
          expl: "retired bus transformed into a room = old vehicle.",
        },
        {
          text: "6. Black Plate seats guests in a completely dark room, so taste, smell and sound become more noticeable during dinner.",
          correct: "H",
          expl: "complete darkness and senses = option H.",
        },
      ],
    },
    readingTitle: "Task 2. Reading: The engineer who listened",
    readingText:
      "A young engineer joined a city transport team and noticed that complaints were not mainly about delays. Passengers were angry because screens showed no updates when buses were late. She tested a small notification system on three routes. It did not make buses faster, but it reduced complaints because people could plan. The city later expanded the system, though the engineer warned that clear information should not replace investment in better roads and vehicles.",
    reading: [
      { topic: "reading_detail", question: "7. What was the main problem passengers reported?", choices: ["The buses were too expensive.", "They had no information during delays.", "Drivers refused to stop.", "The routes were closed."], correct: "B", expl: "The text says complaints were about missing updates." },
      { topic: "reading_detail", question: "8. What did the pilot system actually improve?", choices: ["Bus speed", "Passenger planning", "Road quality", "Driver salaries"], correct: "B", expl: "It helped people plan, not travel faster." },
      { topic: "reading_inference", question: "9. Why did complaints fall?", choices: ["Passengers received useful information.", "All delays disappeared.", "Tickets became free.", "The city bought new buses immediately."], correct: "A", expl: "The system reduced uncertainty." },
      { topic: "reading_detail", question: "10. What warning did the engineer give?", choices: ["Apps are always harmful.", "Information is not a substitute for infrastructure.", "Notifications should be removed.", "Passengers should stop complaining."], correct: "B", expl: "She said clear information should not replace better roads and vehicles." },
      { topic: "reading_inference", question: "11. The best title for the text is:", choices: ["When Information Solves Part of a Problem", "Why All Buses Are Fast", "The End of Public Transport", "A City Without Passengers"], correct: "A", expl: "The system helped with communication but did not solve everything." },
    ],
    lexicalTitle: "Task 3. Lexical cloze: The idea that caught on",
    lexical: [
      { topic: "collocation", text: "A small library wanted to __ local teenagers the chance to organise evening events.", choices: ["make", "do", "take", "give"], correct: "D", expl: "give someone the chance." },
      { topic: "phrasal", text: "At first, only a few people came, but the idea soon __ on.", choices: ["carried", "caught", "moved", "brought"], correct: "B", expl: "catch on = become popular." },
      { topic: "phrasal", text: "Within a year, the quiet building __ into a meeting place for the whole district.", choices: ["turned", "changed", "shifted", "moved"], correct: "A", expl: "turn into = become something different." },
      { topic: "collocation", text: "After the new rules, accidents with damaged books __ by half.", choices: ["dropped", "lowered", "reduced", "cut"], correct: "A", expl: "accidents dropped by half; reduce/lower usually need an object." },
      { topic: "collocation", text: "The project __ attention from other towns.", choices: ["paid", "gave", "attracted", "made"], correct: "C", expl: "attract attention." },
      { topic: "collocation", text: "In cloze tasks, candidates must __ attention to the word before and after the gap.", choices: ["pay", "make", "set", "hold"], correct: "A", expl: "pay attention." },
      { topic: "phrasal", text: "The organiser was tired, but she refused to __.", choices: ["gave up", "gave in", "gave out", "gave away"], correct: "A", expl: "give up = stop trying." },
      { topic: "collocation", text: "The first posters were drawn entirely __.", choices: ["by hand", "on hand", "in hand", "with hand"], correct: "A", expl: "made by hand." },
      { topic: "collocation", text: "The city later __ the project a success.", choices: ["declared", "called", "said", "named"], correct: "A", expl: "declare something a success." },
      { topic: "collocation", text: "A good difficult question __ candidates to think, not just translate.", choices: ["forces", "orders", "allows", "makes"], correct: "A", expl: "force someone to think = strongly push them to think." },
    ],
    grammarTitle: "Task 4. Grammar cloze",
    grammar: [
      { topic: "articles", text: "A student sat on __ bench near the exam centre.", choices: ["a", "an", "the", "-"], correct: "A", expl: "A new singular countable noun: a bench." },
      { topic: "quantifier", text: "The course contains __ useful information, but not enough practice.", choices: ["many", "few", "much", "several"], correct: "C", expl: "Information is uncountable: much information." },
      { topic: "modal_perfect", text: "She looks upset; she __ have received bad news.", choices: ["must", "should", "can", "would"], correct: "A", expl: "must have + V3 = strong deduction about the past." },
      { topic: "modal_perfect", text: "I failed the task; I __ have read the instruction more carefully.", choices: ["must", "should", "may", "need"], correct: "B", expl: "should have + V3 = regret/criticism." },
      { topic: "relative", text: "The day __ I took my first mock exam was stressful.", choices: ["what", "when", "which", "whose"], correct: "B", expl: "When refers to time." },
      { topic: "conditional", text: "__ I known the rule, I would have chosen faster.", choices: ["If", "Unless", "Had", "Should"], correct: "C", expl: "Had I known = If I had known." },
      { topic: "grammar", text: "The explanation was so clear __ I remembered it later.", choices: ["as", "so", "that", "than"], correct: "C", expl: "so + adjective + that." },
      { topic: "quantifier", text: "The article was read by __ of students.", choices: ["thousand", "thousands", "thousands of", "thousand of"], correct: "C", expl: "thousands of + plural noun." },
      { topic: "relative", text: "The teacher, __ advice helped me, explained the pattern again.", choices: ["who", "whose", "which", "where"], correct: "B", expl: "Whose shows possession: teacher's advice." },
    ],
  }),
  buildVariant(2, {
    matching: {
      title: "Task 1. Matching: short course descriptions",
      choices: [
        "focuses on speaking practice",
        "requires learners to build a physical object",
        "is mainly for exam reading strategies",
        "offers feedback from former test-takers",
        "teaches grammar through stories",
        "is intended for complete beginners",
        "uses timed practice under pressure",
        "connects study with volunteering",
      ],
      items: [
        { text: "1. Speed Reading Lab gives students six short texts and strict timers. After each round, they mark evidence lines and compare traps.", correct: "C", expl: "reading strategies and evidence lines." },
        { text: "2. The Speaking Kitchen pairs learners at small tables. Every lesson ends with a five-minute conversation recorded for pronunciation feedback.", correct: "A", expl: "conversation and pronunciation = speaking." },
        { text: "3. Grammar Stories explains tenses through short narratives, so learners see why the time form changes.", correct: "E", expl: "grammar through stories is direct." },
        { text: "4. Mock Day repeats the pressure of the real exam: no pauses, strict time, and instant score report.", correct: "G", expl: "timed practice under pressure." },
        { text: "5. Mentor Notes invites students who passed last year to comment on common mistakes in new answers.", correct: "D", expl: "feedback from former test-takers." },
        { text: "6. Community English asks learners to help visitors at local events while using prepared phrases.", correct: "H", expl: "study plus volunteering." },
      ],
    },
    readingTitle: "Task 2. Reading: The school without bells",
    readingText:
      "A secondary school removed its loud lesson bells after teachers noticed that students rushed through corridors and arrived stressed. Instead, classroom clocks and short phone vibrations reminded teachers when to finish. At first, some parents worried that lessons would become chaotic. After one term, punctuality improved and noise levels fell. The head teacher said the change worked not because students became perfect, but because the environment stopped pushing them to hurry.",
    reading: [
      { topic: "reading_detail", question: "7. Why were the bells removed?", choices: ["They were too expensive.", "They made students rush and feel stressed.", "Teachers wanted longer holidays.", "Parents demanded silence."], correct: "B", expl: "The bells caused rushing and stress." },
      { topic: "reading_detail", question: "8. What replaced the bells?", choices: ["Classroom clocks and phone vibrations", "Radio announcements", "Student whistles", "Longer breaks"], correct: "A", expl: "The text names clocks and vibrations." },
      { topic: "reading_inference", question: "9. What did some parents fear?", choices: ["The school would become less organised.", "All lessons would be cancelled.", "Students would sleep at school.", "Teachers would leave."], correct: "A", expl: "Chaotic means less organised." },
      { topic: "reading_detail", question: "10. What improved after one term?", choices: ["Exam scores only", "Punctuality and noise levels", "School meals", "Sports results"], correct: "B", expl: "Both punctuality and noise levels are mentioned." },
      { topic: "reading_inference", question: "11. The head teacher suggests that behaviour depends partly on:", choices: ["building design and routines", "luck only", "parents' jobs", "weather"], correct: "A", expl: "The environment stopped pushing students to hurry." },
    ],
    lexicalTitle: "Task 3. Lexical cloze: A rule that changed the square",
    lexical: [
      { topic: "collocation", text: "The council decided to __ several signs from the main square.", choices: ["remove", "move", "delete", "cancel"], correct: "A", expl: "remove signs is natural." },
      { topic: "collocation", text: "Without signs, drivers had to __ attention to each other.", choices: ["pay", "make", "give", "take"], correct: "A", expl: "pay attention." },
      { topic: "phrasal", text: "The idea soon __ on in nearby towns.", choices: ["carried", "caught", "brought", "moved"], correct: "B", expl: "catch on = become popular." },
      { topic: "collocation", text: "Accidents at the redesigned intersection __ by nearly half.", choices: ["dropped", "decreased", "lowered", "reduced"], correct: "A", expl: "Accidents dropped by half is the natural intransitive pattern." },
      { topic: "collocation", text: "The plan also __ criticism from people who preferred strict rules.", choices: ["received", "took", "made", "did"], correct: "A", expl: "receive criticism." },
      { topic: "collocation", text: "Drivers often argued about who had the __ of way.", choices: ["right", "correct", "true", "proper"], correct: "A", expl: "the right of way." },
      { topic: "phrasal", text: "At crossings, people quietly __ how to share the space.", choices: ["worked out", "worked on", "worked in", "worked by"], correct: "A", expl: "work out how to do something." },
      { topic: "collocation", text: "Many candidates choose a familiar word and __ the point of the sentence.", choices: ["lost", "missed", "failed", "dropped"], correct: "B", expl: "miss the point." },
      { topic: "collocation", text: "The teacher gave a __ explanation of the difference.", choices: ["simple", "plain", "clear", "straight"], correct: "C", expl: "clear explanation is the safest collocation here." },
      { topic: "collocation", text: "A road without signs can __ drivers to think for themselves.", choices: ["make", "let", "force", "allow"], correct: "C", expl: "force someone to think = push them to think." },
    ],
    grammarTitle: "Task 4. Grammar cloze",
    grammar: [
      { topic: "articles", text: "She waited for __ hour before the interview.", choices: ["a", "an", "the", "-"], correct: "B", expl: "hour starts with a vowel sound: an hour." },
      { topic: "quantifier", text: "Only __ people understood the final paragraph.", choices: ["a few", "much", "little", "any"], correct: "A", expl: "People are countable plural." },
      { topic: "modal_perfect", text: "He __ have forgotten the deadline; his file is missing.", choices: ["must", "should", "would", "need"], correct: "A", expl: "must have = strong past deduction." },
      { topic: "modal_perfect", text: "They __ have checked the spelling before sending it.", choices: ["must", "should", "may", "can"], correct: "B", expl: "should have = criticism/regret." },
      { topic: "relative", text: "The platform __ we used saved our results.", choices: ["where", "which", "whose", "what"], correct: "B", expl: "Which refers to a thing." },
      { topic: "conditional", text: "If she __ more practice, she would feel calmer.", choices: ["has", "had", "will have", "had had"], correct: "B", expl: "Second conditional: if + Past Simple." },
      { topic: "grammar", text: "The passage was too long __ finish in ten minutes.", choices: ["to", "that", "than", "so"], correct: "A", expl: "too + adjective + to." },
      { topic: "quantifier", text: "__ of those options changes the meaning slightly.", choices: ["Each", "Every", "All", "Much"], correct: "A", expl: "Each of those + plural noun." },
      { topic: "conditional", text: "__ I had revised modals, I would have answered faster.", choices: ["If", "Had", "Unless", "Should"], correct: "B", expl: "Had I revised = If I had revised." },
    ],
  }),
  buildVariant(3, {
    matching: {
      title: "Task 1. Matching: project notices",
      choices: [
        "invites people to repair broken items",
        "asks for short personal stories",
        "offers help with formal writing",
        "collects data for a local map",
        "teaches people to avoid online scams",
        "is for people who want quiet reading",
        "uses art to explain science",
        "lets visitors compare old and new technology",
      ],
      items: [
        { text: "1. Repair Friday provides tools and volunteers. Visitors bring lamps, jackets or small devices and learn how to fix them.", correct: "A", expl: "repair broken items is direct." },
        { text: "2. Scam Shield explains fake links, urgent messages and password theft using examples from real inboxes.", correct: "E", expl: "online scam prevention." },
        { text: "3. City Sounds asks residents to record noise levels near busy roads, then adds the results to an interactive map.", correct: "D", expl: "collects data for a map." },
        { text: "4. Cover Letter Clinic helps applicants rewrite motivation letters and formal emails before submission.", correct: "C", expl: "formal writing help." },
        { text: "5. The Memory Wall accepts 100-word texts about objects that changed someone's life.", correct: "B", expl: "short personal stories." },
        { text: "6. Old Tech Table displays typewriters, early mobile phones and modern tablets side by side.", correct: "H", expl: "old and new technology comparison." },
      ],
    },
    readingTitle: "Task 2. Reading: The map made by neighbours",
    readingText:
      "A group of residents in a coastal town created a flood-risk map after heavy rain repeatedly blocked two streets. They did not have professional equipment, so they used notebooks, phone photos and simple measuring sticks. At first the council doubted the project, but the residents collected observations for six months and showed exactly where water gathered. The map did not solve the flooding, yet it helped the town win funding for better drains.",
    reading: [
      { topic: "reading_detail", question: "7. What problem started the project?", choices: ["Repeated flooding after heavy rain", "A lack of tourist maps", "A broken phone network", "Noise from traffic"], correct: "A", expl: "Heavy rain blocked streets." },
      { topic: "reading_detail", question: "8. What tools did residents use?", choices: ["Professional sensors only", "Notebooks, photos and simple measuring sticks", "Drones and satellites", "Laboratory machines"], correct: "B", expl: "The text lists simple tools." },
      { topic: "reading_inference", question: "9. Why did the council change its attitude?", choices: ["The residents gathered evidence over time.", "The residents stopped measuring.", "The streets became dry forever.", "The map looked expensive."], correct: "A", expl: "Six months of observations made the case stronger." },
      { topic: "reading_detail", question: "10. What did the map help the town obtain?", choices: ["Funding for better drains", "Free notebooks", "A new beach", "A weather station"], correct: "A", expl: "The final sentence states this." },
      { topic: "reading_inference", question: "11. The passage suggests that citizen data can be:", choices: ["useful when collected carefully", "always useless", "better than all science", "illegal in towns"], correct: "A", expl: "Careful observations helped win funding." },
    ],
    lexicalTitle: "Task 3. Lexical cloze: The workshop that grew",
    lexical: [
      { topic: "phrasal", text: "The first workshop was small, but it __ into a monthly event.", choices: ["turned", "changed", "moved", "shifted"], correct: "A", expl: "turn into = become." },
      { topic: "collocation", text: "Participants __ the chance to test ideas in a safe setting.", choices: ["made", "did", "got", "took"], correct: "C", expl: "get the chance." },
      { topic: "collocation", text: "After three meetings, several beginners had already __ progress.", choices: ["made", "did", "took", "built"], correct: "A", expl: "make progress." },
      { topic: "collocation", text: "Everyone __ advice from mentors before presenting.", choices: ["received", "made", "did", "caused"], correct: "A", expl: "receive advice." },
      { topic: "phrasal", text: "The format __ on because it was practical.", choices: ["caught", "carried", "moved", "brought"], correct: "A", expl: "catch on = become popular." },
      { topic: "collocation", text: "Before applying, each student had to __ a decision.", choices: ["take", "make", "do", "give"], correct: "B", expl: "make a decision." },
      { topic: "collocation", text: "The campaign helped __ awareness of online safety.", choices: ["raise", "rise", "grow", "lift"], correct: "A", expl: "raise awareness." },
      { topic: "phrasal", text: "The team wanted to __ why users abandoned the form.", choices: ["find out", "find in", "find up", "find by"], correct: "A", expl: "find out = discover." },
      { topic: "collocation", text: "The report gave a __ argument for changing the policy.", choices: ["strong", "heavy", "hard", "high"], correct: "A", expl: "strong argument/evidence." },
      { topic: "collocation", text: "During the study, volunteers had to __ records of every observation.", choices: ["keep", "hold", "save", "store"], correct: "A", expl: "keep records." },
    ],
    grammarTitle: "Task 4. Grammar cloze",
    grammar: [
      { topic: "articles", text: "The group created __ useful map.", choices: ["a", "an", "the an", "-"], correct: "A", expl: "Useful begins with /ju:/, a consonant sound: a useful map." },
      { topic: "quantifier", text: "There was very __ evidence at the beginning.", choices: ["few", "little", "many", "several"], correct: "B", expl: "Evidence is uncountable: little evidence." },
      { topic: "modal_perfect", text: "The road is wet; it __ have rained at night.", choices: ["must", "should", "would", "can"], correct: "A", expl: "must have + V3 = strong conclusion." },
      { topic: "modal_perfect", text: "I missed the key word; I __ have slowed down.", choices: ["must", "should", "may", "need"], correct: "B", expl: "should have = regret." },
      { topic: "relative", text: "The month __ the project began was unusually rainy.", choices: ["what", "when", "which", "whose"], correct: "B", expl: "When refers to time." },
      { topic: "conditional", text: "If the residents had stopped early, they __ the funding.", choices: ["would not win", "will not win", "would not have won", "do not win"], correct: "C", expl: "Third conditional: would have + V3." },
      { topic: "grammar", text: "The data was clear enough __ persuade the council.", choices: ["to", "that", "than", "so"], correct: "A", expl: "enough + to." },
      { topic: "quantifier", text: "The volunteers visited __ street twice.", choices: ["each", "every of", "all of", "much"], correct: "A", expl: "Each + singular noun." },
      { topic: "conditional", text: "__ the council ignored the map, the drains would not have been repaired.", choices: ["Had", "If", "Unless", "Should"], correct: "A", expl: "Had the council ignored = If the council had ignored." },
    ],
  }),
];

function replaceEnglish(data, variant, questions) {
  const set = data.quiz_sets.find((item) => item.id === `exam-english-30-v${variant}`);
  if (!set) throw new Error(`Missing exam-english-30-v${variant}`);
  set.title = `English Real Exam Pattern Drill - Variant ${variant}`;
  set.description =
    "Targeted after real attempt errors: matching evidence, reading detail, lexical cloze, modals, articles, quantifiers, conditionals.";
  set.questions = questions;
  set.updated_at = new Date().toISOString();
}

for (const file of findQuizBanks(repoRoot)) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (let i = 1; i <= 3; i += 1) replaceEnglish(data, i, variants[i - 1]);
  data.updated_at = new Date().toISOString();
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`updated ${file}`);
}
