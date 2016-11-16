const Wire = require('./wire');
const Bulb = require('./bulb');
const Elec = require('./elec');

class Game {
  constructor(options){
    this.grid = [[], [], [], [], [], [], [], [], [], []];
    this.null = new Elec({lit: false, orientation: null, pos:null});
    this.base = new Elec({lit: true, orientation: null, pos:[9,8], type: 'electric'});
    this.left = options.left;
    this.top = options.top;
    this.midCanvas = options.midCanvas;
    this.topCanvas = options.topCanvas;
    this.setup();
    // this.addEventListeners();
  }

  draw(midCtx, topCtx) {
    this.grid.forEach( row => {
      row.forEach( light => {
        if ( light.lit ){
          light.drawLight(midCtx);
        } else if (light.pos){
          light.drawDark(topCtx);
        }
      });
    });
  }

  setup(){
    this.grid[0] = [this.null, this.null, this.null, this.null, this.null, this.null, this.null,
      new Bulb({pos:[0,7]}), new Bulb({pos:[0,8]}), new Bulb({pos:[0,9]}),
      this.null, this.null, this.null, this.null, this.null, this.null, this.null];

    this.grid[1] = [this.null, this.null, this.null, this.null, this.null,
      this.null, new Bulb({pos:[1,6]}), new Wire({shape: 3, pos:[1,7]}),
      new Wire({shape: 3, pos:[1,8]}), new Wire({shape: 4, pos:[1,9]}),
      new Bulb({pos:[1,10]}), this.null, this.null, this.null, this.null,
      this.null, this.null];

    this.grid[2] = [this.null, this.null, this.null, this.null, this.null, new Bulb({pos:[2,5]}),
      new Bulb({pos:[2,6]}), new Wire({shape: 2, pos:[2,7]}), new Bulb({pos:[2,8]}),
      new Wire({shape: 3, pos:[2,9]}), new Wire({shape: 1, pos:[2,10]}),
      new Bulb({pos:[2,11]}), this.null, this.null, this.null, this.null, this.null];

    this.grid[3] = [this.null, this.null, this.null, this.null, new Bulb({pos:[3,4]}),
      new Wire({shape: 3, pos:[3,5]}), new Wire({shape: 1, pos:[3,6]}),
      new Wire({shape: 1, pos:[3,7]}), new Wire({shape: 2, pos:[3,8]}),
      new Wire({shape: 3, pos:[3,9]}), new Wire({shape: 1, pos:[3,10]}),
      new Bulb({pos:[3,11]}), new Bulb({pos:[3,12]}), this.null, this.null, this.null, this.null];

    this.grid[4] = [this.null, this.null, this.null, new Bulb({pos:[4,3]}),
      new Bulb({pos:[4,4]}), new Wire({shape: 3, pos:[4,5]}),
      new Wire({shape: 2, pos:[4,6]}), new Wire({shape: 3, pos:[4,7]}),
      new Wire({shape: 3, pos:[4,8]}), new Wire({shape: 2, pos:[4,9]}),
      new Bulb({pos:[4,10]}), new Wire({shape: 2, pos:[4,11]}),
      new Wire({shape: 2, pos:[4,12]}), new Bulb({pos:[4,13]}), this.null, this.null, this.null];

    this.grid[5] = [this.null, this.null, new Bulb({pos:[5,2]}), new Wire({shape: 3, pos:[5,3]}),
      new Wire({shape: 3, pos:[5,4]}), new Wire({shape: 4, pos:[5,5]}),
      new Wire({shape: 1, pos:[5,6]}), new Wire({shape: 2, pos:[5,7]}),
      new Wire({shape: 3, pos:[5,8]}), new Wire({shape: 2, pos:[5,9]}),
      new Bulb({pos:[5,10]}), new Wire({shape: 4, pos:[5,11]}),
      new Wire({shape: 1, pos:[5,12]}), new Wire({shape: 3, pos:[5,13]}),
      new Bulb({pos:[5,14]}), this.null, this.null];

    this.grid[6] = [this.null, new Bulb({pos:[6,1]}), new Wire({shape: 3, pos:[6,2]}),
      new Wire({shape: 3, pos:[6,3]}), new Wire({shape: 3, pos:[6,4]}),
      new Bulb({pos:[6,5]}), new Bulb({pos:[6,6]}), new Wire({shape: 3, pos:[6,7]}),
      new Wire({shape: 4, pos:[6,8]}), new Wire({shape: 1, pos:[6,9]}),
      new Wire({shape: 1, pos:[6,10]}), new Wire({shape: 4, pos:[6,11]}),
      new Wire({shape: 3, pos:[6,12]}), new Wire({shape: 1, pos:[6,13]}),
      new Bulb({pos:[6,14]}), new Bulb({pos:[6,15]}), this.null];

    this.grid[7] = [new Wire({shape: 2, pos:[7,0]}), new Wire({shape: 1, pos:[7,1]}),
      new Wire({shape: 3, pos:[7,2]}), new Bulb({pos:[7,3]}), new Bulb({pos:[7,4]}),
      new Bulb({pos:[7,5]}), new Wire({shape: 4, pos:[7,6]}),
      new Wire({shape: 2, pos:[7,7]}), new Wire({shape: 3, pos:[7,8]}),
      new Bulb({pos:[7,9]}), new Bulb({pos:[7,10]}), new Bulb({pos:[7,11]}),
      new Bulb({pos:[7,12]}), new Wire({shape: 2, pos:[7,13]}),
      new Wire({shape: 1, pos:[7,14]}), new Wire({shape: 2, pos:[7,15]}),
      new Bulb({pos:[7,16]})];

    this.grid[8] = [new Wire({shape: 2, pos:[8,0]}), new Bulb({pos:[8,1]}),
      new Wire({shape: 2, pos:[8,2]}), new Bulb({pos:[8,3]}), new Bulb({pos:[8,4]}),
      new Wire({shape: 1, pos:[8,5]}), new Wire({shape: 2, pos:[8,6]}),
      new Bulb({pos:[8,7]}), new Wire({shape: 4, pos:[8,8]}),
      new Wire({shape: 1, pos:[8,9]}), new Wire({shape: 3, pos:[8,10]}),
      new Wire({shape: 1, pos:[8,11]}), new Wire({shape: 1, pos:[8,12]}),
      new Wire({shape: 3, pos:[8,13]}), new Wire({shape: 1, pos:[8,14]}),
      new Wire({shape: 3, pos:[8,15]}), new Wire({shape: 2, pos:[8,16]})];
  }

  drawBackground(botCtx) {
    botCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    const grd = botCtx.createLinearGradient(0, Game.DIM_X/2, 0, 0);
    grd.addColorStop(0, "blue");
    grd.addColorStop(1, "#000026");
    botCtx.fillStyle = grd;
    botCtx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    botCtx.fillStyle = "white";
    botCtx.fillRect(0,420, 900,80);

    const img = new Image;
    img.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,h_500,w_950/v1479187903/Christmas%20Tree%20Game/free-colour-christmas-tree-vector-graphics.png';
    botCtx.drawImage(img, -10, 0);

    botCtx.strokeStyle = 'black';
    botCtx.lineWidth = 2;
    botCtx.strokeRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.base.draw(botCtx);
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 500;

module.exports = Game;
