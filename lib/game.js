const Wire = require('./wire');
const Bulb = require('./bulb');
const Elec = require('./elec');

class Game {
  constructor(options){
    this.null = new Elec({lit: false, orientation: null, pos:null});
    this.base = new Elec({lit: true, orientation: null, pos:[9,8], type: 'electric'});
    this.grid = [[], [], [], [], [], [], [], [], [], []];
    this.winBool = false;
    // this.left = options.left;
    // this.top = options.top;
    this.topCanvas = options.topCanvas;
    this.midCtx = options.midCtx;
    this.topCtx = options.topCtx;
    this.setup();
    this.addEventListeners();
    this.updateLit();

    window.grid = this.grid;
  }

  addEventListeners(){
    this.topCanvas.addEventListener("click", this.handleClick.bind(this));
  }

  draw() {
    this.grid.slice(0,9).forEach( row => {
      row.forEach( elec => {
        if ( elec.lit ){
          elec.drawLight(this.midCtx, this.topCtx);
        } else if (elec.pos){
          elec.drawDark(this.topCtx, this.midCtx);
        }
      });
    });

    if (this.won()) {
      const wonModal = document.getElementById('won-modal');
      wonModal.style.display = "block";

      let span = document.getElementsByClassName("won-close")[0];
      span.onclick = (e) => {
        e.stopPropagation();
        wonModal.style.display = "none";
      };

      document.getElementsByClassName('new-game')[0].addEventListener('click', (e)=>{
        e.stopPropagation();
        wonModal.style.display = "none";
        location.reload();
      });
    }
  }

  won(){
    this.winBool = true;
    this.grid.slice(0,9).forEach( row => {
      row.forEach( elec => {
        if ((elec instanceof Bulb) && !elec.lit) {
          this.winBool = false;
        }
      });
    });
    return this.winBool;
  }

  handleClick(e){
    e.preventDefault();
    const clickY = e.pageY;
    const clickX = e.pageX - e.path[2].offsetLeft + 20;

    const i = Math.floor((clickX-150)/40);
    const j = Math.floor((clickY-168)/40);
    if (this.grid[j] && this.grid[j][i]) {
      this.grid[j][i].rotate(this);
    }
  }

  updateLit(elec){
    if (!elec) {
      let base = this.grid[8][8];
      base.lit = true;
      this.setChildren(this.grid[8][8]);
    }
    this.draw();
  }

  updateBulb(bulb) {
    bulb.lit = true;
  }

  setChildren(wire){

    let above, right, bottom, left;
    left = this.grid[wire.pos[0]][wire.pos[1]-1];
    right = this.grid[wire.pos[0]][wire.pos[1]+1];
    if (this.grid[wire.pos[0]-1]) {
      above = this.grid[wire.pos[0]-1][wire.pos[1]];
    }
    if (this.grid[wire.pos[0]+1]){
      bottom = this.grid[wire.pos[0]+1][wire.pos[1]];
    }

    wire.emptyChildren();
    if (wire.shape === 4) {

      if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
        wire.addChild(left);
      }

      if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
        wire.addChild(bottom);
      }

