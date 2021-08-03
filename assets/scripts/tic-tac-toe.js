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
    const thisTile = function (ri, ci) {
        let tile = document.getElementById('r' + ri + 'c' + ci);
        return document.getElementById('r' + ri + 'c' + ci);
    }
    function _isInRange(ri, ci) {
        let max_range = gameArray.length-1;
        console.log(max_range);
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
        if (_isEmptyTile(ri, ci) && _isInRange(ri, ci)) {
            _updateArr(ri, ci);
            _drawMove(ri, ci);
        }
    }

    function _updateArr(ri, ci) {
        gameArray[ri][ci][0] = symbol;
    }

    function _drawMove(ri, ci) {
        thisTile(ri, ci).innerHTML = symbol;
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
    play2.makeMove(1,1); // overwrite last move?
}

//selfTest();