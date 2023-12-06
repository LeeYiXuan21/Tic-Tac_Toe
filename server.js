const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let pastGames = [];
const activeGameSessions = [];

// Function to generate a unique game ID
const generateUniqueGameId = () => {
    return `Game_${Math.floor(Math.random() * 1000)}`;
};

// Function to find a game session by ID
const findGameSessionById = (gameId) => {
    return activeGameSessions.find(session => session.id === gameId);
};

// Function to announce the winner and end the game
const announceWinner = (board) => {
    // Your existing logic to determine the winner goes here
    // For simplicity, let's assume a function announceWinner exists

    // Placeholder logic:
    const winner = 'X'; // Replace with actual winner determination logic

    return winner;
};

app.post('/startGame', (req, res) => {
    // Generate a unique game ID
    const gameId = generateUniqueGameId();

    // Check if the game ID is already in use
    const existingGame = findGameSessionById(gameId);
    if (existingGame) {
        res.status(400).json({ error: 'Game ID already in use.' });
    } else {
        // Create a new game session
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
            const winner = announceWinner(gameSession.board);

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
    const pastGamesData = activeGameSessions.map(session => ({
        id: session.id,
        winner: announceWinner(session.board),
        playerNames: Object.values(session.players),
        moves: session.board,
    }));

    res.json({ pastGames: pastGames.concat(pastGamesData) });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
