/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Board = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const botCanvas = document.getElementById("bottom-canvas");
	  botCanvas.width = Game.DIM_X;
	  botCanvas.height = Game.DIM_Y;
	
	  const midCanvas = document.getElementById("yellow-canvas");
	  midCanvas.width = Game.DIM_X;
	  midCanvas.height = Game.DIM_Y;
	
	  const hoverCanvas = document.getElementById("hover-canvas");
	  hoverCanvas.width = Game.DIM_X;
	  hoverCanvas.height = Game.DIM_Y;
	
	  const topCanvas = document.getElementById("black-canvas");
	  topCanvas.width = Game.DIM_X;
	  topCanvas.height = Game.DIM_Y;
	
	  const canvasLeft = botCanvas.offsetLeft;
	  const canvasTop = botCanvas.offsetTop;
	
	  const botCtx = botCanvas.getContext("2d");
	  const midCtx = midCanvas.getContext("2d");
	  const hoverCtx = hoverCanvas.getContext("2d");
	  const topCtx = topCanvas.getContext("2d");
	
	  let game = new Game({left: canvasLeft, top: canvasTop,
	    topCanvas: topCanvas, midCtx: midCtx, hoverCtx: hoverCtx, topCtx: topCtx});
	  new Board(game, botCtx, midCtx, hoverCtx, topCtx).start();
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Wire = __webpack_require__(2);
	const Bulb = __webpack_require__(4);
	const Elec = __webpack_require__(3);
	
	class Game {
	  constructor(options){
	    this.null = new Elec({lit: false, orientation: null, pos:null});
	    this.base = new Elec({lit: true, orientation: null, pos:[9,8], type: 'electric'});
	    this.grid = [[], [], [], [], [], [], [], [], [], []];
	
	    this.topCanvas = options.topCanvas;
	    this.midCtx = options.midCtx;
	    this.hoverCtx = options.hoverCtx;
	    this.topCtx = options.topCtx;
	
	    this.setup();
	    this.addEventListeners();
	    this.updateLit();
	
	    this.currentWire = null;
	
	    this.mp = 70;
	    this.particles = [];
	    for(var i = 0; i < this.mp; i++)
	    {
	      this.particles.push({
	        x: Math.random()*Game.DIM_X,
	        y: Math.random()*Game.DIM_Y,
	        r: Math.random()*4+1, //radius
	        d: Math.random()*this.mp //density
	      });
	    }
	
	  }
	
	  addEventListeners(){
	    this.topCanvas.addEventListener("click", this.handleClick.bind(this));
	    this.topCanvas.addEventListener("mousemove", this.handleHover.bind(this));
	    this.topCanvas.addEventListener("click", this.handleHover.bind(this));
	  }
	
	  draw() {
	    this.grid.slice(0,9).forEach( row => {
	      row.forEach( elec => {
	        if ( elec.lit ){
	          elec.drawLight(this.midCtx, this.hoverCtx, this.topCtx);
	        } else if (elec.pos){
	          elec.drawDark(this.topCtx, this.hoverCtx, this.midCtx);
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
	
	    this.base.draw(this.midCtx);
	  }
	
	  won(){
	    let winBool = true;
	    this.grid.slice(0,9).forEach( row => {
	      row.forEach( elec => {
	        if ((elec instanceof Bulb) && !elec.lit) {
	          winBool = false;
	        }
	      });
	    });
	    return winBool;
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
	
	  handleHover(e){
	    e.preventDefault();
	    this.hoverCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    const hoverY = e.pageY;
	    const hoverX = e.pageX - e.path[2].offsetLeft + 20;
	
	    const i = Math.floor((hoverX-150)/40);
	    const j = Math.floor((hoverY-168)/40);
	    if (this.grid[j] && this.grid[j][i] && this.grid[j][i].pos && this.grid[j][i].type!="electric") {
	      this.grid[j][i].highlight(this.hoverCtx);
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
	      this.checkDirection(left, wire, 'left');
	      this.checkDirection(right, wire, 'right');
	      this.checkDirection(above, wire, 'above');
	      this.checkDirection(bottom, wire, 'bottom');
	    } else if (wire.shape === 3) {
	      if (wire.orientation === 0) {
	        this.checkDirection(left, wire, 'left');
	        this.checkDirection(right, wire, 'right');
	        this.checkDirection(bottom, wire, 'bottom');
	      } else if (wire.orientation === 1) {
	        this.checkDirection(left, wire, 'left');
	        this.checkDirection(above, wire, 'above');
	        this.checkDirection(bottom, wire, 'bottom');
	      } else if (wire.orientation === 2) {
	        this.checkDirection(left, wire, 'left');
	        this.checkDirection(right, wire, 'right');
	        this.checkDirection(above, wire, 'above');
	      } else if (wire.orientation === 3) {
	        this.checkDirection(right, wire, 'right');
	        this.checkDirection(above, wire, 'above');
	        this.checkDirection(bottom, wire, 'bottom');
	      }
	    } else if (wire.shape === 2) {
	      if (wire.orientation === 0) {
	        this.checkDirection(left, wire, 'left');
	        this.checkDirection(above, wire, 'above');
	      } else if (wire.orientation === 1) {
	        this.checkDirection(right, wire, 'right');
	        this.checkDirection(above, wire, 'above');
	      } else if (wire.orientation === 2) {
	        this.checkDirection(right, wire, 'right');
	        this.checkDirection(bottom, wire, 'bottom');
	      } else if (wire.orientation === 3) {
	        this.checkDirection(left, wire, 'left');
	        this.checkDirection(bottom, wire, 'bottom');
	      }
	    } else if (wire.shape === 1) {
	      if (wire.orientation === 1 || wire.orientation === 3) {
	        this.checkDirection(above, wire, 'above');
	        this.checkDirection(bottom, wire, 'bottom');
	      } else if (wire.orientation === 0 || wire.orientation === 2) {
	        this.checkDirection(left, wire, 'left');
	        this.checkDirection(right, wire, 'right');
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
	
	    botCtx.fillStyle = "#49311c";
	    botCtx.fillRect(420,430,80,70);
	
	    const img = new Image;
	    img.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,h_400,w_850/v1480987345/Christmas%20Tree%20Game/1396316632.png';
	    botCtx.drawImage(img, 30, 40);
	
	    botCtx.fillStyle = 'white';
	    botCtx.beginPath();
			for(var i = 0; i < this.mp; i++)
			{
				var p = this.particles[i];
				botCtx.moveTo(p.x, p.y);
				botCtx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
			}
			botCtx.fill();
			this.update();
	
	  }
	
		update() {
	    var angle = 0;
			angle += 0.01;
			for(var i = 0; i < this.mp; i++)
			{
				var p = this.particles[i];
				//Updating X and Y coordinates
				//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
				//Every particle has its own density which can be used to make the downward movement different for each flake
				//Lets make it more random by adding in the radius
				p.y += Math.cos(angle+p.d) + 1 + p.r/2;
				p.x += Math.sin(angle) * 2;
	
				//Sending flakes back from the top when it exits
				//Lets make it a bit more organic and let flakes enter from the left and right also.
				if(p.x > Game.DIM_X+5 || p.x < -5 || p.y > Game.DIM_Y)
				{
					if(i%3 > 0) //66.67% of the flakes
					{
						this.particles[i] = {x: Math.random()*Game.DIM_X, y: -10, r: p.r, d: p.d};
					}
					else
					{
						//If the flake is exitting from the right
						if(Math.sin(angle) > 0)
						{
							//Enter from the left
							this.particles[i] = {x: -5, y: Math.random()*Game.DIM_Y, r: p.r, d: p.d};
						}
						else
						{
							//Enter from the right
							this.particles[i] = {x: Game.DIM_X+5, y: Math.random()*Game.DIM_Y, r: p.r, d: p.d};
						}
					}
				}
			}
		}
	}
	
	Game.DIM_X = 900;
	Game.DIM_Y = 500;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Elec = __webpack_require__(3);
	
	class Wire extends Elec {
	  constructor(options){
	    super(options);
	    this.shape = options.shape;
	    this.children = [];
	  }
	
	  drawLight(ctx, hover, other) {
	    ctx.strokeStyle = 'yellow';
	    ctx.lineWidth = 4;
	    ctx.shadowBlur = 8;
	    ctx.shadowColor = "white";
	    this.drawWire(ctx, hover, other);
	  }
	
	  drawDark(ctx, hover, other) {
	    ctx.lineWidth = 4;
	    this.drawWire(ctx, hover, other);
	  }
	
	  highlight(ctx) {
	    ctx.strokeStyle = 'red';
	    ctx.strokeRect(this.x, this.y, 40, 40);
	  }
	
	  emptyChildren() {
	    this.children.forEach(child => {
	      child.lit = false;
	      child.emptyParent(this);
	      if (child instanceof Wire) {
	        child.emptyChildren();
	      }
	    });
	    this.children = [];
	  }
	
	  addChild(child) {
	    this.children.push(child);
	    child.updateParent(this);
	  }
	
	  drawWire(ctx, hover, other) {
	    ctx.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
	    hover.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
	    other.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
	
	    ctx.beginPath();
	    if (this.shape === 4 ){
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+this.height);
	      ctx.stroke();
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    } else if(this.shape === 3 && this.orientation === 1) {
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+this.height);
	      ctx.stroke();
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2));
	      ctx.stroke();
	    } else if(this.shape === 3 && this.orientation === 2) {
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2));
	      ctx.stroke();
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    } else if (this.shape === 3 && this.orientation === 3) {
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+this.height);
	      ctx.stroke();
	      ctx.moveTo(this.x+(this.width/2), this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    } else if (this.shape === 3 && this.orientation === 0) {
	      ctx.moveTo(this.x+(this.width/2), this.y+(this.height/2));
	      ctx.lineTo(this.x+(this.width/2), this.y+this.height);
	      ctx.stroke();
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    } else if(this.shape === 2 && this.orientation === 0) {
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2)+2);
	      ctx.stroke();
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+(this.width/2)+2, this.y+(this.height/2));
	      ctx.stroke();
	    } else if(this.shape === 2 && this.orientation === 1) {
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2)+2);
	      ctx.stroke();
	      ctx.moveTo(this.x+(this.width/2)+2, this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    } else if(this.shape === 2 && this.orientation === 2) {
	      ctx.moveTo(this.x+(this.width/2), this.y+this.height);
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2)-2);
	      ctx.stroke();
	      ctx.moveTo(this.x+(this.width/2), this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    } else if(this.shape === 2 && this.orientation === 3) {
	      ctx.moveTo(this.x+(this.width/2), this.y+this.height);
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2)-2);
	      ctx.stroke();
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+(this.width/2), this.y+(this.height/2));
	      ctx.stroke();
	    } else if (this.shape === 1 && (this.orientation === 1 || this.orientation === 3)){
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+this.height);
	      ctx.stroke();
	    } else if (this.shape === 1 && (this.orientation === 0 || this.orientation === 2)){
	      ctx.moveTo(this.x, this.y+(this.height/2));
	      ctx.lineTo(this.x+this.width, this.y+(this.height/2));
	      ctx.stroke();
	    }
	  }
	}
	
	module.exports = Wire;


