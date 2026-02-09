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
    document.getElementById('farmScenario').style.display = 'none';
    document.getElementById('practice').style.display = 'block';
    
    displayQuestion();
}

// Show review
function showReview() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('practice').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('farmScenario').style.display = 'none';
    document.getElementById('review').style.display = 'block';
}

// Show intro
function showIntro() {
    document.getElementById('intro').style.display = 'block';
    document.getElementById('practice').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review').style.display = 'none';
    document.getElementById('farmScenario').style.display = 'none';
}

// ==========================================
// Farm Scenario - Interactive Emoji Learning
// ==========================================

let farmState = {
    cats: 25,
    dogs: 20,
    currentStep: 0,
    maxSteps: 3
};

// Calculate GCD using Euclidean algorithm
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Render the emoji grid for a given animal
function renderEmojiGrid(containerId, emoji, count) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'grid-emoji';
        span.textContent = emoji;
        span.style.animationDelay = `${i * 0.03}s`;
        container.appendChild(span);
    }
}

// Helper: build a stacked fraction HTML string
function fracHTML(num, den, extraClass) {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `<span class="stacked-frac${cls}">` +
        `<span class="sf-num">${num}</span>` +
        `<span class="sf-bar"></span>` +
        `<span class="sf-den">${den}</span>` +
    `</span>`;
}

// Build simplification steps dynamically showing BOTH fraction & ratio
function buildSimplifySteps(cats, dogs) {
    const divisor = gcd(cats, dogs);
    const simplifiedCats = cats / divisor;
    const simplifiedDogs = dogs / divisor;
    const stepsContainer = document.getElementById('simplifySteps');

    stepsContainer.innerHTML = `
        <!-- Step 0: Original - show both fraction and ratio -->
        <div class="simplify-step active" id="step0">
            <div class="step-badge">Start</div>
            <div class="step-dual">
                <div class="dual-col">
                    <div class="dual-label">Fraction</div>
                    ${fracHTML(cats, dogs, 'step-frac')}
                </div>
                <div class="dual-equals">=</div>
                <div class="dual-col">
                    <div class="dual-label">Ratio</div>
                    <span class="step-ratio-val">${cats} : ${dogs}</span>
                </div>
            </div>
            <div class="step-description">We have ${cats} 🐱 for every ${dogs} 🐶</div>
        </div>

        <!-- Arrow 1 -->
        <div class="step-arrow" id="arrow1" style="display:none;">
            <div class="arrow-action">÷ ${divisor}</div>
            <div class="arrow-icon">⬇️</div>
            <div class="arrow-reason">Both ${cats} and ${dogs} are divisible by ${divisor}!</div>
        </div>

        <!-- Step 1: Find GCD -->
        <div class="simplify-step" id="step1" style="display:none;">
            <div class="step-badge">Step 1</div>
            <div class="step-find-gcd">
                <div class="gcd-title">Find what both numbers share</div>
                <div class="gcd-factors">
                    <div class="factor-row">
                        <span class="factor-label">${cats} =</span>
                        <span class="factor-value"><mark>${divisor}</mark> × ${simplifiedCats}</span>
                    </div>
                    <div class="factor-row">
                        <span class="factor-label">${dogs} =</span>
                        <span class="factor-value"><mark>${divisor}</mark> × ${simplifiedDogs}</span>
                    </div>
                </div>
                <div class="gcd-result">
                    GCD (Greatest Common Divisor) = <strong>${divisor}</strong>
                </div>
            </div>
            <div class="step-description">Both numbers can be divided evenly by ${divisor}</div>
        </div>

        <!-- Arrow 2 -->
        <div class="step-arrow" id="arrow2" style="display:none;">
            <div class="arrow-action">÷ ${divisor}</div>
            <div class="arrow-icon">⬇️</div>
        </div>

        <!-- Step 2: Divide - show BOTH fraction and ratio being divided -->
        <div class="simplify-step" id="step2" style="display:none;">
            <div class="step-badge">Step 2</div>
            <div class="step-dual-divide">
                <div class="divide-panel">
                    <div class="dual-label">Simplify the Fraction</div>
                    <div class="divide-visual">
                        ${fracHTML(`<s>${cats}</s>`, `<s>${dogs}</s>`, 'step-frac faded-frac')}
                        <span class="divide-arrow">➡️</span>
                        ${fracHTML(`<span class="div-operator">${cats} ÷ ${divisor} =</span> <strong>${simplifiedCats}</strong>`, `<span class="div-operator">${dogs} ÷ ${divisor} =</span> <strong>${simplifiedDogs}</strong>`, 'step-frac')}
                    </div>
                </div>
                <div class="divide-panel">
                    <div class="dual-label">Simplify the Ratio</div>
                    <div class="divide-visual">
                        <span class="ratio-old"><s>${cats} : ${dogs}</s></span>
                        <span class="divide-arrow">➡️</span>
                        <span class="ratio-new">
                            <span class="div-operator">${cats}÷${divisor}</span> : <span class="div-operator">${dogs}÷${divisor}</span>
                            = <strong>${simplifiedCats} : ${simplifiedDogs}</strong>
                        </span>
                    </div>
                </div>
            </div>
            <div class="step-description">Divide both numbers by ${divisor}</div>
        </div>

        <!-- Arrow 3 -->
        <div class="step-arrow" id="arrow3" style="display:none;">
            <div class="arrow-icon">⬇️</div>
        </div>

        <!-- Step 3: Result - show both simplified fraction and ratio -->
        <div class="simplify-step result-step" id="step3" style="display:none;">
            <div class="step-badge result-badge">Simplified!</div>
            <div class="step-dual result-dual">
                <div class="dual-col">
                    <div class="dual-label">Fraction</div>
                    ${fracHTML(simplifiedCats, simplifiedDogs, 'step-frac result-frac')}
                </div>
                <div class="dual-equals result-eq">=</div>
                <div class="dual-col">
                    <div class="dual-label">Ratio</div>
                    <span class="step-ratio-val result-ratio">${simplifiedCats} : ${simplifiedDogs}</span>
                </div>
            </div>
            <div class="step-description">For every ${simplifiedCats} 🐱, there are ${simplifiedDogs} 🐶!</div>
            <div class="step-visual-proof">
                <span>${'🐱'.repeat(Math.min(simplifiedCats, 10))}</span>
                <span class="proof-divider">:</span>
                <span>${'🐶'.repeat(Math.min(simplifiedDogs, 10))}</span>
            </div>
        </div>
    `;
}

