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

  let game = new Game({left: canvasLeft, top: canvasTop,
    topCanvas: topCanvas, midCtx: midCtx, topCtx: topCtx});
  new Board(game, botCtx, midCtx, topCtx).start();

  let aboutModal = document.getElementById('about-modal');
  let about = document.getElementById('about');
  about.onclick = () => {
    aboutModal.style.display = "block";
  };

  let span = document.getElementsByClassName("about-close")[0];
  span.onclick = (e) => {
    e.stopPropagation();
    aboutModal.style.display = "none";
  };
});
