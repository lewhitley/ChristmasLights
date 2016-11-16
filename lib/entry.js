const Game = require("./game");
const Board = require("./board");

document.addEventListener("DOMContentLoaded", function(){
  const botCanvas = document.getElementById("bottom-canvas");
  botCanvas.width = Game.DIM_X;
  botCanvas.height = Game.DIM_Y;

  const midCanvas = document.getElementById("yellow-canvas");
  midCanvas.width = Game.DIM_X;
  midCanvas.height = Game.DIM_Y;

  const topCanvas = document.getElementById("black-canvas");
  topCanvas.width = Game.DIM_X;
  topCanvas.height = Game.DIM_Y;

  const canvasLeft = botCanvas.offsetLeft;
  const canvasTop = botCanvas.offsetTop;

  const botCtx = botCanvas.getContext("2d");
  const midCtx = midCanvas.getContext("2d");
  const topCtx = topCanvas.getContext("2d");
  
  const game = new Game({left: canvasLeft, top: canvasTop,
    botCanvas: botCanvas, midCanvas: midCanvas, topCanvas: topCanvas});
  new Board(game, botCtx, midCtx, topCtx).start();
});