// Update the farm display with given numbers
function updateFarmDisplay(cats, dogs) {
    farmState.cats = cats;
    farmState.dogs = dogs;
    farmState.currentStep = 0;

    // Render grids
    renderEmojiGrid('catGrid', '🐱', cats);
    renderEmojiGrid('dogGrid', '🐶', dogs);

    // Update counts
    document.getElementById('catCount').textContent = `${cats} cat${cats !== 1 ? 's' : ''}`;
    document.getElementById('dogCount').textContent = `${dogs} dog${dogs !== 1 ? 's' : ''}`;

    // Update fraction & ratio displays
    document.getElementById('fracTop').textContent = cats;
    document.getElementById('fracBottom').textContent = dogs;
    document.getElementById('ratioLeft').textContent = cats;
    document.getElementById('ratioRight').textContent = dogs;

    // Build simplification steps
    buildSimplifySteps(cats, dogs);

    // Reset simplify controls
    document.getElementById('simplifyNextBtn').style.display = 'inline-flex';
    document.getElementById('simplifyResetBtn').style.display = 'none';
    document.getElementById('simplifyNextBtn').textContent = 'Show Next Step ➡️';
}

// Show next simplification step
function showNextSimplifyStep() {
    farmState.currentStep++;
    const step = farmState.currentStep;

    if (step <= 3) {
        // Show the arrow before the step
        const arrow = document.getElementById(`arrow${step}`);
        if (arrow) {
            arrow.style.display = 'flex';
            arrow.classList.add('animate-in');
        }

        // Show the step
        const stepEl = document.getElementById(`step${step}`);
        if (stepEl) {
            stepEl.style.display = 'block';
            stepEl.classList.add('animate-in');
            // Scroll into view
            setTimeout(() => stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    }

    if (step >= 3) {
        document.getElementById('simplifyNextBtn').style.display = 'none';
        document.getElementById('simplifyResetBtn').style.display = 'inline-flex';
    }
}

// Reset simplification steps
function resetSimplifySteps() {
    farmState.currentStep = 0;
    // Hide all arrows and steps except step0
    for (let i = 1; i <= 3; i++) {
        const arrow = document.getElementById(`arrow${i}`);
        const step = document.getElementById(`step${i}`);
        if (arrow) { arrow.style.display = 'none'; arrow.classList.remove('animate-in'); }
        if (step) { step.style.display = 'none'; step.classList.remove('animate-in'); }
    }
    document.getElementById('simplifyNextBtn').style.display = 'inline-flex';
    document.getElementById('simplifyResetBtn').style.display = 'none';
}

// Show farm scenario section
function showFarmScenario() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('practice').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('review').style.display = 'none';
    document.getElementById('farmScenario').style.display = 'block';

    updateFarmDisplay(25, 20);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('tryAgainBtn').addEventListener('click', startGame);
    document.getElementById('reviewBtn').addEventListener('click', showReview);
    document.getElementById('backToStartBtn').addEventListener('click', showIntro);

    // Farm scenario listeners
    document.getElementById('exploreBtn').addEventListener('click', showFarmScenario);
    document.getElementById('simplifyNextBtn').addEventListener('click', showNextSimplifyStep);
    document.getElementById('simplifyResetBtn').addEventListener('click', resetSimplifySteps);
    document.getElementById('farmBackBtn').addEventListener('click', showIntro);
    document.getElementById('farmPracticeBtn').addEventListener('click', startGame);

    // Custom scenario
    document.getElementById('customGoBtn').addEventListener('click', () => {
        const cats = Math.max(1, Math.min(50, parseInt(document.getElementById('customCats').value) || 1));
        const dogs = Math.max(1, Math.min(50, parseInt(document.getElementById('customDogs').value) || 1));
        document.getElementById('customCats').value = cats;
        document.getElementById('customDogs').value = dogs;
        updateFarmDisplay(cats, dogs);
    });
});
