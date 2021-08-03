function buildTable() {
    let table = document.getElementById('gameTable');
    for (ri=1; ri < 4;ri++) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'rowDiv');
        rowDiv.setAttribute('id', 'row-' + String(ri));
        table.appendChild(rowDiv);
        for (ci=1; ci < 4;ci++) {
            let colDiv = document.createElement('div');
            colDiv.setAttribute('class', 'tile');
            colDiv.setAttribute('id', 'tile-' + 
                                'r' + String(ri) + 
                                'c' + String(ci));
            colDiv.innerHTML = '';
            rowDiv.appendChild(colDiv);
        };
    };
};

let gameArray = [];

buildTable();