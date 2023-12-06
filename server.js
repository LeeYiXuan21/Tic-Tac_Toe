const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let pastGames = [];
const activeGameSessions = [];

// Function to find a game session by ID
const findGameSessionById = (gameId) => {
    return activeGameSessions.find(session => session.id === gameId);
};

// Function to announce the winner and end the game
const endGame = (gameSession) => {
    // Your existing logic to determine the winner and announce goes here
    // For simplicity, let's assume a function announceWinner exists

    const winner = announceWinner(gameSession.board);
    gameSession.isGameActive = false;

    return winner;
};

app.post('/startGame', (req, res) => {
    const gameId = req.query.gameId;
    const existingGame = findGameSessionById(gameId);

    if (existingGame) {
        res.status(400).json({ error: 'Game ID already in use.' });
    } else {
        const newGameSession = {
            id: gameId,
            board: ['', '', '', '', '', '', '', '', ''],
            currentPlayer: 'X',
            players: {},
            isGameActive: true,
        };

        activeGameSessions.push(newGameSession);

        res.json({ gameId });
    }
});

app.post('/makeMove/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const gameSession = findGameSessionById(gameId);

    if (!gameSession) {
        res.status(404).json({ error: 'Game not found.' });
    } else if (!gameSession.isGameActive) {
        res.status(400).json({ error: 'Game has ended.' });
    } else {
        const { index, playerName } = req.body;

        // Validate the move and update the board
        if (gameSession.board[index] === '') {
            gameSession.board[index] = gameSession.currentPlayer;
            gameSession.players[gameSession.currentPlayer] = playerName;

            // Check for a winner or a tie
            const winner = endGame(gameSession);

            // Switch player for the next turn
            gameSession.currentPlayer = gameSession.currentPlayer === 'X' ? 'O' : 'X';

            // Respond with the updated game state
            res.json({ board: gameSession.board, currentPlayer: gameSession.currentPlayer, winner });
        } else {
            res.status(400).json({ error: 'Invalid move.' });
        }
    }
});

// Endpoint to save a game
app.post('/saveGame', (req, res) => {
    const { gameId, winner, playerNames, moves } = req.body;

    const savedGame = {
        id: gameId,
        winner,
        playerNames,
        moves,
    };

    pastGames.push(savedGame);

    res.json({ success: true });
});


// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));


app.get('/getPastGames', (req, res) => {
    // Retrieve past games with helpful information
    const pastGames = activeGameSessions.map(session => ({
        id: session.id,
        winner: endGame(session),
        playerNames: Object.values(session.players),
        moves: session.board,
    }));

    res.json({ pastGames });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

