# Tic-Tac-Toe game for The Odin Project

## Outline:
---
### The Gameboard:
gameBoard[0] = row1
gameBoard[0][0] = row1, col1

gameBoard = [
	[ ‘’,’’,’’],
	[ ‘’,’’,’’],
	[ ‘’,’’,’’]
]

gameBoard[1][1] = 'X'
=>
gameBoard = [
	[ ‘’,’’,’’],
	[ ‘’,’X’,’’],
	[ ‘’,’’,’’]
]

### The Players:
players = {
	player1: human();
	player2: human() || computer() _(based on user input)_
}