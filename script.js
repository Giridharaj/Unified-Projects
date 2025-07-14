document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const movesCountSpan = document.getElementById('moves-count');
    const timerSpan = document.getElementById('timer');
    const newGameBtn = document.getElementById('new-game-btn');
    const winMessageDiv = document.getElementById('win-message');
    const finalMovesSpan = document.getElementById('final-moves');
    const finalTimeSpan = document.getElementById('final-time');
    const playAgainBtn = document.getElementById('play-again-btn');

    const cardImages = [
        "C:\\Users\\user\\Downloads\\black and white.jpeg",
        "C:\\Users\\user\\Downloads\\redrio.jpeg",
        "C:\\Users\\user\\Downloads\\redrio.jpeg",
        "C:\\Users\\user\\Downloads\\black and white.jpeg",
        "C:\\Users\\user\\Downloads\\cric-spidey.png",
        "C:\\Users\\user\\Downloads\\Black-spidey.png",
        "C:\\Users\\user\\Downloads\\circ-spidey.png",
        "C:\\Users\\user\\Downloads\\redrio.jpeg",
        "C:\\Users\\user\\Downloads\\circ-spidey.png",
        "C:\\Users\\user\\Downloads\\black and white.jpeg",
        "C:\\Users\\user\\Downloads\\redrio.jpeg"
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timerInterval;
    let seconds = 0;

    function createGameBoard() {
        const cardValues = [...cardImages, ...cardImages];
        shuffle(cardValues);

        gameBoard.innerHTML = '';
        winMessageDiv.classList.add('hidden');
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        movesCountSpan.textContent = moves;
        timerSpan.textContent = `${seconds}s`;
        clearInterval(timerInterval);

        cards = cardValues.map((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            card.dataset.index = index;

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = '?';

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            const img = document.createElement('img');
            img.src = value;
            cardBack.appendChild(img);

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);

            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
            return card;
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleCardClick(event) {
        if (moves === 0 && seconds === 0) {
            startTimer();
        }

        const clickedCard = event.currentTarget;
        if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped')) {
            flipCard(clickedCard);
            flippedCards.push(clickedCard);

            if (flippedCards.length === 2) {
                incrementMoves();
                checkForMatch();
            }
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            timerSpan.textContent = `${seconds}s`;
        }, 1000);
    }

    function flipCard(card) {
        card.classList.add('flipped');
    }

    function incrementMoves() {
        moves++;
        movesCountSpan.textContent = moves;
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            matchedPairs++;
            flippedCards = [];
            if (matchedPairs === cardImages.length) {
                endGame();
            }
        } else {
            setTimeout(() => {
                unflipCards();
            }, 1000);
        }
    }

    function unflipCards() {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
    }

    function endGame() {
        clearInterval(timerInterval);
        finalMovesSpan.textContent = moves;
        finalTimeSpan.textContent = seconds;
        winMessageDiv.classList.remove('hidden');
    }

    newGameBtn.addEventListener('click', createGameBoard);
    playAgainBtn.addEventListener('click', createGameBoard);

    createGameBoard();
});function preloadImages(imageArray) {
    imageArray.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
    });
}

preloadImages(cardImages);
