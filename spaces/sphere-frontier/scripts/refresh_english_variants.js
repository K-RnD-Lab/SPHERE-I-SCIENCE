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

const topicNotes = {
  passive: {
    sci: "🔬 Passive voice переносить фокус з виконавця дії на об'єкт. Формула: be у потрібному часі + V3.",
    life: "🏠 Як у новині: важливо, що звіт перевірили або дані зберегли, а не хто саме це зробив.",
  },
  word_form: {
    sci: "🔬 Word formation перевіряє частину мови: noun, adjective, adverb або verb. Дивись на місце слова у реченні.",
    life: "🏠 Як деталь у конструкторі: слово має підійти за формою до сусідніх слів.",
  },
  conditionals: {
    sci: "🔬 Conditionals показують реальність умови: реальна, уявна або минула нереальна ситуація.",
    life: "🏠 Це як сценарій: якщо умова вже не справдилася в минулому, потрібен third conditional.",
  },
  collocation: {
    sci: "🔬 Collocation — це стала пара слів. Її не завжди можна перекласти дослівно.",
    life: "🏠 Англійська любить звичні пари: make a decision, do research, pay attention.",
  },
  inference: {
    sci: "🔬 Inference питає, що логічно випливає з тексту, але не додає нових припущень.",
    life: "🏠 Як детектив: висновок має спиратися на сліди в тексті, а не на здогад.",
  },
  relative: {
    sci: "🔬 Relative pronouns з'єднують частини речення. Whose показує належність, which — річ, where — місце.",
    life: "🏠 Якщо можна сказати 'чий/чия/чиє', майже завжди шукай whose.",
  },
  quantifier: {
    sci: "🔬 Quantifiers залежать від того, чи іменник злічуваний. Evidence, information, advice — uncountable.",
    life: "🏠 Information як вода: її може бути little/much, але не many/few.",
  },
  prep: {
    sci: "🔬 Prepositions часто є частиною керування слова: depend on, interested in, responsible for.",
    life: "🏠 Це як пароль до слова: неправильний прийменник ламає всю фразу.",
  },
  reference: {
    sci: "🔬 Reference questions питають, до чого в тексті повертається it/this/they. Дивись на найближчу логічну іменну групу.",
    life: "🏠 Як стрілочка в нотатках: this change має вказувати на конкретну зміну перед ним.",
  },
  tense: {
    sci: "🔬 Tense вибирається за часовою логікою і маркерами: since, already, by the time, yesterday.",
    life: "🏠 Спершу визнач, коли дія сталася і чи важливий її результат зараз.",
  },
  gerund: {
    sci: "🔬 Після деяких дієслів потрібен gerund: avoid doing, consider applying, suggest trying.",
    life: "🏠 Це як сталий маршрут після слова: avoid завжди веде до -ing.",
  },
  modal: {
    sci: "🔬 Modals передають обов'язок, пораду, дозвіл або логічний висновок: must, should, may, have to.",
    life: "🏠 Must be home — це не наказ, а сильний висновок за доказом.",
  },
  article: {
    sci: "🔬 Articles показують, чи предмет новий/один із багатьох, чи вже конкретний. Звук важливіший за літеру: an hour.",
    life: "🏠 A/an — вперше показуємо предмет, the — повертаємось до вже відомого.",
  },
  linker: {
    sci: "🔬 Linkers показують логіку між частинами: contrast, cause, result, addition.",
    life: "🏠 However розвертає думку, therefore показує наслідок.",
  },
  phrasal: {
    sci: "🔬 Phrasal verbs мають значення як ціла фраза, не як сума окремих слів.",
    life: "🏠 Put off — це не 'покласти геть', а 'відкласти'.",
  },
  word: {
    sci: "🔬 Vocabulary questions перевіряють точне значення і стиль слова в контексті.",
    life: "🏠 Обирай слово, яке природно звучить у реченні, а не просто схоже за перекладом.",
  },
  zero_cond: {
    sci: "🔬 Zero conditional описує загальне правило або факт: if + present, present.",
    life: "🏠 Як закон природи: якщо нагріти лід, він тане.",
  },
  reading: {
    sci: "🔬 Reading перевіряє доказ у тексті. Правильна відповідь має бути підтверджена фразою або логікою уривка.",
    life: "🏠 Не обирай відповідь, яка просто звучить розумно. Шукай рядок-доказ.",
  },
};

