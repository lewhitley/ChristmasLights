class Board {
  constructor(game, botCtx, midCtx, topCtx) {
    this.botCtx = botCtx;
    this.midCtx = midCtx;
    this.topCtx = topCtx;
    this.game = game;
    this.timeElapsed = 0;

    this.audio = document.getElementById('audio');

    document.getElementById('reset').addEventListener('click', () => {
      this.reset();
    });

    document.getElementById('new-game').addEventListener('click', () => {
      this.newGame();
    });

    document.getElementById('music').addEventListener('click', () => {
      this.toggleMusic();
    });
  }

  start() {
    this.audio.play();
    this.lastTime = 0;
    this.game.drawBackground(this.botCtx);
    requestAnimationFrame(this.tree.bind(this));
    requestAnimationFrame(this.animate.bind(this));
    this.timer();
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

  timer() {
    document.getElementById('timer').innerHTML = 'Time: 0';
    setInterval(() => {
      this.timeElapsed += 1;
      document.getElementById('timer').innerHTML = 'Time: '+this.timeElapsed;
    }, 1000);
  }

  reset() {

  }

  newGame() {
    location.reload();
  }

  toggleMusic() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }
}

module.exports = Board;
