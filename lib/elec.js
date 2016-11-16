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
    // debugger
  }

  draw(ctx) {
    if (this.type) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 4;
      ctx.moveTo(this.x+(this.width/2), this.y);
      ctx.lineTo(this.x+(this.width/2), this.y+30);
      ctx.stroke();
    } else{
      return;
    }
  }
}

module.exports = Elec;