function q(id, variant, topic, prompt, choices, correct, explanation) {
  const notes = topicNotes[topic] || topicNotes.reading;
  const choiceExplanations = {};
  for (const [key, value] of Object.entries(choices)) {
    choiceExplanations[key] =
      key === correct
        ? `✅ Так: ${explanation}`
        : `❌ Ні: "${value}" не відповідає граматичній ролі, часовій логіці або змісту цього речення.`;
  }
  return {
    id,
    subject: "english",
    block: topic === "reading" || topic === "reference" || topic === "inference" ? "reading" : "use_of_english",
    topic,
    prompt,
    choices,
    correct_answer: correct,
    explanation,
    variant,
    choice_explanations: choiceExplanations,
    scientific_explanation: notes.sci,
    real_life_example: notes.life,
  };
}

const v2 = [
  q("english-realstyle-001-v2", 2, "passive", "The results ___ before publication.", { A: "checked", B: "were checked", C: "were checking", D: "have checking" }, "B", "Passive: were checked."),
  q("english-realstyle-002-v2", 2, "word_form", "Accurate ___ is essential in a laboratory.", { A: "measure", B: "measurable", C: "measurement", D: "measuringly" }, "C", "A noun is needed: measurement."),
  q("english-realstyle-003-v2", 2, "conditionals", "If she had followed the instructions, she ___ the error.", { A: "will avoid", B: "would avoid", C: "would have avoided", D: "avoids" }, "C", "Third conditional: would have + V3."),
  q("english-realstyle-004-v2", 2, "collocation", "The students were asked to ___ research on air quality.", { A: "make", B: "do", C: "take", D: "put" }, "B", "Collocation: do research."),
  q("english-realstyle-005-v2", 2, "inference", "The course was demanding, but most students completed it successfully. What can be inferred?", { A: "The course was impossible.", B: "The course required effort.", C: "No one completed the course.", D: "The course was cancelled." }, "B", "Demanding means it required effort."),
  q("english-realstyle-006-v2", 2, "relative", "The researcher ___ article was cited received an award.", { A: "which", B: "where", C: "whose", D: "what" }, "C", "Whose shows possession."),
  q("english-realstyle-007-v2", 2, "quantifier", "There is ___ information about the deadline.", { A: "many", B: "few", C: "several", D: "little" }, "D", "Information is uncountable: little information."),
  q("english-realstyle-008-v2", 2, "prep", "The project depends ___ reliable data.", { A: "of", B: "on", C: "for", D: "at" }, "B", "Depend on."),
  q("english-realstyle-009-v2", 2, "reference", "The new policy reduced delays. This change helped students plan better. 'This change' refers to:", { A: "the delays", B: "the new policy", C: "the students", D: "the plan" }, "B", "The phrase points back to the new policy."),
  q("english-realstyle-010-v2", 2, "tense", "She ___ at the university since 2022.", { A: "works", B: "worked", C: "has worked", D: "is working yesterday" }, "C", "Since + starting point often needs Present Perfect."),
  q("english-realstyle-011-v2", 2, "gerund", "He considered ___ for the scholarship.", { A: "apply", B: "applying", C: "to applying", D: "applied" }, "B", "Consider + gerund."),
  q("english-realstyle-012-v2", 2, "modal", "You ___ be exhausted after such a long exam.", { A: "must", B: "can to", C: "should to", D: "have" }, "A", "Must can express a strong logical conclusion."),
  q("english-realstyle-013-v2", 2, "article", "It took ___ hour to finish the task.", { A: "a", B: "an", C: "the an", D: "-" }, "B", "An before vowel sound: an hour."),
  q("english-realstyle-014-v2", 2, "linker", "The evidence was limited; ___, the conclusion was cautious.", { A: "therefore", B: "although", C: "despite", D: "unless" }, "A", "Therefore shows result."),
  q("english-realstyle-015-v2", 2, "phrasal", "The exam was ___ because of a technical issue.", { A: "put off", B: "put on", C: "put up", D: "put out" }, "A", "Put off means postpone."),
  q("english-realstyle-016-v2", 2, "word", "The instructions were ___, so everyone understood them.", { A: "ambiguous", B: "clear", C: "random", D: "silent" }, "B", "Clear fits the meaning."),
  q("english-realstyle-017-v2", 2, "tense", "By the time we arrived, the lecture ___ already ___.", { A: "has / started", B: "had / started", C: "will / start", D: "is / starting" }, "B", "Past Perfect for an earlier past action."),
  q("english-realstyle-018-v2", 2, "zero_cond", "If metal is heated, it ___.", { A: "expanded", B: "expands", C: "will expanded", D: "would expanded" }, "B", "Zero conditional: present + present."),
  q("english-realstyle-019-v2", 2, "passive", "The data ___ on a secure server.", { A: "store", B: "stores", C: "are stored", D: "storing" }, "C", "Passive: are stored."),
  q("english-realstyle-020-v2", 2, "collocation", "The team made significant ___ during the project.", { A: "progress", B: "progresses", C: "attention", D: "homework" }, "A", "Collocation: make progress."),
  q("english-realstyle-021-v2", 2, "prep", "She is interested ___ environmental policy.", { A: "on", B: "at", C: "in", D: "for" }, "C", "Interested in."),
  q("english-realstyle-022-v2", 2, "word_form", "The results were checked ___ before submission.", { A: "careful", B: "carefully", C: "care", D: "carefulness" }, "B", "An adverb modifies checked: carefully."),
  q("english-realstyle-023-v2", 2, "reading", "A small pilot study cannot prove a nationwide trend, but it can show whether the method is practical. The main idea is that:", { A: "pilot studies are useless", B: "a pilot study has limited but useful value", C: "nationwide trends are always false", D: "methods do not matter" }, "B", "The text says limited proof but practical value."),
  q("english-realstyle-024-v2", 2, "modal", "She ___ have left already; her coat is gone.", { A: "must", B: "should to", C: "need", D: "can to" }, "A", "Must have + V3 expresses a strong conclusion about the past."),
  q("english-realstyle-025-v2", 2, "conditionals", "If I ___ more time, I would revise the essay again.", { A: "have", B: "had", C: "will have", D: "had had" }, "B", "Second conditional: if + Past Simple, would + verb."),
  q("english-realstyle-026-v2", 2, "conditionals", "If the file had been saved, the work ___ lost.", { A: "would not be", B: "will not be", C: "would not have been", D: "is not" }, "C", "Third conditional passive: would not have been lost."),
  q("english-realstyle-027-v2", 2, "tense", "By next Friday, they ___ the report.", { A: "will have completed", B: "completed", C: "have completed yesterday", D: "are completed" }, "A", "Future Perfect: will have + V3."),
  q("english-realstyle-028-v2", 2, "linker", "The task was simple; ___, many candidates overlooked a key word.", { A: "however", B: "because", C: "therefore", D: "so" }, "A", "However shows contrast."),
  q("english-realstyle-029-v2", 2, "prep", "The solution is different ___ the previous one.", { A: "than", B: "from", C: "of", D: "at" }, "B", "Different from."),
  q("english-realstyle-030-v2", 2, "reading", "When a paragraph begins with 'As a result', the next sentence usually presents:", { A: "a cause", B: "a contrast", C: "a consequence", D: "an unrelated example" }, "C", "As a result signals a consequence."),
];

