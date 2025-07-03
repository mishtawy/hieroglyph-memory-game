document.addEventListener('DOMContentLoaded', () => {
    // عناصر DOM
    const gameBoard = document.getElementById('gameBoard');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const timeDisplay = document.getElementById('time');
    const movesDisplay = document.getElementById('moves');
    const winModal = document.getElementById('winModal');
    const finalTimeDisplay = document.getElementById('finalTime');
    const finalMovesDisplay = document.getElementById('finalMoves');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const bgMusicToggle = document.getElementById('bgMusicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const toggleLanguage = document.getElementById('toggleLanguage');
    
    // عناصر الصوت
    const bgMusic = document.getElementById('bgMusic');
    const flipSound = document.getElementById('flipSound');
    const matchSound = document.getElementById('matchSound');
    const winSound = document.getElementById('winSound');
    
    // متغيرات اللعبة
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let isGameStarted = false;
    let isEnglish = false;
    let sfxEnabled = true;
    
    // رموز هيروغليفية
    const hieroglyphs = ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇'];
    
    // تهيئة اللعبة
    function initGame() {
        // إنشاء أزواج البطاقات
        const cardPairs = [...hieroglyphs, ...hieroglyphs];
        
        // خلط البطاقات
        cards = shuffleArray(cardPairs);
        
        // إنشاء لوحة اللعبة
        renderGameBoard();
        
        // إعادة تعيين المتغيرات
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        movesDisplay.textContent = moves;
        seconds = 0;
        updateTimerDisplay();
        isGameStarted = false;
        
        // إيقاف المؤقت إذا كان يعمل
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
    
    // عرض لوحة اللعبة
    function renderGameBoard() {
        gameBoard.innerHTML = '';
        
        cards.forEach((hieroglyph, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.hieroglyph = hieroglyph;
            
            const front = document.createElement('div');
            front.className = 'front';
            front.textContent = hieroglyph;
            
            const back = document.createElement('div');
            back.className = 'back';
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }
    
    // قلب البطاقة
    function flipCard() {
        // لا تسمح بقلب أكثر من بطاقتين أو بطاقة مقلوبة بالفعل أو متطابقة
        if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched') || !isGameStarted) {
            return;
        }
        
        // تشغيل صوت قلب البطاقة
        if (sfxEnabled) {
            flipSound.currentTime = 0;
            flipSound.play();
        }
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        // التحقق من التطابق عند قلب بطاقتين
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
    
    // التحقق من تطابق البطاقات
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const hieroglyph1 = card1.dataset.hieroglyph;
        const hieroglyph2 = card2.dataset.hieroglyph;
        
        if (hieroglyph1 === hieroglyph2) {
            // تطابق ناجح
            matchedPairs++;
            
            // تشغيل صوت التطابق
            if (sfxEnabled) {
                matchSound.currentTime = 0;
                matchSound.play();
            }
            
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
            
            // التحقق من فوز اللاعب
            if (matchedPairs === hieroglyphs.length) {
                endGame();
            }
        } else {
            // لا يوجد تطابق - إعادة البطاقات بعد تأخير
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }
        
        // إعادة تعيين البطاقات المقلوبة
        setTimeout(() => {
            flippedCards = [];
        }, 1000);
    }
    
    // بدء اللعبة
    function startGame() {
        if (!isGameStarted) {
            isGameStarted = true;
            startBtn.disabled = true;
            timer = setInterval(() => {
                seconds++;
                updateTimerDisplay();
            }, 1000);
        }
    }
    
    // إنهاء اللعبة
    function endGame() {
        clearInterval(timer);
        
        // تشغيل صوت الفوز
        if (sfxEnabled) {
            winSound.currentTime = 0;
            winSound.play();
        }
        
        // عرض نافذة الفوز
        finalTimeDisplay.textContent = formatTime(seconds);
        finalMovesDisplay.textContent = moves;
        winModal.style.display = 'flex';
    }
    
    // تحديث عرض المؤقت
    function updateTimerDisplay() {
        timeDisplay.textContent = formatTime(seconds);
    }
    
    // تنسيق الوقت
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // خلط المصفوفة
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // تبديل اللغة
    function toggleGameLanguage() {
        isEnglish = !isEnglish;
        
        if (isEnglish) {
            document.title = "Hieroglyph Memory Game";
            document.querySelector('h1').textContent = "Hieroglyph Memory Game";
            startBtn.textContent = "Start Game";
            restartBtn.textContent = "Restart";
            document.querySelector('.timer').innerHTML = 'Time: <span id="time">00:00</span>';
            document.querySelector('.moves').innerHTML = 'Moves: <span id="moves">0</span>';
            bgMusicToggle.textContent = "Toggle Music";
            sfxToggle.textContent = "Toggle SFX";
            volumeControl.querySelector('label').textContent = "Volume:";
            toggleLanguage.textContent = "العربية/English";
            
            if (winModal.style.display === 'flex') {
                document.querySelector('#winModal h2').textContent = "Congratulations! You Won!";
                document.querySelector('#winModal p:nth-of-type(1)').innerHTML = 'Final Time: <span id="finalTime"></span>';
                document.querySelector('#winModal p:nth-of-type(2)').innerHTML = 'Moves: <span id="finalMoves"></span>';
                playAgainBtn.textContent = "Play Again";
            }
        } else {
            document.title = "لعبة الذاكرة الهيروغليفية";
            document.querySelector('h1').textContent = "لعبة الذاكرة الهيروغليفية";
            startBtn.textContent = "بدء اللعبة";
            restartBtn.textContent = "إعادة تشغيل";
            document.querySelector('.timer').innerHTML = 'الوقت: <span id="time">00:00</span>';
            document.querySelector('.moves').innerHTML = 'الحركات: <span id="moves">0</span>';
            bgMusicToggle.textContent = "تشغيل/إيقاف الموسيقى";
            sfxToggle.textContent = "تشغيل/إيقاف المؤثرات";
            volumeControl.querySelector('label').textContent = "الصوت:";
            toggleLanguage.textContent = "English/العربية";
            
            if (winModal.style.display === 'flex') {
                document.querySelector('#winModal h2').textContent = "تهانينا! لقد فزت!";
                document.querySelector('#winModal p:nth-of-type(1)').innerHTML = 'الوقت النهائي: <span id="finalTime"></span>';
                document.querySelector('#winModal p:nth-of-type(2)').innerHTML = 'عدد الحركات: <span id="finalMoves"></span>';
                playAgainBtn.textContent = "العب مرة أخرى";
            }
        }
    }
    
    // التحكم في الصوت
    function updateVolume() {
        const volume = volumeSlider.value;
        bgMusic.volume = volume;
        flipSound.volume = volume;
        matchSound.volume = volume;
        winSound.volume = volume;
    }
    
    // استماع للأحداث
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        initGame();
    });
    
    bgMusicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    });
    
    sfxToggle.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
    });
    
    volumeSlider.addEventListener('input', updateVolume);
    toggleLanguage.addEventListener('click', toggleGameLanguage);
    
    // تهيئة اللعبة عند التحميل
    initGame();
    updateVolume();
});
