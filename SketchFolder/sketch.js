// Most of this is by Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// I added the functionality to make the particles change into another text and changed the positioning of the text to always be in the middle of the canvas

var font;
var vehicles = [];

var texts = ['Velkommen'];
var nextT = 0;
var maxChangeForce = 20;

var instructions = [];
var insText = '';

function preload() {
    font = loadFont('https://punrad.github.io/SteeringBehaviorTextModified/SketchFolder/TTWPGOTT.ttf');
}

function setup()
{
    createCanvas(1200, 400);
    textPointSetup();
}

function draw() {
    background(0);

    for (var i = 0; i < instructions.length; i++) {
        var v = instructions[i];
        v.behaviors();
        v.update();
        v.show();
    }

    for (var i = 0; i < vehicles.length; i++) {
        var v = vehicles[i];
        v.behaviors();
        v.update();
        v.show();
    }
}

function textPointSetup()
{
  var bounds = font.textBounds(texts[0], 0, 0, 192);
  var posx = width / 2 - bounds.w / 2;
  var posy = height / 2 + bounds.h / 2;

  var points = font.textToPoints(texts[0], posx, posy, 192, { sampleFactor: 0.1 });

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
