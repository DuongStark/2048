var board;
var score = 0;
var highScore = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    loadState();
    setGame();
    document.getElementById("board-container").appendChild(document.getElementById("board"));

    document.getElementById("restartButton").addEventListener('click', function() {
        restartGame();
    });
}

function restartGame() {
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = '';

    score = 0;
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    localStorage.removeItem('score');
    localStorage.removeItem('board');

    setGame();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setGame() {
    if (!board) {
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    document.getElementById("score").innerText = score;
    document.getElementById("highScore").innerText = highScore;

    if (isBoardEmpty()) {
        setTwo();
        setTwo();
    }
}

function isBoardEmpty() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] !== 0) {
                return false;
            }
        }
    }
    return true;
}

function saveState() {
    localStorage.setItem('score', score);
    localStorage.setItem('highScore', highScore);
    localStorage.setItem('board', JSON.stringify(board));
}

function loadState() {
    let savedScore = localStorage.getItem('score');
    let savedHighScore = localStorage.getItem('highScore');

    if (savedScore) {
        score = parseInt(savedScore);
    }

    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
        document.getElementById("highScore").innerText = highScore;
    }

    let savedBoard = localStorage.getItem('board');

    if (savedBoard) {
        board = JSON.parse(savedBoard);
    } else {
        board = Array(rows).fill().map(() => Array(columns).fill(0));
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; 
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false;
    if (e.code == "ArrowLeft") {
        moved = slideLeft();
    }
    else if (e.code == "ArrowRight") {
        moved = slideRight();
    }
    else if (e.code == "ArrowUp") {
        moved = slideUp();
    }
    else if (e.code == "ArrowDown") {
        moved = slideDown();
    }

    if (moved) {
        setTwo();
        document.getElementById("score").innerText = score;
        document.getElementById("highScore").innerText = highScore; // Update high score display

        if (isGameOver()) {
            showGameOverScreen();
        } else {
            saveState();
        }
    }
})

function filterZero(row) {
    return row.filter(num => num != 0); 
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];

            
            if (score > highScore) {
                highScore = score;
            }

            
            if (row[i] == 2048) {
                showYouWinScreen();
            }
        }
    } 
    row = filterZero(row); 
    while (row.length < columns) {
        row.push(0);
    } 
    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row = slide(row);
        board[r] = row;
        if (JSON.stringify(row) !== JSON.stringify(originalRow)) {
            moved = true;
        }
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        if (JSON.stringify(row) !== JSON.stringify(originalRow)) {
            moved = true;
        }
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = [...row];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (JSON.stringify(row) !== JSON.stringify(originalRow)) {
            moved = true;
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = [...row];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (JSON.stringify(row) !== JSON.stringify(originalRow)) {
            moved = true;
        }
    }
    return moved;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function showYouWinScreen() {
    let winScreen = document.createElement("div");
    winScreen.id = "win-screen";
    winScreen.classList.add("win-screen");

    let winMessage = document.createElement("div");
    winMessage.innerText = "You Win!";
    winMessage.classList.add("win-message");

    let continueButton = document.createElement("button");
    continueButton.innerText = "Continue";
    continueButton.classList.add("continue-button");
    continueButton.addEventListener('click', function() {
        winScreen.remove();
        document.getElementById("board-container").classList.remove("board-blur");
    });

    winScreen.appendChild(winMessage);
    winScreen.appendChild(continueButton);
    document.body.appendChild(winScreen);

    document.getElementById("board-container").classList.add("board-blur");

    
    setTimeout(() => {
        winScreen.style.opacity = "1";
    }, 100);
}

function isGameOver() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return false;
            }
            if (r > 0 && board[r][c] == board[r - 1][c]) {
                return false;
            }
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
                return false;
            }
            if (c > 0 && board[r][c] == board[r][c - 1]) {
                return false;
            }
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return false;
            }
        }
    }
    return true;
}

function showGameOverScreen() {
    let gameOverScreen = document.createElement("div");
    gameOverScreen.id = "game-over";
    gameOverScreen.innerText = "Game Over";

    let restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.id = "restartButton";
    restartButton.addEventListener('click', function() {
        gameOverScreen.remove();
        restartGame();
        document.getElementById("board-container").classList.remove("board-blur");
    });

    gameOverScreen.appendChild(restartButton);
    document.getElementById("board-container").appendChild(gameOverScreen);


    setTimeout(() => {
        gameOverScreen.style.opacity = "1"; 
    }, 100);
}
