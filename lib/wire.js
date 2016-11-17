const Elec = require('./elec');

class Wire extends Elec {
  constructor(options){
    super(options);
    this.shape = options.shape;
    this.x = options.pos[1]*this.width+150;
    this.y = options.pos[0]*this.height+65;

    this.children = [];
  }

  drawLight(ctx, other) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 4;
    this.drawWire(ctx, other);
  }

  drawDark(ctx, other) {
    ctx.lineWidth = 4;
    this.drawWire(ctx, other);
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

  drawWire(ctx, other) {
    ctx.clearRect(this.x, this.y, this.x+this.width, this.y+this.height);
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
