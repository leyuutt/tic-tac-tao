let gameMode = null;
let gameActive = false;

let player1Name = 'Player 1';
let player2Name = 'Player 2';
let currentPlayer = 'X';

let board = ['', '', '', '', '', '', '', '', ''];

let scores = {
    player1: 0,
    player2: 0,
    draws: 0
};

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const modeSelection = document.getElementById('modeSelection');
const playerNames = document.getElementById('playerNames');
const gameContainer = document.getElementById('gameContainer');
const resultOverlay = document.getElementById('resultOverlay');
const cells = document.querySelectorAll('.cell');

function init() {
    document.getElementById('twoPlayerBtn').addEventListener('click', () => selectMode('two'));
    document.getElementById('singlePlayerBtn').addEventListener('click', () => selectMode('single'));
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', restartRound);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function selectMode(mode) {
    gameMode = mode;
    modeSelection.classList.add('hidden');
    playerNames.classList.remove('hidden');
    
    if (mode === 'single') {
        document.getElementById('player2Name').placeholder = 'Computer (O)';
        document.getElementById('player2Name').disabled = true;
    }
}

function startGame() {
    player1Name = document.getElementById('player1Name').value || 'Player 1';
    
    if (gameMode === 'single') {
        player2Name = 'Computer';
    } else {
        player2Name = document.getElementById('player2Name').value || 'Player 2';
    }
    
    document.getElementById('player1NameDisplay').textContent = player1Name;
    document.getElementById('player2NameDisplay').textContent = player2Name;
    
    playerNames.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    gameActive = true;
    updateTurnDisplay();
}

function handleCellClick(e) {
    const cellIndex = parseInt(e.target.dataset.index);
    
    if (!gameActive || board[cellIndex] !== '') {
        return;
    }
    
    placeMarkOnBoard(cellIndex, currentPlayer);
    
    if (didSomeoneWin()) {
        endGame('win');
        return;
    }
    
    if (isBoardFull()) {
        endGame('draw');
        return;
    }
    
    switchPlayer();
    
    if (gameMode === 'single' && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMakeMove, 500);
    }
}

function placeMarkOnBoard(cellIndex, mark) {
    board[cellIndex] = mark;
    const cell = cells[cellIndex];
    cell.textContent = mark;
    cell.classList.add('taken', mark.toLowerCase());
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    updateTurnDisplay();
}

function updateTurnDisplay() {
    const playerName = (currentPlayer === 'X') ? player1Name : player2Name;
    document.getElementById('turnDisplay').textContent = `${playerName}'s Turn`;
}

function didSomeoneWin() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells(pattern);
            return true;
        }
    }
    return false;
}

function highlightWinningCells(pattern) {
    pattern.forEach(cellIndex => {
        cells[cellIndex].classList.add('winner');
    });
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function endGame(result) {
    gameActive = false;
    
    if (result === 'win') {
        const winnerName = (currentPlayer === 'X') ? player1Name : player2Name;
        document.getElementById('resultText').textContent = `${winnerName} Wins!`;
        
        if (currentPlayer === 'X') {
            scores.player1++;
            document.getElementById('player1Score').textContent = scores.player1;
        } else {
            scores.player2++;
            document.getElementById('player2Score').textContent = scores.player2;
        }
    } else {
        document.getElementById('resultText').textContent = "It's a Draw!";
        scores.draws++;
        document.getElementById('drawScore').textContent = scores.draws;
    }
    
    resultOverlay.classList.remove('hidden');
}

function restartRound() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winner');
    });
    
    updateTurnDisplay();
}

function nextRound() {
    resultOverlay.classList.add('hidden');
    restartRound();
}

function resetGame() {
    scores = { player1: 0, player2: 0, draws: 0 };
    document.getElementById('player1Score').textContent = '0';
    document.getElementById('player2Score').textContent = '0';
    document.getElementById('drawScore').textContent = '0';
    
    document.getElementById('player1Name').value = '';
    document.getElementById('player2Name').value = '';
    document.getElementById('player2Name').disabled = false;
    
    gameContainer.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    
    restartRound();
}

function computerMakeMove() {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }
    
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        placeMarkOnBoard(randomIndex, 'O');
        
        if (didSomeoneWin()) {
            endGame('win');
        } else if (isBoardFull()) {
            endGame('draw');
        } else {
            switchPlayer();
        }
    }
}

init();
