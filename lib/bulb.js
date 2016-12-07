const Elec = require('./elec');

class Bulb extends Elec {
  constructor(options){
    super(options);
    const COLORS = ["red", "yellow", "green", "blue", "purple"];
    this.color = options.color || COLORS[Math.floor(Math.random() * COLORS.length)];

    this.x += (this.width/2);
    this.y += (this.height/2);
  }

  highlight(ctx) {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(this.x-(this.width/2), this.y-(this.height/2), 40, 40);
  }

  drawLight(ctx, hover, other) {
    ctx.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
    hover.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));
    other.clearRect(this.x-(this.width/2), this.y-(this.height/2), this.x+(this.width/2), this.y+(this.height/2));

    const lit = new Image;
    if (this.color === 'red') {
      lit.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240866/Christmas%20Tree%20Game/red_light.png';
    } else if (this.color === 'green') {
      lit.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240855/Christmas%20Tree%20Game/green_light.png';
    } else if (this.color === 'blue') {
      lit.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240849/Christmas%20Tree%20Game/blue_light.png';
    } else if (this.color === 'purple') {
      lit.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240860/Christmas%20Tree%20Game/purple_light.png';
    } else if (this.color === 'yellow') {
      lit.src = 'https://res.cloudinary.com/doepem37s/image/upload/c_scale,w_34/v1479240872/Christmas%20Tree%20Game/yellow_light.png';
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
