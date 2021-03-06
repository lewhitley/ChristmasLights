class Board {
  constructor(game, botCtx, midCtx, hoverCtx, topCtx) {
    this.botCtx = botCtx;
    this.midCtx = midCtx;
    this.hoverCtx = hoverCtx;
    this.topCtx = topCtx;
    this.game = game;
    this.timeElapsed = 0;

    this.audio = document.getElementById('audio');

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
    setInterval(() => {
      this.game.drawBackground(this.botCtx);
    }, 33);
  }

  animate(time) {
    this.game.draw();
    if (time < 2000 ) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  timer() {
    document.getElementById('timer').innerHTML = 'Time: 0';
    this.timerIntervalId = setInterval(() => {
      this.timeElapsed += 1;
      document.getElementById('timer').innerHTML = 'Time: '+this.timeElapsed;
    }, 1000);
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
