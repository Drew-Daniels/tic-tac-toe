//========================= GLOBALS =========================================

//========================== FACTORY FUNCTIONS & MODULES ===========================
const Player = (name, symbol, type) => {

    const getName = () => name;
    const getSymbol = () => symbol;
    const getType = () => type;
    const makeMove = (ri, ci) => {
        gameBoard.playerMove(symbol, ri, ci);
    }
    return {getName, getSymbol, getType, makeMove};
}

const gameBoard = (() => {
    let p1, p2;
    let p2TypeChoice, p1SymChoice;
    const RED_RGB = 'rgb(0, 255, 0)';
    const GRAY_RGB = 'rgb(240, 240, 240)';
    function sideBarSetup() {
        // Set up player 2 type (Human or AI)

        function activateColor(ele1, ele2, colOn=RED_RGB, colOff=GRAY_RGB) {
            ele1.style.backgroundColor = colOn;
            ele2.style.backgroundColor = colOff;
        }

        let player2TypeHuman = document.querySelector("#player2Human");
        let player2TypeAI = document.querySelector("#player2AI")
        player2TypeHuman.addEventListener('click', function() {
            p2TypeChoice = 'human';
            activateColor(player2TypeHuman, player2TypeAI)
        })
        player2TypeAI.addEventListener('click', function() {
            p2TypeChoice = 'ai';
            activateColor(player2TypeAI, player2TypeHuman)
        })
        // Set up player 1 symbol ('X' or 'O')
        let player1SymX = document.querySelector('#player1X');
        let player1SymO = document.querySelector('#player1O');
        player1SymX.addEventListener('click', function() {
            p1SymChoice = 'X';
            activateColor(player1SymX, player1SymO);
        })
        player1SymO.addEventListener('click', function() {
            p1SymChoice = 'O';
            activateColor(player1SymO, player1SymX);
        })
    }

    function getP1Sym() {
        return p1SymChoice;
    }

    function getP2Type() {
        return p2TypeChoice;
    }

    let gameArray = [
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
    let whoseTurn;

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

    function _switchTurns() {
        if (whoseTurn === 'X') {
            whoseTurn = 'O'
        } else {
            whoseTurn = 'X'
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
        _checkForTurnsSet(symbol);
        if (_isEmptyTile(ri, ci) && _isInRange(ri, ci) && _isTurn(sym)) {
            _updateArr(ri, ci);
            _drawMove(ri, ci);
            _switchTurns();
            res = _isAWin();
            if(res[0]) {
                winnerSym = res[1];
                p1Sym = p1.getSymbol();
                p2Sym = p2.getSymbol();
                if (p1Sym === winnerSym) {
                    console.log(p1.getName() + ' is the winner ');
                } else if (p2Sym === winnerSym) {
                    console.log(p2.getName() + ' is the winner ');
                }
            }
        }
    }

    function _updateArr(ri, ci) {
        gameArray[ri][ci][0] = symbol;
    }

    function _gameOverPopup() {
        // message saying who won
    }
    function _isATie() {
        //check if all tiles are not empty strings
    }

    function _isAWin() {
        let winSym;
        function checkRows() {
            for (let ri = 0; ri < gameArray.length; ri++) {
                if (
                    (gameArray[ri][0][0] === 
                    gameArray[ri][1][0]) &&
                    (gameArray[ri][1][0] ===
                    gameArray[ri][2][0]) &&

                    (gameArray[ri][0][0] !== '')
                    ) {
                        winSym = gameArray[ri][0][0];
                        return [true, winSym]
                } else return false;
            }
        }
        function checkCols() {
            for (let ci = 0; ci < gameArray.length; ci++) {
                if (
                    (gameArray[0][ci][0] === 
                    gameArray[1][ci][0]) &&
                    (gameArray[1][ci][0] ===
                    gameArray[2][ci][0]) &&
                    
                    (gameArray[0][ci][0] !== '')
                    ) {
                        winSym = gameArray[0][ci][0];
                        return [true, winSym]
                } else return false;
            }
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
            // Test 2 - Top Right to Bottom Left
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
        return [res, winSym];
    }

    function _drawMove(ri, ci) {
        thisTile(ri, ci).innerText = symbol;
    }

    const playerMove = (playerSymbol, ri, ci) => _updateBoard(playerSymbol, ri, ci);
    const getTurn = () => whoseTurn;
    return {
        playerMove,
        getTurn,
        sideBarSetup,
        buildTable,
        getP2Type,
        getP1Sym,
        startGame,
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

let player1Sym = gameBoard.getP1Sym();
let player2Type = gameBoard.getP2Type();

let player1 = Player('Player 1', 'X', 'human');
//add event listener to 'human' and 'ai' buttons
//startGame();

