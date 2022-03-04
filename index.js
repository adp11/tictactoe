const X = 'X';
const O = 'O';
const EMPTY = '';


const GameFlow = (() => {
    let turnCount = 0;

    const setTurnCount = (number) => {
        turnCount = number;
    }

    const whoseTurn = (p1, p2) => {
        console.log(p1.getSymbol());
        console.log(turnCount);
        if (turnCount%2 == 0) {
            turnCount++;
            return p1;
        } else {
            turnCount++;
            return p2;
        }
    }

    const makePlay = (event, p1, p2, board, displayController) => {
        const cells = document.querySelectorAll(`.game-board>div`);
        const position = Array.prototype.indexOf.call(cells, event.target); // index-based, not DOM-based
        const currentPlayer = whoseTurn(p1, p2);
        currentPlayer.add_mark(position);
        board.updateBoard(currentPlayer, position);
        const winner = board.winnerFound();
        if (winner) {
            displayController.printWinner(p1, winner);
            board.disable();
        } else {
            if (board.isFull()) {
                displayController.printWinner(p1);
                board.disable();
            }
        }
    }
    return {whoseTurn, makePlay, setTurnCount};
})();

const displayController = (() => {
    const printWinner = (p, winner="") => {
        const resultDisplay = document.querySelector(".display>.result-display");
        if (winner) {
            resultDisplay.textContent = (p.getSymbol() === winner) ? `${nameP1} won!` : `${nameP2} won!`;
        } else {
            resultDisplay.textContent = "It's a Draw!";
        }
    }

    const renderInitialBoard = () => {
        const cells = document.querySelectorAll(".game-board>div");
        for (let i=0;i<cells.length;i++) {
            cells[i].textContent = "";
        }
    }

    const emptyDisplayResult = () => {
        const resultDisplay = document.querySelector(".display>.result-display");
        resultDisplay.textContent = "";
    }

    return {printWinner, renderInitialBoard, emptyDisplayResult};
})();

const GameBoard = (() => {
    const state = [[EMPTY, EMPTY, EMPTY],
                   [EMPTY, EMPTY, EMPTY],
                   [EMPTY, EMPTY, EMPTY]];


    const isFull = () => {
        for (let row of state) {
            if (row.includes(EMPTY)) {
                return false
            }
        }
        return true;
    }

    const winnerFound = () => {
        // check for win-by-row
        for (let i=0; i<state.length;i++) {
            if ((state[i][0] === state[i][1]) && (state[i][1] === state[i][2]) && state[i][0] != EMPTY) {
                return (state[i][0] == X) ? X : O;
            }
        }

        // check for win-by-column
        for (let i=0; i<state.length;i++) {
            if ((state[0][i] === state[1][i]) && (state[1][i] === state[2][i]) && state[0][i] != EMPTY) {
                return (state[0][i] == X) ? X : O;
            }
        }

        // check for win by diagnols
        if ((state[0][0] === state[1][1]) && (state[1][1] === state[2][2]) && state[0][0] != EMPTY) {
            return (state[0][0] == X) ? X : O;
        }

        if ((state[2][0] === state[1][1]) && (state[1][1] === state[0][2]) && state[2][0] != EMPTY) {
            return (state[2][0] == X) ? X : O;
        }
        return false;
    };

    const disable = () => {
        const gameboard = document.querySelector(".game-board");
        gameboard.classList.add("disabled");
        endGame();
        
    }

    const updateBoard = (player, position) => {
        let row = parseInt(position/3);
        let col = parseInt(position%3);
        state[row][col] = player.getSymbol();
    }


    const {renderInitialBoard, emptyDisplayResult} = displayController;
    const restart = () => {
        for (let row=0;row<state.length;row++) {
            for (let col=0;col<state.length;col++) {
                state[row][col] = EMPTY;
            }
        }
        const gameboard = document.querySelector(".game-board");
        gameboard.classList.remove("disabled");
        renderInitialBoard();
        emptyDisplayResult();
        startGame();
    }

    return {disable, updateBoard, winnerFound, isFull, restart};
})();


const Player = (symbol) => {
    const add_mark = (position) => {
        const element = document.querySelector(`.game-board>div:nth-of-type(${position+1})`);
        if (element.textContent == EMPTY) {
            element.textContent = symbol;
        }
    };

    const getSymbol = () => symbol;
    return {getSymbol, add_mark}
};



// GLOBAL CODE BELOW
function helper(event) {
    GameFlow.makePlay(event, p1, p2, GameBoard, displayController);
}

function startGame() {
    const players = document.querySelectorAll(".player-1, .player-2");
    players[0].textContent = `Player 1 (${nameP1}): X`;
    players[1].textContent = `Player 2 (${nameP2}): O`;
    
    const cells = document.querySelectorAll(".game-board > div");
    for (let i=0; i<cells.length;i++) {
        cells[i].addEventListener("click", helper); // need helper function because couldn't use removeEventListener otherwise
    }
}

function endGame() {
    const cells = document.querySelectorAll(".game-board > div");
    for (let i=0; i<cells.length;i++) {
        cells[i].removeEventListener("click", helper); // need helper function because couldn't use removeEventListener otherwise
    }
}

const p1 = Player(X);
const p2 = Player(O);
const nameP1 = prompt("Player 1's name?");
const nameP2 = prompt("Player 2's name?")
startGame();

const restartButton = document.querySelector(".buttons>.restart-button");
restartButton.addEventListener("click", () => {
    GameFlow.setTurnCount(0);
    GameBoard.restart();
});
