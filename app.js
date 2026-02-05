// Ratio & Fraction Learning App

// Emoji sets for questions
const emojiSets = {
    animals: {
        cat: '🐱', dog: '🐶', rabbit: '🐰', bird: '🐦', fish: '🐟',
        cow: '🐄', pig: '🐷', horse: '🐴', sheep: '🐑', chicken: '🐔'
    },
    food: {
        apple: '🍎', orange: '🍊', banana: '🍌', grape: '🍇', strawberry: '🍓',
        cake: '🎂', pizza: '🍕', burger: '🍔', cookie: '🍪', donut: '🍩'
    },
    objects: {
        star: '⭐', heart: '❤️', flower: '🌸', ball: '⚽', book: '📚',
        pencil: '✏️', car: '🚗', house: '🏠', tree: '🌳', sun: '☀️'
    }
};

// Question templates
const questionTemplates = [
    {
        type: 'ratio-to-fraction',
        template: (a, b, emoji1, emoji2, name1, name2) => ({
            visual: { type1: emoji1, count1: a, type2: emoji2, count2: b },
            question: `There are ${a} ${name1} and ${b} ${name2}.<br>Express the number of ${name1} to ${name2} as a <strong>fraction</strong>.`,
            answer: `${a}/${b}`,
            options: [`${a}/${b}`, `${b}/${a}`, `${a}/${a+b}`, `${b}/${a+b}`],
            explanation: `The ratio of ${name1} to ${name2} is ${a}:${b}.<br>As a fraction, this is <strong>${a}/${b}</strong> (${name1} over ${name2}).`
        })
    },
    {
        type: 'fraction-to-ratio',
        template: (a, b, emoji1, emoji2, name1, name2) => ({
            visual: { type1: emoji1, count1: a, type2: emoji2, count2: b },
            question: `If the fraction of ${name1} to ${name2} is ${a}/${b},<br>what is the <strong>ratio</strong> of ${name1} to ${name2}?`,
            answer: `${a} : ${b}`,
            options: [`${a} : ${b}`, `${b} : ${a}`, `${a} : ${a+b}`, `1 : ${Math.round(b/a)}`],
            explanation: `The fraction ${a}/${b} means ${a} ${name1} for every ${b} ${name2}.<br>As a ratio, this is <strong>${a}:${b}</strong>.`
        })
    },
    {
        type: 'part-to-whole',
        template: (a, b, emoji1, emoji2, name1, name2) => ({
            visual: { type1: emoji1, count1: a, type2: emoji2, count2: b },
            question: `There are ${a} ${name1} and ${b} ${name2}.<br>What <strong>fraction</strong> of the total are ${name1}?`,
            answer: `${a}/${a+b}`,
            options: [`${a}/${a+b}`, `${a}/${b}`, `${b}/${a+b}`, `${a+b}/${a}`],
            explanation: `Total items = ${a} + ${b} = ${a+b}.<br>Fraction of ${name1} = ${a} out of ${a+b} = <strong>${a}/${a+b}</strong>.`
        })
    },
    {
        type: 'ratio-meaning',
        template: (a, b, emoji1, emoji2, name1, name2) => ({
            visual: { type1: emoji1, count1: a, type2: emoji2, count2: b },
            question: `The ratio of ${name1} to ${name2} is ${a}:${b}.<br>This means for every ${a} ${name1}, there are how many ${name2}?`,
            answer: `${b}`,
            options: [`${b}`, `${a}`, `${a+b}`, `${a*b}`],
            explanation: `A ratio of ${a}:${b} means for every ${a} ${name1}, there are <strong>${b}</strong> ${name2}.`
        })
    },
    {
        type: 'equivalent-ratio',
        template: (a, b, emoji1, emoji2, name1, name2) => {
            const multiplier = 2;
            return {
                visual: { type1: emoji1, count1: a, type2: emoji2, count2: b },
                question: `If the ratio of ${name1} to ${name2} is ${a}:${b},<br>what is an <strong>equivalent ratio</strong>?`,
                answer: `${a*multiplier} : ${b*multiplier}`,
                options: [`${a*multiplier} : ${b*multiplier}`, `${a+1} : ${b+1}`, `${a} : ${b+1}`, `${a*2} : ${b}`],
                explanation: `To find an equivalent ratio, multiply both parts by the same number.<br>${a}×${multiplier} : ${b}×${multiplier} = <strong>${a*multiplier}:${b*multiplier}</strong>`
            };
        }
    },
    {
        type: 'simplify-ratio',
        template: (a, b, emoji1, emoji2, name1, name2) => {
            const multiplier = 2;
            const bigA = a * multiplier;
            const bigB = b * multiplier;
            return {
                visual: { type1: emoji1, count1: bigA, type2: emoji2, count2: bigB },
                question: `There are ${bigA} ${name1} and ${bigB} ${name2}.<br>What is the ratio in its <strong>simplest form</strong>?`,
                answer: `${a} : ${b}`,
                options: [`${a} : ${b}`, `${bigA} : ${bigB}`, `${b} : ${a}`, `1 : ${Math.round(bigB/bigA)}`],
                explanation: `${bigA}:${bigB} can be simplified by dividing both by ${multiplier}.<br>Simplest form = <strong>${a}:${b}</strong>`
            };
        }
    },
    {
        type: 'fraction-comparison',
        template: (a, b, emoji1, emoji2, name1, name2) => ({
            visual: { type1: emoji1, count1: a, type2: emoji2, count2: b },
            question: `The ratio ${a}:${b} is the same as which fraction?`,
            answer: `${a}/${b}`,
            options: [`${a}/${b}`, `${b}/${a}`, `${a}/${a+b}`, `${b}/${a+b}`],
            explanation: `The ratio ${a}:${b} directly converts to the fraction <strong>${a}/${b}</strong>.<br>The colon (:) becomes the fraction bar (/).`
        })
    }
];

