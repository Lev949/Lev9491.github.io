const taskEl = document.getElementById('task');
const answerInput = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const tableSelect = document.getElementById('tableSelect');
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

const STORAGE_KEY = 'miniLernBoxVocab';

let currentTask = null;
let score = 0;
let streak = 0;
let level = 1;
let vocabList = loadVocab();
let vocabIndex = 0;

const flashcards = [
  { front: 'Was ist 3 × 4?', back: '12' },
  { front: 'Was ist 7 × 6?', back: '42' },
  { front: 'Was ist 8 × 8?', back: '64' },
  { front: 'Was ist 9 × 5?', back: '45' },
  { front: 'Was ist 2 × 9?', back: '18' },
  { front: 'Was ist 6 × 7?', back: '42' },
  { front: 'Was ist 5 × 5?', back: '25' },
  { front: 'Was ist 4 × 9?', back: '36' }
];

let cardIndex = 0;
function showRandomCard() {
  cardIndex = (cardIndex + 1) % flashcards.length;
  const card = flashcards[cardIndex];
  cardFrontText.textContent = card.front;
  cardBackText.textContent = card.back;
  flashcardEl.classList.remove('flipped');
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
  showRandomCard();
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

updateStats();
renderVocabList();
showVocabCard();
generateTask();
showRandomCard();
