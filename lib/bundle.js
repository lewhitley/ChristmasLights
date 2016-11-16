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
	
	  const topCanvas = document.getElementById("black-canvas");
	  topCanvas.width = Game.DIM_X;
	  topCanvas.height = Game.DIM_Y;
	
	  const canvasLeft = botCanvas.offsetLeft;
	  const canvasTop = botCanvas.offsetTop;
	
	  const botCtx = botCanvas.getContext("2d");
	  const midCtx = midCanvas.getContext("2d");
	  const topCtx = topCanvas.getContext("2d");
	
	  const game = new Game({left: canvasLeft, top: canvasTop,
	    topCanvas: topCanvas, midCtx: midCtx, topCtx: topCtx});
	  new Board(game, botCtx, midCtx, topCtx).start();
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
	    this.left = options.left;
	    this.top = options.top;
	    this.topCanvas = options.topCanvas;
	    this.midCtx = options.midCtx;
	    this.topCtx = options.topCtx;
	    this.setup();
	    this.addEventListeners();
	
	    window.grid = this.grid;
	  }
	
	  addEventListeners(){
	    this.topCanvas.addEventListener("click", this.handleClick.bind(this));
	  }
	
	  draw() {
	    // this.updateLit();
	    this.midCtx.clearRect(0,0,1100,500);
	    this.topCtx.clearRect(0,0,1100,500);
	    this.grid.slice(0,9).forEach( row => {
	      row.forEach( light => {
	        if ( light.lit ){
	          light.drawLight(this.midCtx);
	        } else if (light.pos){
	          light.drawDark(this.topCtx);
	        }
	      });
	    });
	  }
	
	  handleClick(e){
	    e.preventDefault();
	    const clickX = e.pageX - this.left;
	    const clickY = e.pageY - this.top;
	
	    const i = Math.floor((clickX-150)/40);
	    const j = Math.floor((clickY-130)/40);
	    if (this.grid[j] && this.grid[j][i]) {
	      this.grid[j][i].rotate();
	      this.draw();
	    }
	  }
	
	  updateLit(){
	    this.grid.forEach( row => {
	      row.forEach( light => {
	        if (light instanceof Bulb) {
	          this.updateBulb(light);
	        } else if (light instanceof Wire) {
	          this.updateWire(light);
	          // debugger
	        }
	      });
	    });
	  }
	
	  updateBulb(bulb) {
	    if (bulb.orientation === 0) {
	      let above;
	      if (this.grid[bulb.pos[0]]) {
	        above = this.grid[bulb.pos[0]][bulb.pos[1]-1];
	      }
	      if (above && above.lit && this.aboveConnected(above)) {
	          bulb.lit = true;
	      } else {
	        bulb.lit = false;
	      }
	    } else if (bulb.orientation === 1){
	      let right;
	      if (this.grid[bulb.pos[0]+1]) {
	        right = this.grid[bulb.pos[0]+1][bulb.pos[1]];
	      }
	      if (right && right.lit && this.rightConnected(right)) {
	          bulb.lit = true;
	      } else {
	        bulb.lit = false;
	      }
	    } else if (bulb.orientation === 2){
	      let bottom;
	      if (this.grid[bulb.pos[0]]){
	        bottom = this.grid[bulb.pos[0]][bulb.pos[1]+1];
	      }
	      if (bottom && bottom.lit && this.bottomConnected(bottom)) {
	          bulb.lit = true;
	      } else {
	        bulb.lit = false;
	      }
	    } else if (bulb.orientation === 3){
	      let left;
	      if (this.grid[bulb.pos[0]-1]) {
	        left = this.grid[bulb.pos[0]-1][bulb.pos[1]];
	      }
	      if (left && left.lit && this.leftConnected(left)) {
	          bulb.lit = true;
	      } else {
	        bulb.lit = false;
	      }
	    }
	  }
	
	  updateWire(wire){
	    let above, right, bottom, left;
	    above = this.grid[wire.pos[0]][wire.pos[1]-1];
	    bottom = this.grid[wire.pos[0]][wire.pos[1]+1];
	    if (this.grid[wire.pos[0]-1]) {
	      left = this.grid[wire.pos[0]-1][wire.pos[1]];
	    } else if (this.grid[wire.pos[0]+1]){
	      right = this.grid[wire.pos[0]+1][wire.pos[1]];
	    }
	
	    if (wire.shape === 4) {
	      if (above && above.lit && this.aboveConnected(above)) {
	          wire.lit = true;
	      } else if (right && right.lit && this.rightConnected(right)) {
	          wire.lit = true;
	      } else if (left && left.lit && this.leftConnected(left)) {
	          wire.lit = true;
	      } else if (bottom && bottom.lit && this.bottomConnected(bottom)) {
	          wire.lit = true;
	      } else {
	        wire.lit = false;
	      }
	    } else if (wire.shape === 3){
	      if (right && right.lit && this.rightConnected(right)) {
	          wire.lit = true;
	      } else {
	        wire.lit = false;
	      }
	    } else if (wire.shape === 2){
	      if (bottom && bottom.lit && this.bottomConnected(bottom)) {
	          wire.lit = true;
	      } else {
	        wire.lit = false;
	      }
	    } else if (wire.shape === 3){
	      if (left && left.lit && this.leftConnected(left)) {
	          wire.lit = true;
	      } else {
	        wire.lit = false;
	      }
	    }
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
	
	  aboveConnected(above){
	    return (
	      (above.shape === 4) ||
	      (above.shape === 3 && above.orientation !== 0) ||
	      (above.shape === 2 && (above.orientation === 1 || above.orientation === 2)) ||
	      (above.shape === 1 && (above.orientation === 0 || above.orientation === 2))
	    );
	  }
	
	  rightConnected(right) {
	    return (
	      (right.shape === 4) ||
	      (right.shape === 3 && right.orientation !== 1) ||
	      (right.shape === 2 && (right.orientation === 2 || right.orientation === 3)) ||
	      (right.shape === 1 && (right.orientation === 1 || right.orientation === 3))
	    );
	  }
	
	  bottomConnected(bottom) {
	    return (
	      (bottom.shape === 4) ||
	      (bottom.shape === 3 && bottom.orientation !== 2) ||
	      (bottom.shape === 2 && (bottom.orientation === 3 || bottom.orientation === 0)) ||
	      (bottom.shape === 1 && (bottom.orientation === 0 || bottom.orientation === 2))
	    );
	  }
	
	  leftConnected(left) {
	    return (
	      (left.shape === 4) ||
	      (left.shape === 3 && left.orientation !== 3) ||
	      (left.shape === 2 && (left.orientation === 0 || left.orientation === 1)) ||
	      (left.shape === 1 && (left.orientation === 1 || left.orientation === 3))
	    );
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Elec = __webpack_require__(3);
	
	class Wire extends Elec {
	  constructor(options){
	    super(options);
	    this.shape = options.shape;
	    this.x = options.pos[1]*this.width+150;
	    this.y = options.pos[0]*this.height+65;
	  }
	
	  drawLight(ctx) {
	    ctx.strokeStyle = 'yellow';
	    ctx.lineWidth = 4;
	    this.drawWire(ctx);
	  }
	
	  drawDark(ctx) {
	    ctx.lineWidth = 4;
	    this.drawWire(ctx);
	  }
	
	  drawWire(ctx) {
	    // ctx.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
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
	      this.x = options.pos[1]*this.width+150;
	      this.y = options.pos[0]*this.height+65;
	    }
	
	    if (options.type) {
	      this.type = options.type;
	    }
	  }
	
	  rotate(){
	    const prevOrient = this.orientation;
	    this.orientation = (prevOrient === 3) ? 0 : prevOrient + 1;
	  }
	
	  draw(ctx) {
	    if (this.type) {
	      ctx.strokeStyle = 'yellow';
	      ctx.lineWidth = 4;
	      ctx.moveTo(this.x+(this.width/2), this.y);
	      ctx.lineTo(this.x+(this.width/2), this.y+20);
	      ctx.stroke();
	      const base = new Image;
	      base.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_40/v1479275220/Christmas%20Tree%20Game/BoltCircle.png';
	      ctx.drawImage(base, this.x, this.y + 20);
	    } else{
	      return;
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
	  }
	
	  drawLight(ctx) {
	    // ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	    if (this.color === 'red') {
	      const redLit = new Image;
	      redLit.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240866/Christmas%20Tree%20Game/red_light.png';
	      ctx.drawImage(redLit, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'green') {
	      const greenLit = new Image;
	      greenLit.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240855/Christmas%20Tree%20Game/green_light.png';
	      ctx.drawImage(greenLit, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'blue') {
	      const blueLit = new Image;
	      blueLit.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240849/Christmas%20Tree%20Game/blue_light.png';
	      ctx.drawImage(blueLit, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'purple') {
	      const purpleLit = new Image;
	      purpleLit.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240860/Christmas%20Tree%20Game/purple_light.png';
	      ctx.drawImage(purpleLit, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'yellow') {
	      const yellowLit = new Image;
	      yellowLit.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240872/Christmas%20Tree%20Game/yellow_light.png';
	      ctx.drawImage(yellowLit, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    }
	    ctx.strokeStyle = 'yellow';
	    this.drawWire(ctx);
	  }
	
	  drawDark(ctx){
	    // ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
	    if (this.color === 'red') {
	      const redDark = new Image;
	      redDark.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240863/Christmas%20Tree%20Game/red_dark.png';
	      ctx.drawImage(redDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'green') {
	      const greenDark = new Image;
	      greenDark.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240853/Christmas%20Tree%20Game/green_dark.png';
	      ctx.drawImage(greenDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'blue') {
	      const blueDark = new Image;
	      blueDark.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240845/Christmas%20Tree%20Game/blue_dark.png';
	      ctx.drawImage(blueDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'purple') {
	      const purpleDark = new Image;
	      purpleDark.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240858/Christmas%20Tree%20Game/purple_dark.png';
	      ctx.drawImage(purpleDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    } else if (this.color === 'yellow') {
	      const yellowDark = new Image;
	      yellowDark.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_30/v1479240870/Christmas%20Tree%20Game/yellow_dark.png';
	      ctx.drawImage(yellowDark, this.x+5-(this.width/2), this.y+5-(this.height/2));
	    }
	    ctx.strokeStyle = 'black';
	    ctx.lineWidth = 4;
	    this.drawWire(ctx);
	  }
	
	  drawWire(ctx) {
	    // debugger
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map