const v3 = [
  q("english-realstyle-001-v3", 3, "passive", "The application ___ by the admissions office yesterday.", { A: "processed", B: "was processed", C: "was processing", D: "has processing" }, "B", "Passive in Past Simple: was processed."),
  q("english-realstyle-002-v3", 3, "word_form", "The new software increased team ___.", { A: "productive", B: "productively", C: "productivity", D: "produce" }, "C", "A noun is needed: productivity."),
  q("english-realstyle-003-v3", 3, "conditionals", "If the instructions were clearer, fewer users ___ support.", { A: "needed", B: "would need", C: "will needed", D: "had needed" }, "B", "Second conditional: would + verb."),
  q("english-realstyle-004-v3", 3, "collocation", "Before choosing a programme, students should ___ a decision carefully.", { A: "make", B: "do", C: "take to", D: "perform" }, "A", "Collocation: make a decision."),
  q("english-realstyle-005-v3", 3, "inference", "The article says online courses are flexible, but require strong self-discipline. What follows?", { A: "They are always easier.", B: "They may not suit everyone.", C: "They have no advantages.", D: "They remove all responsibility." }, "B", "The text gives both benefit and requirement."),
  q("english-realstyle-006-v3", 3, "relative", "The platform ___ we used for training saved our progress.", { A: "where", B: "whose", C: "which", D: "what" }, "C", "Which refers to a thing: the platform."),
  q("english-realstyle-007-v3", 3, "quantifier", "Only ___ students submitted the optional task.", { A: "much", B: "little", C: "a few", D: "any" }, "C", "Students are countable: a few students."),
  q("english-realstyle-008-v3", 3, "prep", "The lecturer focused ___ common mistakes.", { A: "on", B: "in", C: "of", D: "to" }, "A", "Focus on."),
  q("english-realstyle-009-v3", 3, "reference", "The survey was anonymous, and this encouraged honest answers. 'This' refers to:", { A: "the honesty", B: "the anonymity of the survey", C: "the answers", D: "the respondents" }, "B", "This points back to the anonymous survey."),
  q("english-realstyle-010-v3", 3, "tense", "I ___ three practice tests this week.", { A: "completed yesterday", B: "have completed", C: "was completed", D: "complete last week" }, "B", "This week can connect past actions to now: Present Perfect."),
  q("english-realstyle-011-v3", 3, "gerund", "They suggested ___ the schedule.", { A: "change", B: "to change", C: "changing", D: "changed" }, "C", "Suggest + gerund."),
  q("english-realstyle-012-v3", 3, "modal", "Students ___ bring ID; it is required by the rules.", { A: "might", B: "have to", C: "could to", D: "may to" }, "B", "Have to expresses external obligation."),
  q("english-realstyle-013-v3", 3, "article", "The university opened ___ new laboratory.", { A: "a", B: "an", C: "the an", D: "-" }, "A", "A before consonant sound: a new laboratory."),
  q("english-realstyle-014-v3", 3, "linker", "___ the instructions were long, they were easy to follow.", { A: "Because", B: "Although", C: "Therefore", D: "So" }, "B", "Although introduces contrast."),
  q("english-realstyle-015-v3", 3, "phrasal", "Please ___ the form before the deadline.", { A: "fill in", B: "fill out of", C: "fill away", D: "fill under" }, "A", "Fill in/fill out a form."),
  q("english-realstyle-016-v3", 3, "word", "The explanation was ___ enough for beginners.", { A: "hostile", B: "accessible", C: "temporary", D: "irrelevant" }, "B", "Accessible means easy to understand/use."),
  q("english-realstyle-017-v3", 3, "tense", "While the teacher was explaining, several students ___ notes.", { A: "took", B: "were taking", C: "have taken yesterday", D: "had taking" }, "B", "Past Continuous for an action in progress."),
  q("english-realstyle-018-v3", 3, "zero_cond", "If you divide by zero, the operation ___ undefined.", { A: "is", B: "was", C: "will was", D: "would been" }, "A", "Zero conditional/general rule."),
  q("english-realstyle-019-v3", 3, "passive", "The final scores ___ automatically.", { A: "calculate", B: "are calculated", C: "calculating", D: "has calculated" }, "B", "Passive: are calculated."),
  q("english-realstyle-020-v3", 3, "collocation", "The committee reached a ___ after a long discussion.", { A: "decision", B: "homework", C: "research", D: "mistake" }, "A", "Collocation: reach a decision."),
  q("english-realstyle-021-v3", 3, "prep", "This result is similar ___ the previous finding.", { A: "to", B: "with", C: "of", D: "at" }, "A", "Similar to."),
  q("english-realstyle-022-v3", 3, "word_form", "The argument was presented in a ___ way.", { A: "logic", B: "logical", C: "logically", D: "logician" }, "B", "An adjective is needed before way: logical."),
  q("english-realstyle-023-v3", 3, "reading", "The passage states that the tool saves time, but only after users learn the basics. The best conclusion is:", { A: "Training is unnecessary.", B: "The tool can be useful after initial learning.", C: "The tool never saves time.", D: "Users cannot learn it." }, "B", "The text links usefulness with initial learning."),
  q("english-realstyle-024-v3", 3, "modal", "You ___ not share your password with anyone.", { A: "must", B: "might to", C: "can to", D: "would to" }, "A", "Must not expresses prohibition."),
  q("english-realstyle-025-v3", 3, "conditionals", "If the internet connection fails, the app ___ offline mode.", { A: "uses", B: "used", C: "would used", D: "had used" }, "A", "Zero/real conditional for a general system behavior."),
  q("english-realstyle-026-v3", 3, "conditionals", "If they had checked the data, they ___ the duplicate rows.", { A: "will find", B: "would find", C: "would have found", D: "find" }, "C", "Third conditional: would have + V3."),
  q("english-realstyle-027-v3", 3, "tense", "The platform ___ users since 2020.", { A: "supports", B: "supported yesterday", C: "has supported", D: "is support" }, "C", "Since + starting point: Present Perfect."),
  q("english-realstyle-028-v3", 3, "linker", "The sample was small; ___, the findings should be treated carefully.", { A: "therefore", B: "unless", C: "although", D: "meanwhile" }, "A", "Therefore signals the conclusion/result."),
  q("english-realstyle-029-v3", 3, "prep", "The candidate was familiar ___ the format of the exam.", { A: "with", B: "on", C: "for", D: "at" }, "A", "Familiar with."),
  q("english-realstyle-030-v3", 3, "reading", "If a question asks for the author's attitude, the answer should describe:", { A: "tone or opinion", B: "only a date", C: "a grammar rule", D: "an unrelated fact" }, "A", "Author's attitude means tone/opinion."),
];

function replaceVariant(data, variant, questions) {
  const set = data.quiz_sets.find((s) => s.id === `exam-english-30-v${variant}`);
  if (!set) throw new Error(`Missing English variant ${variant}`);
  set.questions = questions;
  set.title = `Full Real-Style English Exam Drill — Variant ${variant}`;
  set.updated_at = new Date().toISOString();
}

for (const file of findQuizBanks(repoRoot)) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  replaceVariant(data, 2, v2);
  replaceVariant(data, 3, v3);
  data.updated_at = new Date().toISOString();
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`updated ${file}`);
}