      if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
        wire.addChild(right);
      }

      if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
        wire.addChild(above);
      }
    } else if (wire.shape === 3) {
      wire.emptyChildren();
      if (wire.orientation === 0) {
        if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
          wire.addChild(left);
        }

        if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
          wire.addChild(bottom);
        }

        if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
          wire.addChild(right);
        }
      } else if (wire.orientation === 1) {
        if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
          wire.addChild(left);
        }

        if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
          wire.addChild(bottom);
        }

        if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
          wire.addChild(above);
        }
      } else if (wire.orientation === 2) {
        if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
          wire.addChild(left);
        }

        if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
          wire.addChild(right);
        }

        if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
          wire.addChild(above);
        }
      } else if (wire.orientation === 3) {
        if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
          wire.addChild(above);
        }

        if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
          wire.addChild(bottom);
        }

        if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
          wire.addChild(right);
        }
      }
    } else if (wire.shape === 2) {
      if (wire.orientation === 0) {
        if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
          wire.addChild(left);
        }

        if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
          wire.addChild(above);
        }
      }
      if (wire.orientation === 1) {
        if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
          wire.addChild(above);
        }

        if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
          wire.addChild(right);
        }
      }
      if (wire.orientation === 2) {
        if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
          wire.addChild(bottom);
        }

        if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
          wire.addChild(right);
        }
      }
      if (wire.orientation === 3) {
        if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
          wire.addChild(left);
        }

        if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
          wire.addChild(bottom);
        }
      }
    }
    if (wire.shape === 1) {
      if (wire.orientation === 1 || wire.orientation === 3) {
        if (above && wire.parent !== above && !above.parent && this.aboveConnected(above)){
          wire.addChild(above);
        }
        if (bottom && wire.parent !== bottom && !bottom.parent && this.bottomConnected(bottom)){
          wire.addChild(bottom);
        }
      }
      if (wire.orientation === 0 || wire.orientation === 2) {
        if (left && wire.parent !== left && !left.parent && this.leftConnected(left)){
          wire.addChild(left);
        }
        if (right && wire.parent !== right && !right.parent && this.rightConnected(right)){
          wire.addChild(right);
        }
      }
    }

    wire.children.forEach(child => {
      if (!child.lit && child.pos) {
        if (child instanceof Wire) {
          child.lit = true;
          this.setChildren(child);
        } else if (child instanceof Bulb) {
          this.updateBulb(child);
        }
      } else {
        return;
      }
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

    this.grid[9] = [this.null, this.null, this.null, this.null, this.null,
      this.null, this.null, this.null, this.base, this.null, this.null,
      this.null, this.null, this.null, this.null, this.null, this.null];
  }

  checkDirection(neighbor, wire, string) {
    if (neighbor && wire.parent !== neighbor && !neighbor.parent){
      if (string === 'left' && this.leftConnected(neighbor)){
        wire.addChild(neighbor);
      } else if (string === 'right' && this.rightConnected(neighbor)){
        wire.addChild(neighbor);
      } else if (string === 'above' && this.aboveConnected(neighbor)){
        wire.addChild(neighbor);
      } else if (string === 'bottom' && this.bottomConnected(neighbor)){
        wire.addChild(neighbor);
      }
    }
  }

  aboveConnected(above){
    if (above instanceof Bulb) {
      return above.orientation === 2;
    } else if (above instanceof Wire) {
      return (
        (above.shape === 4) ||
        (above.shape === 3 && above.orientation !== 2) ||
        (above.shape === 2 && (above.orientation === 3 || above.orientation === 2)) ||
        (above.shape === 1 && (above.orientation === 1 || above.orientation === 3))
      );
    }
  }

  rightConnected(right) {
    if (right instanceof Bulb) {
      return right.orientation === 3;
    } else if (right instanceof Wire) {
      return (
        (right.shape === 4) ||
        (right.shape === 3 && right.orientation !== 3) ||
        (right.shape === 2 && (right.orientation === 0 || right.orientation === 3)) ||
        (right.shape === 1 && (right.orientation === 0 || right.orientation === 2))
      );
    }
  }

  bottomConnected(bottom) {
    if (bottom instanceof Bulb) {
      return bottom.orientation === 0;
    } else if (bottom instanceof Wire) {
      return (
        (bottom.pos && bottom.pos[0] === 9 && bottom.pos[1] === 8) ||
        (bottom.shape === 4) ||
        (bottom.shape === 3 && bottom.orientation !== 0) ||
        (bottom.shape === 2 && (bottom.orientation === 1 || bottom.orientation === 0)) ||
        (bottom.shape === 1 && (bottom.orientation === 1 || bottom.orientation === 3))
      );
    }
  }

  leftConnected(left) {
    if (left instanceof Bulb) {
      return left.orientation === 1;
    } else if (left instanceof Wire) {
      return (
        (left.shape === 4) ||
        (left.shape === 3 && left.orientation !== 1) ||
        (left.shape === 2 && (left.orientation === 2 || left.orientation === 1)) ||
        (left.shape === 1 && (left.orientation === 0 || left.orientation === 2))
      );
    }
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
    img.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,h_500,w_950/v1479187903/Christmas%20Tree%20Game/free-colour-christmas-tree-vector-graphics.png';
    botCtx.drawImage(img, -45, 0);

    this.base.draw(botCtx);
  }
}

Game.DIM_X = 900;
Game.DIM_Y = 500;

module.exports = Game;
