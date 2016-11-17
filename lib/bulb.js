const Elec = require('./elec');

class Bulb extends Elec {
  constructor(options){
    super(options);
    const COLORS = ["red", "yellow", "green", "blue", "purple"];
    this.color = options.color || COLORS[Math.floor(Math.random() * COLORS.length)];

    this.x += (this.width/2);
    this.y += (this.height/2);
  }

  drawLight(ctx, other) {
    ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
    other.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
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

  drawDark(ctx, other){
    ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
    other.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
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