// Game state
let currentQuestion = 0;
let score = 0;
let totalQuestions = 10;
let questions = [];
let answered = false;

// Generate a random question
function generateQuestion() {
    // Pick random template
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    
    // Pick random emoji category
    const categories = Object.keys(emojiSets);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const emojis = emojiSets[category];
    const emojiKeys = Object.keys(emojis);
    
    // Pick two different emojis
    const idx1 = Math.floor(Math.random() * emojiKeys.length);
    let idx2 = Math.floor(Math.random() * emojiKeys.length);
    while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * emojiKeys.length);
    }
    
    const name1 = emojiKeys[idx1];
    const name2 = emojiKeys[idx2];
    const emoji1 = emojis[name1];
    const emoji2 = emojis[name2];
    
    // Generate numbers (keep them small and coprime for cleaner ratios)
    const pairs = [[2,3], [3,4], [2,5], [3,5], [4,5], [1,2], [1,3], [2,1], [3,2], [5,3]];
    const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
    
    return template.template(a, b, emoji1, emoji2, name1 + 's', name2 + 's');
}

// Generate all questions for the session
function generateQuestions() {
    questions = [];
    for (let i = 0; i < totalQuestions; i++) {
        questions.push(generateQuestion());
    }
}

// Shuffle array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Display current question
function displayQuestion() {
    const q = questions[currentQuestion];
    
    // Update progress
    document.getElementById('progressFill').style.width = `${(currentQuestion / totalQuestions) * 100}%`;
    document.getElementById('qNum').textContent = currentQuestion + 1;
    document.getElementById('qTotal').textContent = totalQuestions;
    
    // Display visual
    const visualDisplay = document.getElementById('visualDisplay');
    let visualHTML = '';
    
    if (q.visual.count1 <= 6 && q.visual.count2 <= 6) {
        visualHTML = `
            <div class="visual-group">
                ${q.visual.type1.repeat(q.visual.count1).split('').join('')}
            </div>
            <div class="visual-divider">:</div>
            <div class="visual-group">
                ${q.visual.type2.repeat(q.visual.count2).split('').join('')}
            </div>
        `;
    } else {
        visualHTML = `
            <div class="visual-group">
                ${q.visual.type1} × ${q.visual.count1}
            </div>
            <div class="visual-divider">:</div>
            <div class="visual-group">
                ${q.visual.type2} × ${q.visual.count2}
            </div>
        `;
    }
    visualDisplay.innerHTML = visualHTML;
    
    // Display question
    document.getElementById('questionText').innerHTML = q.question;
    
    // Display options
    const optionsContainer = document.getElementById('answerOptions');
    const shuffledOptions = shuffle(q.options);
    optionsContainer.innerHTML = shuffledOptions.map(opt => 
        `<button class="answer-btn" data-answer="${opt}">${opt}</button>`
    ).join('');
    
    // Add click listeners
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => checkAnswer(btn));
    });
    
    // Hide feedback and next button
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    answered = false;
}

