const DRAW_DENSITY = 20;
const PADDING = 20;

let points = [];

let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;

let mainFunc = circleFunc;

function setup() {
  createCanvas(400, 400);
  points = pointsFromFunction();

  createP(`X values from ${round(minX, 3)} to ${round(maxX, 3)}`);
  createP(`Y values from ${round(minY, 3)} to ${round(maxY, 3)}`);

  frameRate(25);
}

function draw() {
  background(0);
  drawPoints(points);

  let w = maxX - minX;
  let h = maxY - minY;
  drawBetweenPoints(
    createVector(
      w/2-w*noise(frameCount/100+1328723),
      h/2-h*noise((frameCount+10000+349871489)/100)
      ),
    createVector(
      w/2-w*noise(frameCount/100),
      h/2-h*noise((frameCount+10000)/100)
    ));
  // drawOrbital();

  strokeWeight(4);
  point(width/2, height/2);
}

function circleFunc(theta) {
  return 1;
}

function luckyFunc(theta) {
  return noise(sin(theta)*3);
  // return 2 + sin(4 * theta);
}


function findIntersection(source, goalTheta) {
  let bestTheta = rayTrace(source, goalTheta);
  return pointFromThetaFromOrigin(bestTheta);
}

function rayTrace(source, goalTheta) {
  let closestOffset = TWO_PI;
  let bestThetaFromOrigin = 0;
  points.forEach( perimeterPoint => {
    let thetaFromSource = findAngleBetween(source, perimeterPoint);
    let difference = abs(thetaFromSource - goalTheta);
    if (difference < closestOffset) {
      bestThetaFromOrigin = perimeterPoint.z;
      closestOffset = difference;
    }
  });
  return bestThetaFromOrigin;
}

// function rayTraceV2() {
//   findTwoClosestPoints();
//   return findThetaBetweenClosestPoints();
// }