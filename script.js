// Language data
const languageData = {
    en: {
        gameTitle: "Remember the Hieroglyphs",
        challengeTitle: "Ancient Memory Challenge",
        instructions: "Symbols appear for 5 seconds. After they disappear, arrange them in the empty boxes in the same order.",
        checkBtn: "Check Order",
        retryBtn: "Retry",
        nextBtn: "Next",
        resultText: "⭐ Result:",
        scoreLabel: "Score",
        streakLabel: "Streak",
        levelLabel: "Level",
        langText: "العربية",
        levelDisplay: "Level:",
        correct: "Correct ✅",
        wrong: "Wrong ❌",
        symbols: [
            { char: '𓂀', name: 'Eye of Horus', colorClass: 'hiero-gold' },
            { char: '𓀾', name: 'Walking Man', colorClass: 'hiero-blue' },
            { char: '𓂧', name: 'Hand', colorClass: 'hiero-red' },
            { char: '𓀙', name: 'Kneeling Man', colorClass: 'hiero-green' },
            { char: '𓂻', name: 'Arm', colorClass: 'hiero-turquoise' },
            { char: '𓅱', name: 'Quail Chick', colorClass: 'hiero-orange' },
            { char: '𓆣', name: 'Scarab Beetle', colorClass: 'hiero-gold' },
            { char: '𓋹', name: 'Ankh', colorClass: 'hiero-blue' },
            { char: '𓋔', name: 'Sedge Plant', colorClass: 'hiero-green' },
            { char: '𓏞', name: 'Scribe Tool', colorClass: 'hiero-turquoise' }
        ]
    },
    ar: {
        gameTitle: "تذكر الهيروغليفيات",
        challengeTitle: "تحدي الذاكرة المصرية القديمة",
        instructions: "تظهر الرموز لمدة 5 ثواني. بعد اختفائها، رتبها في المربعات الفارغة بنفس الترتيب.",
        checkBtn: "التحقق من الترتيب",
        retryBtn: "إعادة المحاولة",
        nextBtn: "التالي",
        resultText: "⭐ النتيجة:",
        scoreLabel: "النقاط",
        streakLabel: "التتابع",
        levelLabel: "المستوى",
        langText: "English",
        levelDisplay: "المستوى:",
        correct: "صحيح ✅",
        wrong: "خطأ ❌",
        symbols: [
            { char: '𓂀', name: 'عين حورس', colorClass: 'hiero-gold' },
            { char: '𓀾', name: 'رجل يمشي', colorClass: 'hiero-blue' },
            { char: '𓂧', name: 'يد', colorClass: 'hiero-red' },
            { char: '𓀙', name: 'رجل راكع', colorClass: 'hiero-green' },
            { char: '𓂻', name: 'ذراع', colorClass: 'hiero-turquoise' },
            { char: '𓅱', name: 'كتكوت السمان', colorClass: 'hiero-orange' },
            { char: '𓆣', name: 'خنفساء الجعران', colorClass: 'hiero-gold' },
            { char: '𓋹', name: 'عنخ', colorClass: 'hiero-blue' },
            { char: '𓋔', name: 'نبات السعد', colorClass: 'hiero-green' },
            { char: '𓏞', name: 'أدوات الكاتب', colorClass: 'hiero-turquoise' }
        ]
    }
};

// Current language
let currentLang = 'en';
let hieroglyphs = languageData.en.symbols;

