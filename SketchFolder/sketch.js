// Most of this is by Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// I added the functionality to make the particles change into another text and changed the positioning of the text to always be in the middle of the canvas

var font;
var vehicles = [];

var nextT = 0;
var maxChangeForce = 20;

var instructions = [];
var insText = '';
var hello;

function preload()
{
    font = loadFont('https://punrad.github.io/SteeringBehaviorTextModified/SketchFolder/TTWPGOTT.ttf');
}

function setup()
{
    createCanvas(windowWidth, windowHeight);
    hello = new PointText(width/2,height/2,"hey",1);
}

function draw()
{
    background(0);
    hello.setup();

    for (var i = 0; i < instructions.length; i++)
    {
        var v = instructions[i];
        v.behaviors();
        v.update();
        v.show();
    }

    for (var i = 0; i < vehicles.length; i++)
    {
        var v = vehicles[i];
        v.behaviors();
        v.update();
        v.show();
    }
}


class PointText
{
  constructor(x, y, text, density)
  {
    this.x = x || 0;
    this.y = y || 0;
    this.text = text || "";
    this.density = density || 0.1;
    this.drawn = false;
  }

  setup()
  {
    if(this.drawn == false)
    {
      this.drawn = true;
      var bounds = font.textBounds(this.text, 0, 0, 192);
      var posx = this.x - bounds.w / 2;
      var posy = this.y + bounds.h / 2;

      var points = font.textToPoints(this.text, posx, posy, 192, { sampleFactor: this.density });

      for (var i = 0; i < points.length; i++)
      {
          var pt = points[i];
          var vehicle = new Vehicle(pt.x, pt.y);
          vehicles.push(vehicle);
      }

      var boundsIns = font.textBounds(insText, 0, 0, 30);
      var posxIns = width / 2 - boundsIns.w / 2;
      var posyIns = height / 6 + boundsIns.h / 2;

      var insAr = split(insText, ' ');

      for (var i = 0; i < insAr.length; i++)
      {
          var bounds2 = font.textBounds(insAr[i], 0, 0, 30);
          var posx2 = posxIns;
          var posy2 = posyIns;

          posxIns += bounds2.w + 10;

          var points2 = font.textToPoints(insAr[i], posx2, posy2, 30, { sampleFactor: 0.1 });

          for (var j = 0; j < points2.length; j++)
          {
              var pt = points2[j];
              var v = new Vehicle(pt.x, pt.y, 3);
              instructions.push(v);
          }
      }
    }
  }
}

function Vehicle(x, y, size) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    if (size != null) {
        this.r = size;
    } else {
        this.r = 4;
    }
    this.maxspeed = 10;
    this.maxforce = 1;
}

Vehicle.prototype.behaviors = function () {
    var arrive = this.arrive(this.target);
    var mouse = createVector(mouseX, mouseY);
    var flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
}

Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
}

Vehicle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
}

Vehicle.prototype.show = function () {
    stroke(255);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
}


Vehicle.prototype.arrive = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    if (d < 100) {
        speed = map(d, 0, 100, 0, this.maxspeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
}

Vehicle.prototype.flee = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 50) {
        desired.setMag(this.maxspeed);
        desired.mult(-1);
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return createVector(0, 0);
    }
}

Vehicle.prototype.clone = function () {
    var v = new Vehicle(this.pos.x, this.pos.y);

    v.pos.x = this.pos.x;
    v.pos.y = this.pos.y;

    v.vel.x = this.vel.x;
    v.vel.y = this.vel.y;

    v.acc.x = this.acc.x;
    v.acc.y = this.acc.y;

    return v;
}
