const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const activeGameSessions = [];

app.post('/startGame', (req, res) => {
    const gameId = req.query.gameId;
    const existingGame = activeGameSessions.find(session => session.id === gameId);

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
    const { index } = req.body;
    const gameSession = activeGameSessions.find(session => session.id === gameId);

    if (!gameSession) {
        res.status(404).json({ error: 'Game not found.' });
    } else if (!gameSession.isGameActive) {
        res.status(400).json({ error: 'Game has ended.' });
    } else {
        // Your existing move validation and handling logic will go here

        res.json({ board: gameSession.board, currentPlayer: gameSession.currentPlayer });
    }
});

app.post('/endGame/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const gameSession = activeGameSessions.find(session => session.id === gameId);

    if (!gameSession) {
        res.status(404).json({ error: 'Game not found.' });
    } else {
        // Announce the winner and mark the game as inactive
        // You can integrate this logic with your existing announce function
        gameSession.isGameActive = false;

        // Retrieve past games with helpful information
        const pastGames = activeGameSessions.map(session => ({
            id: session.id,
            winner: /* logic to determine the winner */,
            playerNames: /* logic to get player names */,
            moves: /* array of past moves */,
        }));

        res.json({ pastGames });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