// DOM Elements
const symbolsDisplay = document.getElementById('symbols-display');
const answerSlots = document.getElementById('answer-slots');
const symbolPool = document.getElementById('symbol-pool');
const checkBtn = document.getElementById('check-btn');
const retryBtn = document.getElementById('retry-btn');
const nextBtn = document.getElementById('next-btn');
const timerElement = document.getElementById('timer');
const starsElement = document.getElementById('stars');
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');
const levelElement = document.getElementById('level');
const langSwitch = document.getElementById('lang-switch');
const langText = document.getElementById('lang-text');
const gameTitle = document.getElementById('game-title');
const challengeTitle = document.getElementById('challenge-title');
const gameInstructions = document.getElementById('game-instructions');
const checkText = document.getElementById('check-text');
const retryText = document.getElementById('retry-text');
const nextText = document.getElementById('next-text');
const resultText = document.getElementById('result-text');
const scoreLabel = document.getElementById('score-label');
const streakLabel = document.getElementById('streak-label');
const levelLabel = document.getElementById('level-label');
const levelDisplay = document.getElementById('level-display');

// Game variables
let currentSequence = [];
let userSequence = [];
let gameStarted = false;
let timer;
let timeLeft = 5;
let score = 0;
let streak = 0;
let level = 1;
let symbolsCount = 4;
let selectedSymbol = null;

// Initialize game
function initGame() {
    generateSequence();
    displaySymbols();
    createSymbolPool();
    resetUserSequence();
    updateScorePanel();
    updateStars(3);
    timeLeft = 5;
    timerElement.textContent = timeLeft.toString().padStart(2, '0');
    document.querySelector('.result span:first-child').textContent = languageData[currentLang].resultText;
}

// Generate random sequence
function generateSequence() {
    currentSequence = [];
    const shuffled = [...hieroglyphs].sort(() => 0.5 - Math.random());
    currentSequence = shuffled.slice(0, symbolsCount);
}

// Display symbols for memorization
function displaySymbols() {
    symbolsDisplay.innerHTML = '';
    currentSequence.forEach((symbol, index) => {
        const symbolElement = document.createElement('div');
        symbolElement.className = `symbol ${symbol.colorClass}`;
        symbolElement.textContent = symbol.char;
        symbolElement.title = symbol.name;
        symbolElement.style.animationDelay = `${index * 0.1}s`;
        symbolsDisplay.appendChild(symbolElement);
    });
    
    // Start timer for memorization
    startTimer();
}

// Create symbol pool for player selection
function createSymbolPool() {
    symbolPool.innerHTML = '';
    
    // Create extra symbols to increase difficulty
    const extraSymbolsCount = Math.min(6, hieroglyphs.length - symbolsCount);
    const allSymbols = [...hieroglyphs];
    const extraSymbols = allSymbols
        .filter(symbol => !currentSequence.some(s => s.char === symbol.char))
        .sort(() => 0.5 - Math.random())
        .slice(0, extraSymbolsCount);
    
    // Combine target symbols with extra symbols
    const poolSymbols = [...currentSequence, ...extraSymbols];
    
    // Shuffle symbols randomly
    const shuffled = [...poolSymbols].sort(() => 0.5 - Math.random());
    
    shuffled.forEach(symbol => {
        const option = document.createElement('div');
        option.className = `symbol-option ${symbol.colorClass}`;
        option.textContent = symbol.char;
        option.title = symbol.name;
        option.addEventListener('click', () => {
            // Highlight selection
            document.querySelectorAll('.symbol-option').forEach(opt => {
                opt.style.border = '2px solid var(--gold-primary)';
            });
            option.style.border = '3px solid #fff';
            selectedSymbol = symbol;
        });
        symbolPool.appendChild(option);
    });
}

// Start the countdown timer
function startTimer() {
    clearInterval(timer);
    timeLeft = 5;
    timerElement.textContent = timeLeft.toString().padStart(2, '0');
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft.toString().padStart(2, '0');
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            symbolsDisplay.innerHTML = '<div class="symbol">?</div>'.repeat(symbolsCount);
        }
    }, 1000);
}

// Reset user sequence
function resetUserSequence() {
    userSequence = Array(symbolsCount).fill('');
    selectedSymbol = null;
    document.querySelectorAll('.answer-slot').forEach(slot => {
        slot.textContent = '';
        slot.className = 'answer-slot';
        slot.dataset.colorClass = '';
        slot.classList.remove('filled');
    });
    document.querySelectorAll('.symbol-option').forEach(opt => {
        opt.style.border = '2px solid var(--gold-primary)';
    });
}

