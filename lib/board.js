class Board {
  constructor(game, botCtx, midCtx, topCtx) {
    this.botCtx = botCtx;
    this.midCtx = midCtx;
    this.topCtx = topCtx;
    this.game = game;
  }

  start() {
    this.lastTime = 0;
    this.game.drawBackground(this.botCtx);
    requestAnimationFrame(this.tree.bind(this));
    requestAnimationFrame(this.animate.bind(this));
  }

  tree(time) {
    this.game.drawBackground(this.botCtx);
    if (time < 1000 ) {
      requestAnimationFrame(this.tree.bind(this));
    }
  }

  animate(time) {
    this.game.draw();
    if (time < 1200 ) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

module.exports = Board;
