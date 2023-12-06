window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const startButton = document.getElementById('start');
    const gameIdInput = document.getElementById('gameId');
    const getPastGamesButton = document.getElementById('getPastGames');
    const pastGamesContainer = document.getElementById('pastGames');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let playerXName = '';
    let playerOName = '';
    let gameId = '';

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const saveGame = async (gameData) => {
        try {
            const response = await fetch('/saveGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Game saved successfully');
            } else {
                console.error('Failed to save game');
            }
        } catch (error) {
            console.error('Error saving game:', error);
        }
    };

    const startNewGame = async () => {
        playerXName = playerXNameInput.value;
        playerOName = playerONameInput.value;

        // Fetch or generate a game ID
        // Replace the following line with your logic to get or generate a game ID
        gameId = ''; // Replace this with your logic

        // Save initial game state
        const initialGameData = {
            id: gameId,
            playerNames: [playerXName, playerOName],
            moves: [],
            winner: null,
        };

        await saveGame(initialGameData);

        // Initialize the game state
        resetBoard();
        gameIdInput.value = gameId;
    };

    startButton.addEventListener('click', startNewGame);

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            announce(TIE);
            isGameActive = false;
        }
    }

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }

        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    };

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    };

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = `Player ${playerOName} (O) Won`;
                break;
            case PLAYERX_WON:
                announcer.innerHTML = `Player ${playerXName} (X) Won`;
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        an