/***/ },
/* 3 */
/***/ function(module, exports) {

	class Elec {
	  constructor(options){
	    this.lit = options.lit || false;
	    this.orientation = Math.floor(Math.random() * 4);
	    this.pos = options.pos;
	
	    if (options.pos){
	      this.width = 40;
	      this.height = 40;
	      this.x = options.pos[1]*this.width+120;
	      this.y = options.pos[0]*this.height+65;
	    }
	
	    if (options.type) {
	      this.type = options.type;
	    }
	
	    this.parent = null;
	  }
	
	  rotate(game){
	    const prevOrient = this.orientation;
	    this.orientation = (prevOrient === 3) ? 0 : prevOrient + 1;
	    game.updateLit();
	  }
	
	  draw(ctx) {
	    if (this.type) {
	      ctx.strokeStyle = 'yellow';
	      ctx.lineWidth = 4;
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+20);
	      ctx.stroke();
	      const base = new Image;
	      base.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_40/v1479275220/Christmas%20Tree%20Game/BoltCircle.png';
	      ctx.drawImage(base, this.x, this.y + 20);
	    } else{
	      return;
	    }
	  }
	
	  updateParent(parent) {
	    this.parent = parent;
	  }
	
	  emptyParent(parent){
	    if (this.parent === parent) {
	      this.parent = null;
	    }
	  }
	}
	
	module.exports = Elec;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Elec = __webpack_require__(3);
	
	class Bulb extends Elec {
	  constructor(options){
	    super(options);
	    const COLORS = ["red", "yellow", "green", "blue", "purple"];
	    this.color = options.color || COLORS[Math.floor(Math.random() * COLORS.length)];
	
	    this.x += (this.width/2);
	    this.y += (this.height/2);
	
	    this.litSources = ['https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240866/Christmas%20Tree%20Game/red_light.png',
	      'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240855/Christmas%20Tree%20Game/green_light.png',
	      'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240849/Christmas%20Tree%20Game/blue_light.png',
	      'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240860/Christmas%20Tree%20Game/purple_light.png',
	      'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240872/Christmas%20Tree%20Game/yellow_light.png'
	    ];
	
	    this.litImages = this.litSources.map( url => {
	      const img = new Image();
	      img.src = url;
	      return img;
	    });
	  }
	
	  highlight(ctx) {
	    ctx.strokeStyle = 'red';
	    ctx.strokeRect(this.x-(this.width/2), this.y-(this.height/2), 40, 40);
	  }
	
	  drawLight(ctx, hover, other) {
	    ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	    hover.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	    other.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	
	    let lit;
	    if (this.color === 'red') {
	      lit = this.litImages[0];
	    } else if (this.color === 'green') {
	      lit = this.litImages[1];
	    } else if (this.color === 'blue') {
	      lit = this.litImages[2];
	    } else if (this.color === 'purple') {
	      lit = this.litImages[3];
	    } else if (this.color === 'yellow') {
	      lit = this.litImages[4];
	    }
	    ctx.drawImage(lit, this.x+3-(this.width/2), this.y+3-(this.height/2));
	
	    ctx.strokeStyle = 'yellow';
	    ctx.shadowBlur = 8;
	    ctx.shadowColor = "white";
	    this.drawWire(ctx);
	  }
	
	  drawDark(ctx, hover, other){
	    ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	    hover.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	    other.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	
	    if (this.color === 'red') {
	      const redDark = new Image;
	      redDark.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240863/Christmas%20Tree%20Game/red_dark.png';
	      ctx.drawImage(redDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'green') {
	      const greenDark = new Image;
	      greenDark.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240853/Christmas%20Tree%20Game/green_dark.png';
	      ctx.drawImage(greenDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'blue') {
	      const blueDark = new Image;
	      blueDark.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240845/Christmas%20Tree%20Game/blue_dark.png';
	      ctx.drawImage(blueDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'purple') {
	      const purpleDark = new Image;
	      purpleDark.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240858/Christmas%20Tree%20Game/purple_dark.png';
	      ctx.drawImage(purpleDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'yellow') {
	      const yellowDark = new Image;
	      yellowDark.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240870/Christmas%20Tree%20Game/yellow_dark.png';
	      ctx.drawImage(yellowDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    }
	    ctx.strokeStyle = 'black';
	    ctx.lineWidth = 4;
	    this.drawWire(ctx);
	  }
	
	  drawWire(ctx) {
	    ctx.beginPath();
	    const RADIUS = 13;
	    if (this.orientation === 0) {
	      ctx.moveTo(this.x, this.y-RADIUS);
	      ctx.lineTo(this.x, this.y-(this.height/2));
	    } else if (this.orientation === 1){
	      ctx.moveTo(this.x+RADIUS, this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y);
	    } else if (this.orientation === 2){
	      ctx.moveTo(this.x, this.y+RADIUS);
	      ctx.lineTo(this.x, this.y+(this.height/2));
	    } else if (this.orientation === 3){
	      ctx.moveTo(this.x-RADIUS, this.y);
	      ctx.lineTo(this.x-(this.width/2), this.y);
	    }
	    ctx.stroke();
	    ctx.closePath();
	  }
	}
	
	module.exports = Bulb;


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map