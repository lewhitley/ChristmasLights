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
      base.src = 'http://res.cloudinary.com/doepem37s/image/upload/c_scale,w_40/v1479275220/Christmas%20Tree%20Game/BoltCircle.png';
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
