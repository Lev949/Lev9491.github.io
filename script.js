const taskEl = document.getElementById('task');
const answerInput = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const tableSelect = document.getElementById('tableSelect');
const flashcardTableSelect = document.getElementById('flashcardTableSelect');
const statScoreEl = document.getElementById('stat-score');
const statStreakEl = document.getElementById('stat-streak');
const statLevelEl = document.getElementById('stat-level');

const flashcardEl = document.getElementById('flashcard');
const cardFrontText = document.getElementById('card-front-text');
const cardBackText = document.getElementById('card-back-text');
const flipBtn = document.getElementById('flipBtn');
const nextCardBtn = document.getElementById('nextCardBtn');

const vocabForm = document.getElementById('vocabForm');
const englishWordInput = document.getElementById('englishWord');
const germanWordInput = document.getElementById('germanWord');
const vocabMessage = document.getElementById('vocabMessage');
const vocabListEl = document.getElementById('vocabList');
const vocabFlashcard = document.getElementById('vocabFlashcard');
const vocabFront = document.getElementById('vocabFront');
const vocabBack = document.getElementById('vocabBack');
const vocabFlipBtn = document.getElementById('vocabFlipBtn');
const vocabNextBtn = document.getElementById('vocabNextBtn');
const themeToggle = document.getElementById('themeToggle');

const STORAGE_KEY = 'miniLernBoxVocab';
const THEME_KEY = 'miniLernBoxTheme';

let currentTask = null;
let score = 0;
let streak = 0;
let level = 1;
let vocabList = loadVocab();
let vocabIndex = 0;
let flashcards = [];
let flashcardIndex = 0;

function buildFlashcardSet(tableValue) {
  const cards = [];

  if (tableValue === 'all') {
    for (let a = 1; a <= 10; a += 1) {
      for (let b = 1; b <= 10; b += 1) {
        cards.push({ front: `Was ist ${a} × ${b}?`, back: String(a * b) });
      }
    }
    return cards;
  }

  const table = Number(tableValue);
  for (let i = 1; i <= 10; i += 1) {
    cards.push({ front: `Was ist ${table} × ${i}?`, back: String(table * i) });
  }

  return cards;
}

function updateFlashcardDisplay() {
  if (!flashcards.length) {
    cardFrontText.textContent = 'Keine Karte';
    cardBackText.textContent = '—';
    flashcardEl.classList.remove('flipped');
    return;
  }

  const current = flashcards[flashcardIndex % flashcards.length];
  cardFrontText.textContent = current.front;
  cardBackText.textContent = current.back;
  flashcardEl.classList.remove('flipped');
}

function updateFlashcardsForSelectedTable() {
  flashcards = buildFlashcardSet(flashcardTableSelect.value);
  flashcardIndex = 0;
  updateFlashcardDisplay();
}

function updateStats() {
  statScoreEl.textContent = score;
  statStreakEl.textContent = streak;
  statLevelEl.textContent = level;
}

function getSelectedTable() {
  return tableSelect.value;
}

function generateTask() {
  const selectedTable = getSelectedTable();
  let first;
  let second;

  if (selectedTable === 'all') {
    first = Math.floor(Math.random() * 10) + 1;
    second = Math.floor(Math.random() * 10) + 1;
  } else {
    const table = Number(selectedTable);
    first = table;
    second = Math.floor(Math.random() * 10) + 1;
  }

  currentTask = { a: first, b: second, answer: first * second };
  taskEl.textContent = `${first} × ${second} = ?`;
  answerInput.value = '';
  answerInput.focus();
  feedbackEl.textContent = 'Bereit?';
  feedbackEl.classList.remove('success', 'error');
}

function checkAnswer() {
  if (!currentTask) {
    generateTask();
    return;
  }

  const userAnswer = Number(answerInput.value);
  if (answerInput.value === '' || Number.isNaN(userAnswer)) {
    feedbackEl.textContent = 'Bitte gib eine Zahl ein!';
    feedbackEl.classList.add('error');
    return;
  }

  if (userAnswer === currentTask.answer) {
    score += 10;
    streak += 1;
    if (streak > 0 && streak % 3 === 0) {
      level += 1;
    }
    feedbackEl.textContent = 'Richtig! Super gemacht!';
    feedbackEl.classList.add('success');
  } else {
    score = Math.max(0, score - 2);
    streak = 0;
    feedbackEl.textContent = `Leider falsch. Die richtige Antwort ist ${currentTask.answer}.`;
    feedbackEl.classList.add('error');
  }

  updateStats();
}

checkBtn.addEventListener('click', () => {
  checkAnswer();
});

nextBtn.addEventListener('click', () => {
  generateTask();
});

tableSelect.addEventListener('change', () => {
  generateTask();
});

flashcardTableSelect.addEventListener('change', () => {
  updateFlashcardsForSelectedTable();
});

answerInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkAnswer();
    setTimeout(generateTask, 800);
  }
});

flipBtn.addEventListener('click', () => {
  flashcardEl.classList.toggle('flipped');
});

nextCardBtn.addEventListener('click', () => {
  if (!flashcards.length) {
    return;
  }
  flashcardIndex = (flashcardIndex + 1) % flashcards.length;
  updateFlashcardDisplay();
});

function loadVocab() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [
      { english: 'apple', german: 'Apfel' },
      { english: 'house', german: 'Haus' },
      { english: 'book', german: 'Buch' },
      { english: 'school', german: 'Schule' }
    ];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveVocab() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vocabList));
}

function renderVocabList() {
  vocabListEl.innerHTML = '';

  if (vocabList.length === 0) {
    const item = document.createElement('li');
    item.innerHTML = '<span>Keine Wörter gespeichert</span>';
    vocabListEl.appendChild(item);
    return;
  }

  vocabList.forEach((word) => {
    const item = document.createElement('li');
    item.innerHTML = `
      <span>${word.english}</span>
      <span>${word.german}</span>
    `;
    vocabListEl.appendChild(item);
  });
}

function showVocabCard() {
  if (vocabList.length === 0) {
    vocabFront.textContent = 'Noch keine Wörter';
    vocabBack.textContent = 'Bitte füge welche hinzu';
    vocabFlashcard.classList.remove('flipped');
    return;
  }

  const current = vocabList[vocabIndex % vocabList.length];
  vocabFront.textContent = current.english;
  vocabBack.textContent = current.german;
  vocabFlashcard.classList.remove('flipped');
}

vocabForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const english = englishWordInput.value.trim();
  const german = germanWordInput.value.trim();

  if (!english || !german) {
    vocabMessage.textContent = 'Bitte fülle beide Felder aus.';
    return;
  }

  vocabList.push({ english, german });
  saveVocab();
  renderVocabList();
  vocabIndex = vocabList.length - 1;
  showVocabCard();
  vocabForm.reset();
  vocabMessage.textContent = 'Wort gespeichert!';
});

vocabFlipBtn.addEventListener('click', () => {
  vocabFlashcard.classList.toggle('flipped');
});

vocabNextBtn.addEventListener('click', () => {
  if (vocabList.length === 0) {
    return;
  }
  vocabIndex = (vocabIndex + 1) % vocabList.length;
  showVocabCard();
});

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', isDark ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren');
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  applyTheme(isDark ? 'light' : 'dark');
});

updateFlashcardsForSelectedTable();
updateStats();
renderVocabList();
showVocabCard();
generateTask();
initTheme();
