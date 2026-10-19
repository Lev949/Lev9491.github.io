const taskEl = document.getElementById('task');
const answerInput = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const statScoreEl = document.getElementById('stat-score');
const statStreakEl = document.getElementById('stat-streak');
const statLevelEl = document.getElementById('stat-level');

const flashcardEl = document.getElementById('flashcard');
const cardFrontText = document.getElementById('card-front-text');
const cardBackText = document.getElementById('card-back-text');
const flipBtn = document.getElementById('flipBtn');
const nextCardBtn = document.getElementById('nextCardBtn');

let currentTask = null;
let score = 0;
let streak = 0;
let level = 1;

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

function generateTask() {
  const first = Math.floor(Math.random() * 10) + 1;
  const second = Math.floor(Math.random() * 10) + 1;
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

updateStats();
generateTask();
showRandomCard();
