function circleFunc(theta) {
  return 1;
}

function pointsFromFunction() {
  let points = [];
  for (let i = 0; i < DRAW_DENSITY; i++) {
    let theta = TWO_PI * i / DRAW_DENSITY;
    points[i] = pointFromThetaFromOrigin(theta);
    if (points[i].x < minX) {
      minX = points[i].x;
    } else if (points[i].x > maxX) {
      maxX = points[i].x;
    }
    if (points[i].y < minY) {
      minY = points[i].y;
    } else if (points[i].y > maxY) {
      maxY = points[i].y;
    }
  }

  return points;
}

function pointFromThetaFromOrigin(theta) {
  let r = mainFunc(theta);
  return createVector(cos(theta) * r, sin(theta) * r, theta);
}

function drawPoints(points) {
  stylePrimary();
  beginShape();
  points.forEach(point => {
    mapped = mapPoint(point);
    vertex(mapped.x, mapped.y);
  });
  endShape();
}

function drawCirclesAtPoints(points) {
  fill(240,230,140);
  points.forEach(point => {
    mapped = mapPoint(point);
    ellipse(mapped.x, mapped.y, 10, 10);
  });
}


function mapPoint(point) {
  return createVector(
    map(point.x, minX, maxX, PADDING, width - PADDING),
    map(point.y, minY, maxY, PADDING, height - PADDING)
  );
}

function drawFromPointToMouse(point) {
  styleSecondary();

  let int = findIntersection(
    point,
    mouseTheta(mapPoint(point))
  );
  point = mapPoint(point);
  let mapped = mapPoint(int);

  line(point.x, point.y, mapped.x, mapped.y);
  ellipse(mapped.x, mapped.y, 20, 20);
}

function drawBetweenPoints(point1, point2) {
  styleSecondary();

  let int = findIntersection(
    point1,
    findAngleBetween(point1, point2)
  );
  let int2 = findIntersection2(
    point1,
    findAngleBetween(point1, point2)
  );
  point1 = mapPoint(point1);
  point2 = mapPoint(point2);
  let mapped = mapPoint(int);
  

  line(point1.x, point1.y, mapped.x, mapped.y);
  line(point1.x, point1.y, point2.x, point2.y);
  // line(point2.x, point2.y, mapped.x, mapped.y);
  fill(255,0,0);
  ellipse(point2.x, point2.y, 20, 20);
  fill(0,255,0);
  ellipse(point1.x, point1.y, 20, 20);
  styleSecondary();

  ellipse(mapped.x, mapped.y, 5, 5);
  // let mapped2 = mapPoint(int2);
  // ellipse(mapped2.x, mapped2.y, 5, 5);
}

function mouseTheta(point) {
  return findAngleBetween(
    createVector(mouseX, mouseY),
    point
  );
}

function findAngleBetween(point1, point2) {
  let theta = atan( (point1.y - (point2.y)) / (point1.x - (point2.x)) );
  if (point1.x < point2.x) {
    theta -= PI;
  }
  return theta;
}

function stylePrimary() {
  stroke(255);
  strokeWeight(1);
  fill(3, 148, 148);
}

function styleSecondary() {
  stroke(255);
  strokeWeight(1);
  fill(255, 64, 128);
}

function drawOrbital(withLine = false) {
  styleSecondary();
  let boundaryPoint = pointFromThetaFromOrigin(frameCount / 100 * PI);
  let mapped = mapPoint(boundaryPoint);
  ellipse(mapped.x, mapped.y, 20, 20);
  if (!withLine) return;
  let ang = findAngleBetween(
    boundaryPoint,
    createVector(0, 0),
  );
  line(width/2, height/2, (width/2) + 200 * cos(ang), (height/2) + 200* sin(ang));
}

// no epsilon cushion, finds exact constant or uses max # of calls
// find inverse f⁻¹(target) within a and b
// returns random match if f(x) = target for multiple x values between a and b
function inverseFunct(funct, target=0, a=-this.IntegrationInfinity, b=this.IntegrationInfinity, closest=NaN, calls=2**10) {
  if (calls <= 0) {
      return closest;
  }

  // f(a)
  let fOfA = funct(a);
  // f(b)
  let fOfB = funct(b);
  
  let guess;
  // if target is between fOfA and fOfB
  if (this.between(target, fOfA, fOfB)) {
      guess = this.map(target, fOfA, fOfB, a, b);
  }
  // if target is not between fOfA and fOfB
  else {
      let range = b - a;
      let step = range / calls;
      guess = a + step;
  }

  let result = funct(guess);

  if (result === target) {
      return guess;
  }

  let epsilon = Math.abs(target - result);
  if (epsilon < funct(closest) || isNaN(closest)) {
      closest = guess;
  }

  // if f(guess) between [f(a), target]
  if (this.between(result, fOfA, target)) {
      b = guess;
  }
  // if target between [guess, b]
  else {
      a = guess;
  }
  return this.inverseFunct(funct, target, a, b, closest, calls - 1);
}