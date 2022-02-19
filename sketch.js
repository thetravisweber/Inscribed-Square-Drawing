const DRAW_DENSITY = 16;
const PADDING = 20;

let points = [];

let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;

let counter = 0;

let mainFunc = luckyFunc;

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
      w/2-w*noise(counter),
      h/2-h*noise((counter+1000))
      ),
    createVector(
      (mouseX/ width - .5) * 6,
      (mouseY / height - .5) * 6 
    )
    // createVector(
    //   w/2-w*noise(frameCount/100),
    //   h/2-h*noise((frameCount+10000)/100)
    // )
  );
  // drawOrbital();

  strokeWeight(4);
  point(width/2, height/2);
}

function mousePressed() {
  counter++;
  draw();
}

function circleFunc(theta) {
  return 1;
}

function luckyFunc(theta) {
  return 2 + sin(4 * theta);
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

function findIntersection2(source, goalTheta) {
  let theta =  findTwoClosestPoints(source, goalTheta);
  return true;
  return pointFromThetaFromOrigin(theta);
  return findThetaBetweenClosestPoints();
}

function findTwoClosestPoints(raySource, goalTheta) {
  let indecesOfCrossing = [];
  let lastPointTheta = findAngleBetween(raySource, points[points.length-1]);
  let prevDifference = lastPointTheta - goalTheta;
  for (const [index, perimeterPoint] of points.entries()) {
    let thetaFromRaySource = findAngleBetween(raySource, perimeterPoint);
    let difference = thetaFromRaySource - goalTheta;
    console.log(index, thetaFromRaySource, difference);
    if (abs(difference - prevDifference) > PI) {
      prevDifference += TWO_PI;
    }
    if ((difference > 0 && prevDifference < 0)
      || (difference < 0 && prevDifference > 0)
    ) {
      indecesOfCrossing.push(index);
    }
    prevDifference = difference;
  }
  text(indecesOfCrossing, 50 , 50);
  let pointsToDraw = indecesOfCrossing.map(index => {return points[index]});
  drawCirclesAtPoints(pointsToDraw);
  noLoop();
}