// Handle answer slot clicks
answerSlots.addEventListener('click', (e) => {
    if (!e.target.classList.contains('answer-slot') || timeLeft > 0 || !selectedSymbol) return;
    
    const slot = e.target;
    const index = parseInt(slot.dataset.index);
    
    slot.textContent = selectedSymbol.char;
    slot.className = `answer-slot filled ${selectedSymbol.colorClass}`;
    userSequence[index] = selectedSymbol.char;
    slot.title = selectedSymbol.name;
    
    // Reset selection
    document.querySelectorAll('.symbol-option').forEach(opt => {
        opt.style.border = '2px solid var(--gold-primary)';
    });
    selectedSymbol = null;
});

// Update stars display
function updateStars(count) {
    starsElement.textContent = '⭐'.repeat(count);
}

// Check user's answer
checkBtn.addEventListener('click', () => {
    if (timeLeft > 0 || userSequence.length !== symbolsCount) return;
    
    const isCorrect = userSequence.every((symbol, index) => symbol === currentSequence[index].char);
    
    if (isCorrect) {
        resultText.textContent = `${languageData[currentLang].resultText} ${languageData[currentLang].correct}`;
        updateStars(5);
        score += level * 10;
        streak++;
        
        // Level up every 3 correct answers
        if (streak % 3 === 0 && level < 5) {
            level++;
            symbolsCount = Math.min(4 + level - 1, 8);
            levelDisplay.textContent = `${languageData[currentLang].levelDisplay} ${level}`;
            levelElement.textContent = level;
        }
    } else {
        resultText.textContent = `${languageData[currentLang].resultText} ${languageData[currentLang].wrong}`;
        updateStars(1);
        streak = 0;
    }
    
    updateScorePanel();
});

// Update score panel
function updateScorePanel() {
    scoreElement.textContent = score;
    streakElement.textContent = streak;
    levelElement.textContent = level;
    levelDisplay.textContent = `${languageData[currentLang].levelDisplay} ${level}`;
}

// Retry button
retryBtn.addEventListener('click', initGame);

// Next button
nextBtn.addEventListener('click', () => {
    initGame();
});

// Switch language
langSwitch.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    hieroglyphs = languageData[currentLang].symbols;
    updateLanguage();
    initGame();
});

// Update UI language
function updateLanguage() {
    const lang = languageData[currentLang];
    gameTitle.textContent = lang.gameTitle;
    challengeTitle.textContent = lang.challengeTitle;
    gameInstructions.innerHTML = `<p>${lang.instructions}</p>`;
    checkText.textContent = lang.checkBtn;
    retryText.textContent = lang.retryBtn;
    nextText.textContent = lang.nextBtn;
    resultText.textContent = lang.resultText;
    scoreLabel.textContent = lang.scoreLabel;
    streakLabel.textContent = lang.streakLabel;
    levelLabel.textContent = lang.levelLabel;
    langText.textContent = lang.langText;
    levelDisplay.textContent = `${lang.levelDisplay} ${level}`;
    
    // Update text direction
    document.body.className = currentLang === 'ar' ? 'lang-arabic' : '';
}

// Initialize the game on load
window.addEventListener('load', () => {
    updateLanguage();
    initGame();
    
    // Prevent zooming on mobile
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if(e.scale !== 1) e.preventDefault();
    }, { passive: false });
    
    // Improve touch experience
    document.querySelectorAll('.symbol-option, .answer-slot, .game-btn').forEach(el => {
        el.style.touchAction = 'manipulation';
    });
    
    // Add hover effects for interactions
    const interactiveElements = document.querySelectorAll('button, .answer-slot, .symbol-option');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.05)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
});
