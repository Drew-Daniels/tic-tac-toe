function buildTable(arr) {
    let table = document.getElementById('gameTable');
    for (ri=0; ri < arr.length;ri++) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'rowDiv');
        rowDiv.setAttribute('id', 'r' + String(ri));
        table.appendChild(rowDiv);
        for (ci=0; ci < arr.length;ci++) {
            let colDiv = document.createElement('div');
            colDiv.setAttribute('class', 'tile');
            colDiv.setAttribute('id', 
                                'r' + String(ri) + 
                                'c' + String(ci));
            colDiv.innerHTML = arr[ri][ci];
            rowDiv.appendChild(colDiv);
        };
    };
    let tileNodes = document.getElementsByClassName('tile');
    let tiles = [...tileNodes];
    tiles.forEach((tile) => {
        tile.addEventListener('click', function () {
            let tileID = tile.getAttribute('id');
            let row = tileID.slice(1,2);
            let col = tileID.slice(3,4);
            // play1.makeMove(row, col);
        })
    })
};

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

buildTable(gameArray);

const Player = (symbol) => {

    const getSymbol = () => symbol;
    const makeMove = (ri, ci) => {
        gameBoard.playerMove(symbol, ri, ci);
    }
    return {getSymbol, makeMove};
}

const gameBoard = (() => {
    let symbol;
    let whoseTurn;

    const thisTile = function (ri, ci) {
        let tile = document.getElementById('r' + ri + 'c' + ci);
        return tile;
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
        _checkForTurnsSet(symbol);
        if (_isEmptyTile(ri, ci) && _isInRange(ri, ci) && _isTurn(sym)) {
            _updateArr(ri, ci);
            _drawMove(ri, ci);
            _switchTurns();
        }
    }

    function _updateArr(ri, ci) {
        gameArray[ri][ci][0] = symbol;
    }

    function _drawMove(ri, ci) {
        thisTile(ri, ci).innerText = symbol;
    }

    const playerMove = (playerSymbol, ri, ci) => _updateBoard(playerSymbol, ri, ci);
    return {
        playerMove,
    }
})();

function selfTest() {
    let play1 = Player('X');
    let play2 = Player('O');

    play1.makeMove(1,1);
    play2.makeMove(0,0);
    play1.makeMove(0,2);
    //play2.makeMove(0,3); //out of bounds!
    //play1.makeMove(); // no args passed
    //play2.makeMove(0,) // 1 arg passed
    play2.makeMove(1,2); // overwrite last move?
}

selfTest();