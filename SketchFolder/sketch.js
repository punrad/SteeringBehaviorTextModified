// Most of this is by Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// I added the functionality to make the particles change into another text and changed the positioning of the text to always be in the middle of the canvas

var font;
var vehicles = [];

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
    hello = new PointText(width/2,height/2, "Potatoes", 0.6, 1, "triangle", "#ffffff", 40);
}

function draw()
{
    background(0);
    hello.draw();
}

//Point Text class
class PointText
{
  constructor(x, y, text, density, size, type, color, fontsize)
  {
    this.x = x || 0;
    this.y = y || 0;
    this.text = text || "";
    this.density = density || 0.1;
    this.setup = false;
    this.size = size || 3;
    this.type = type || "point";
    this.color = color || "#ffffff";
    this.fontsize = fontsize || 16;
  }

  draw()
  {
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
    if(this.setup == false)
    {
      this.setup = true;
      var bounds = font.textBounds(this.text, 0, 0, this.fontsize);
      var posx = this.x - bounds.w / 2;
      var posy = this.y + bounds.h / 2;

      var points = font.textToPoints(this.text, posx, posy, this.fontsize, { sampleFactor: this.density });

      for (var i = 0; i < points.length; i++)
      {
          var pt = points[i];
          var vehicle = new Vehicle(pt.x, pt.y, this.size, this.type, this.color);
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
              var v = new Vehicle(pt.x, pt.y, this.size, this.type, this.color);
              instructions.push(v);
          }
      }
    }
  }
}

//Vehicle class and functions
function Vehicle(x, y, size, type, color)
{
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = size || 4;
    this.maxspeed = 10;
    this.maxforce = 1;
    this.type = type || "point";
    this.color = color || "#ffffff";
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

    stroke(this.color);
    strokeWeight(this.r);

    if(this.type == "point")
    {
      point(this.pos.x, this.pos.y);
    }

    if(this.type == "square")
    {
      rect(this.pos.x, this.pos.y, this.r, this.r);
    }

    if(this.type == "triangle")
    {
      triangle(this.pos.x, this.pos.y, this.pos.x, this.pos.y, this.pos.x, this.pos.y);
    }
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