// Check answer
function checkAnswer(btn) {
    if (answered) return;
    answered = true;
    
    const selected = btn.dataset.answer;
    const q = questions[currentQuestion];
    const isCorrect = selected === q.answer;
    
    // Update score
    if (isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
    }
    document.getElementById('total').textContent = currentQuestion + 1;
    
    // Mark buttons
    document.querySelectorAll('.answer-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.answer === q.answer) {
            b.classList.add('correct');
        } else if (b === btn && !isCorrect) {
            b.classList.add('incorrect');
        }
    });
    
    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.style.display = 'block';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    document.getElementById('feedbackIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('feedbackText').textContent = isCorrect ? 'Correct!' : 'Not quite!';
    document.getElementById('feedbackExplanation').innerHTML = q.explanation;
    
    // Show next button
    document.getElementById('nextBtn').style.display = 'inline-flex';
    
    // Update streak
    updateStreak(isCorrect);
}

// Streak tracking
let streak = 0;
function updateStreak(correct) {
    if (correct) {
        streak++;
        if (streak >= 3) {
            document.getElementById('streak').textContent = `🔥${streak}`;
        }
    } else {
        streak = 0;
        document.getElementById('streak').textContent = '';
    }
}

// Next question
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= totalQuestions) {
        showResults();
    } else {
        displayQuestion();
    }
}

// Show results
function showResults() {
    document.getElementById('practice').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    const percentage = Math.round((score / totalQuestions) * 100);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTotal').textContent = totalQuestions;
    
    let icon, title, message;
    
    if (percentage >= 90) {
        icon = '🏆';
        title = 'Outstanding!';
        message = "You've mastered ratios and fractions! They're like old friends now.";
    } else if (percentage >= 70) {
        icon = '🎉';
        title = 'Great Job!';
        message = "You're getting the hang of ratios and fractions!";
    } else if (percentage >= 50) {
        icon = '👍';
        title = 'Good Effort!';
        message = "Keep practicing! Ratios and fractions will become easier.";
    } else {
        icon = '💪';
        title = 'Keep Going!';
        message = "Review the concepts and try again. You'll get it!";
    }
    
    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = message;
}

// Start/restart game
function startGame() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    
    document.getElementById('score').textContent = '0';
    document.getElementById('total').textContent = '0';
    document.getElementById('streak').textContent = '';
    
    generateQuestions();
    
    document.getElementById('intro').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review').style.display = 'none';
    document.getElementById('practice').style.display = 'block';
    
    displayQuestion();
}

// Show review
function showReview() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('practice').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review').style.display = 'block';
}

// Show intro
function showIntro() {
    document.getElementById('intro').style.display = 'block';
    document.getElementById('practice').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('tryAgainBtn').addEventListener('click', startGame);
    document.getElementById('reviewBtn').addEventListener('click', showReview);
    document.getElementById('backToStartBtn').addEventListener('click', showIntro);
});
