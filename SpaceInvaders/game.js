//board
let tileSize=32;
let rows=16;
let colums=16;

let board;
let boardWidth=tileSize * columns; // 32*16
let boardHeight=tileSize * rows; //32*16
let context;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContent("2d"); //used for drawing on the board
}