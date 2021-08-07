//========================= GLOBALS =========================================

//========================== FACTORY FUNCTIONS & MODULES ===========================
const Player = (name, symbol, type) => {

    let score = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const switchSymbol = () => {
        if (symbol === 'X') {
            symbol = 'O';
        } else symbol = 'X';
        return symbol;
    }
    const switchType = () => {
        if (type === 'human') {
            type = 'ai';
        } else type = 'human';
        return type;
    }
    const oppositeSymbol = () => {
        if (symbol === 'X') {
            oppSymbol = 'O';
        } else oppSymbol = 'X';
        return oppSymbol;
    };
    const getType = () => type;
    const getScore = () => score;
    const incrScore = () => score++;
    const makeMove = (ri, ci) => {
        gameBoard.playerMove(symbol, ri, ci);
    }
    const getInfo = () => [name, symbol, type, score];
    const calcMoveRandom = () => {
        let posMoves = [];
        let currArr = gameBoard.getCurrArray();
        for (let ri = 0; ri < 3; ri++) {
            for (let ci = 0; ci < 3; ci++) {
                let posCoord = currArr[ri][ci][0];
                if (posCoord === '') {
                    posMoves.push('r'+ String(ri) + 'c' + String(ci));
                }
            }
        }
        // select random from possible
        let randMove = posMoves[Math.floor(Math.random()*posMoves.length)];
        return randMove;
    };
    return {getName, getSymbol, switchSymbol, switchType, oppositeSymbol, getType, getScore, incrScore, makeMove, calcMoveRandom, getInfo};
}

