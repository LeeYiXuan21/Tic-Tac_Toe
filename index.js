window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const gameIdInput = document.getElementById('gameId');
    const getPastGamesButton = document.getElementById('getPastGames');
    const pastGamesContainer = document.getElementById('pastGames');
    const startGameButton = document.getElementById('startGame'); // New button

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let playerXName = '';
    let playerOName = '';

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

    const PLAYERO_WON = 'PLAYERO_WON';
    const PLAYERX_WON = 'PLAYERX_WON';
    const TIE = 'TIE';

    const startNewGame = () => {
        playerXName = playerXNameInput.value || 'Player X';
        playerOName = playerONameInput.value || 'Player O';
    
        if (playerXName && playerOName) {
            // Initialize the game with player names
            gameIdInput.value = 'Game123'; // Replace with actual game ID
            currentPlayer = 'X'; // Set initial player
            playerDisplay.innerText = `${playerXName}`;
            startGameButton.disabled = true; // Disable the button after starting the game
        } else {
            alert('Please enter names for both players.');
        }
    };
    

    // Event listener for the "Start Game" button
    startGameButton.addEventListener('click', startNewGame);

    function handleResultValidation() {
        let roundWon = false;

        // Check winning conditions
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

        // Check for a tie
        if (!roundWon && !board.includes('')) {
            announce(TIE);
            isGameActive = false;
            return;
        }

        // Check if a player has won
        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }
    }

    // Function to announce the result
    const announce = (type) => {
        let winnerName = type === PLAYERX_WON ? playerXName : (type === PLAYERO_WON ? playerOName : '');

        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = `Player <span class="playerO">${winnerName}</span> Won`;
                break;
            case PLAYERX_WON:
                announcer.innerHTML = `Player <span class="playerX">${winnerName}</span> Won`;
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        const playerName = currentPlayer === 'X' ? playerXName : playerOName;
        playerDisplay.innerText = `${playerName}`;
        playerDisplay.classList.remove('playerX', 'playerO');
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

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }
        return true;
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    };

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);

    getPastGamesButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/getPastGames', { method: 'GET' });
            const data = await response.json();

            // Clear previous past games
            pastGamesContainer.innerHTML = '';

            if (data.pastGames.length > 0) {
                // Display past games
                data.pastGames.forEach(game => {
                    const gameInfo = document.createElement('div');
                    gameInfo.innerHTML = `
                        <p>Game ID: ${game.id}</p>
                        <p>Winner: ${game.winner || 'Tie'}</p>
                        <p>Players: ${game.playerNames.join(' vs ')}</p>
                        <p>Moves: ${game.moves.join(', ')}</p>
                        <hr>
                    `;
                    pastGamesContainer.appendChild(gameInfo);
                });
            } else {
                pastGamesContainer.innerHTML = '<p>No past games available.</p>';
            }
        } catch (error) {
            console.error('Error retrieving past games:', error);
        }
    });
});



