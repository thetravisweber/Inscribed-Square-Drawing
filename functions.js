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
  point1 = mapPoint(point1);
  point2 = mapPoint(point2);
  let mapped = mapPoint(int);

  line(point1.x, point1.y, mapped.x, mapped.y);
  line(point1.x, point1.y, point2.x, point2.y);
  line(point2.x, point2.y, mapped.x, mapped.y);
  fill(255,0,0);
  ellipse(point2.x, point2.y, 20, 20);
  fill(0,255,0);
  ellipse(point1.x, point1.y, 20, 20);
  styleSecondary();

  ellipse(mapped.x, mapped.y, 20, 20);
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