const gameBoard = (() => {
    let p1, p2;
    let gameNumber = 0;
    const p2TypeChoice = () => p2.getType();
    const p1SymChoice = () => p1.getSymbol();
    const RED_RGB = 'rgb(0, 255, 0)';
    const GRAY_RGB = 'rgb(240, 240, 240)';
    const delayMS = 500;
    const displayMsgBox = document.querySelector('#displayMsgBox');

    function sideBarSetup() {
        function activateColor(ele1, ele2, colOn=RED_RGB, colOff=GRAY_RGB) {
            ele1.style.backgroundColor = colOn;
            ele2.style.backgroundColor = colOff;
        }
        // REFERENCES
        let player2TypeHuman = document.querySelector("#player2Human");
        let player2TypeAI = document.querySelector("#player2AI")
        let restartBtn = document.querySelector('#restartBtn');
        // DEFAULTS
        activateColor(player2TypeAI, player2TypeHuman);

        // LISTENERS
        // Set up player 2 type (Human or AI)
        player2TypeHuman.addEventListener('click', function() {
            p2.switchType();
            activateColor(player2TypeHuman, player2TypeAI)
        })
        player2TypeAI.addEventListener('click', function() {
            p2.switchType();
            activateColor(player2TypeAI, player2TypeHuman)
        })
        restartBtn.addEventListener('click', restartMatch)
    }

    function restartMatch() {
        history.go(0);
    }

    const BLANK_BOARD = [
        [
            [''], [''], ['']
        ],
        [
            [''], [''], [''] 
        ],
        [
            [''], [''], [''] 
        ] 
    ];
    // cannot use ...spread operator here otherwise would only be shallow cp
    let gameArray = JSON.parse(JSON.stringify(BLANK_BOARD));
    
    function buildTable() {
        let arr = gameArray;
        let table = document.getElementById('gameTable');
        for (ri=0; ri < arr.length;ri++) {
            let rowDiv = createRow(table, ri);
            for (ci=0; ci < arr.length;ci++) {
                createTile(rowDiv, ri, ci, arr);
            };
        };
        let tileNodes = document.getElementsByClassName('tile');
        let tiles = [...tileNodes];
        let row;
        tiles.forEach((tile) => {
            row = parseInt(tile.getAttribute('id').slice(1,2));
            col = parseInt(tile.getAttribute('id').slice(3,4));
            // set row borders
            switch (true) {
                case (row === 0): {
                    addToAttr(tile, 'class', 'tile-top')
                    break;
                }
                case (row === 1): {
                    addToAttr(tile, 'class', 'tile-top tile-bottom')
                    break;
                }
                case (row === 2): {
                    addToAttr(tile, 'class', 'tile-bottom')
                    break;
                }
            }
            // set col borders
            switch (true) {
                case (col === 0): {
                    addToAttr(tile, 'class', 'tile-left')
                    break;
                }
                case (col === 1): {
                    addToAttr(tile, 'class', 'tile-left tile-right')
                    break;
                }
                case (col === 2): {
                    addToAttr(tile, 'class', 'tile-right')
                    break;
                }
            }
            tile.addEventListener('click', function () {
                let tileID = tile.getAttribute('id');
                let row = tileID.slice(1,2);
                let col = tileID.slice(3,4);
                gameBoard.playerMove(gameBoard.getTurn(), row, col);
            })
        })
    };
    
    function addToAttr(ele, attr, strToAdd) {
        let oldAttr = ele.getAttribute(attr);
        ele.setAttribute(attr, oldAttr + ' ' + strToAdd);
    }
    
    function createRow(parent, ri) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'rowDiv');
        rowDiv.setAttribute('id', 'r' + String(ri));
        parent.appendChild(rowDiv);
        return rowDiv;
    }
    
    function createTile(parent, ri, ci, arr) {
        let colDiv = document.createElement('div');
        colDiv.setAttribute('class', 'tile');
        colDiv.setAttribute('id', 
                            'r' + String(ri) + 
                            'c' + String(ci));
        colDiv.innerHTML = arr[ri][ci];
        parent.appendChild(colDiv);
        return colDiv;
    }

    let symbol;
    let whoseTurn = 'X';

    const thisTile = function (ri, ci) {
        let tile = document.getElementById('r' + ri + 'c' + ci);
        return tile;
    }

    function startGame(player1, player2) {
        [p1, p2] = [player1, player2];
    }

    function _isTurn(sym) {
        let ans = (whoseTurn === sym) ? true: false;
        return ans;
    }

    function _checkForTurnsSet(sym) {
        if ((!!!whoseTurn)) {
            whoseTurn = sym;
        }
    }

    function _aiMakeMove(symToCheck) {
        if (p2.getSymbol() === symToCheck && p2.getType() === 'ai') {
            let move = p2.calcMoveRandom();
            if (!!move) {
                let moveRow = parseInt(move.slice(1,2));
                let moveCol = parseInt(move.slice(3,4));
                p2.makeMove(moveRow, moveCol);
            }
        }
    }

    function _switchTurns() {
        if (whoseTurn === 'X') {
            whoseTurn = 'O'
            _aiMakeMove('O');
        } else {
            whoseTurn = 'X'
            _aiMakeMove('O');
        }
    }

    function _isInRange(ri, ci) {
        let max_range = gameArray.length-1;
        let upper_bound_compliant = (ri <= max_range && ci <= max_range) ? true: false;
        let lower_bound_compliant = (ri >= 0 && ci >= 0) ? true: false;
        let ans = (upper_bound_compliant && lower_bound_compliant) ? true: false;
        return ans;
    }

    function _isEmptyTile(ri, ci) {
        let res = ((gameArray[ri][ci][0] === "") ? true: false);
        return res;
    }

    function _updateBoard(sym, ri, ci) {
        symbol = sym;
        let winnerSym;
        let res;
        let winCheck, tieCheck;
        _checkForTurnsSet(symbol);
        if (_isEmptyTile(ri, ci) && _isInRange(ri, ci) && _isTurn(sym)) {
            _updateArr(ri, ci);
            _drawMove(ri, ci);
            _switchTurns();
            //add wait
            winCheck = _isAWin();
            tieCheck = _isATie();
            if (winCheck[0]) {
                // delay clearing the board after win
                res = winCheck;
                winnerSym = res[2];
                p1Sym = p1.getSymbol();
                p2Sym = p2.getSymbol();
                if (p1Sym === winnerSym) {
                    p1.incrScore();
                    _updateDisplayMsg(_winMsg(p1.getName(), 
                                        String(++gameNumber)));
                } else if (p2Sym === winnerSym) {
                    p2.incrScore();
                    _updateDisplayMsg(_winMsg(p2.getName(), 
                                        String(++gameNumber)));
                }
                _updateScoreBoard();
                _clearBoard();
            // delay clearing the board after a tie
            } else if (tieCheck[0]) {
                _updateDisplayMsg(_tieMsg(String(++gameNumber)));
                _clearBoard();
            }
        }
    }

    function _updateArr(ri, ci) {
        gameArray[ri][ci][0] = symbol;
    }

    function _updateDisplayMsg(msg) {
        displayMsgBox.innerText = msg;
    }

    const _tieMsg = (gameNum) => `${gameNum} is a tie!`;
    const _winMsg = (winner, gameNum) => `${winner} won game number ${gameNum}`;
    
    function _isATie() {
        for (let ri = 0; ri < 3; ri++) {
            for (let ci = 0; ci < 3; ci++) {
                if (gameArray[ri][ci][0] === '') {
                    return false;
                }
            }
        }
        return [true, 'tie'];
    }

    function _isAWin() {
        let winSym;
        function checkRows() {
            for (let ri = 0; ri < 3; ri++) {
                if (
                    (gameArray[ri][0][0] === 
                    gameArray[ri][1][0]) &&
                    (gameArray[ri][1][0] ===
                    gameArray[ri][2][0]) &&

                    (gameArray[ri][0][0] !== '')
                    ) {
                        winSym = gameArray[ri][0][0];
                        return [true, winSym]
                }
            }
            return false;
        }
        function checkCols() {
            for (let ci = 0; ci < 3; ci++) {
                if (
                    (gameArray[0][ci][0] === 
                    gameArray[1][ci][0]) &&
                    (gameArray[1][ci][0] ===
                    gameArray[2][ci][0]) &&
                    
                    (gameArray[0][ci][0] !== '')
                    ) {
                        winSym = gameArray[0][ci][0];
                        return [true, winSym]
                }
            }
            return false;
        }
        function checkDiags() {
            if (
                (gameArray[0][0][0] ===
                 gameArray[1][1][0]) &&
                 (gameArray[1][1][0] ===
                 gameArray[2][2][0]) &&
                 (gameArray[0][0][0] !== '')
            ) {
                winSym = gameArray[0][0][0];
                return [true, winSym];
            }
            else if (
                (gameArray[0][2][0] ===
                 gameArray[1][1][0]) &&
                (gameArray[1][1][0] ===
                 gameArray[2][0][0]) &&

                (gameArray[0][2][0] !== '')
            ) {
                winSym = gameArray[0][2][0];
                return [true, winSym];
            }
            else return false;
        }
        let res = (checkRows() || checkCols() || checkDiags()) ? true: false;
        return [res, 'win', winSym];
    }

    function _updateScoreBoard() {
        const p1ScoreNum = document.querySelector('#player1ScoreNum');
        const p2ScoreNum = document.querySelector('#player2ScoreNum');
        p1ScoreNum.innerText = p1.getScore();
        p2ScoreNum.innerText = p2.getScore();
    }

    function _clearBoard() {
        gameArray = JSON.parse(JSON.stringify(BLANK_BOARD));
        for (let ri=0; ri < 3; ri++) {
            for (let ci=0; ci < 3; ci++) {
                _clearTile(ri, ci);
            }
        }
    }

    function _drawMove(ri, ci) {
        thisTile(ri, ci).innerText = symbol;
    }

    function _clearTile(ri, ci) {
        thisTile(ri, ci).innerText = '';
    }

    function getCurrArray() {
        return gameArray;
    }

    const playerMove = (playerSymbol, ri, ci) => _updateBoard(playerSymbol, ri, ci);
    const getTurn = () => whoseTurn;
    return {
        playerMove,
        getTurn,
        sideBarSetup,
        buildTable,
        startGame,
        getCurrArray,
    }
})();

//================================ SELF-TEST CODE ===============================
function selfTest() {
    gameBoard.buildTable();
    

    let play1 = Player('Player 1','X', 'human');
    let play2 = Player('Player 2','O', 'ai');

    gameBoard.startGame(play1, play2);

    play1.makeMove(1,1);
    play2.makeMove(0,0);
    play1.makeMove(0,2);
    //play2.makeMove(0,3); //out of bounds!
    //play1.makeMove(); // no args passed
    //play2.makeMove(0,) // 1 arg passed
    //play2.makeMove(1,2); // overwrite last move?
}

//selfTest();

//============================== INITIALIZATION CODE ===============================

gameBoard.buildTable();
gameBoard.sideBarSetup();

let player1 = Player('Player 1', 'X', 'human');
let player2 = Player('Player 2', 'O', 'ai');

gameBoard.startGame(player1, player2);

