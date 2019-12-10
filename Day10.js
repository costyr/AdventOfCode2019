const util = require('./Util.js');

function ParseLine(aLine) {
  return aLine.split("");
}

var map = util.MapInput('./Day10Input.txt', ParseLine, '\r\n');

console.log(map);

function FindAsteroids(aMap, aAsteroids) {
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (aMap[y][x] == '#')
        aAsteroids.push({ "x": x, "y": y, "count": 0 });
}

var asteroids = [];
FindAsteroids(map, asteroids);

function ComputeFormula(aPoint1, aPoint2) {
  let m = undefined;
  let b = undefined;
  if ((aPoint1.x != aPoint2.x) && (aPoint1.y != aPoint2.y)) {
    m = (aPoint2.y - aPoint1.y) / (aPoint2.x - aPoint1.x);
    b = -m * aPoint1.x + aPoint1.y;
  }

  return { "m": m, "b": b };
}

function PointIsBetween(aMiddlePoint, aPoint1, aPoint2) {
  if (aPoint1.x == aPoint2.x) {
    if (aMiddlePoint.x == aPoint1.x) {
      let dist = Math.abs(aPoint1.y - aPoint2.y);

      if (Math.abs(aMiddlePoint.y - aPoint1.y) < dist &&
        Math.abs(aMiddlePoint.y - aPoint2.y) < dist)
        return true;
    }
  }
  else {
    if (aMiddlePoint.y == aPoint1.y) {
      let dist = Math.abs(aPoint1.x - aPoint2.x);

      if (Math.abs(aMiddlePoint.x - aPoint1.x) < dist &&
        Math.abs(aMiddlePoint.x - aPoint2.x) < dist)
        return true;
    }
  }

  return false;
}

function PointIsBetween2(aMiddlePoint, aPoint1, aPoint2) {
  let distY = Math.abs(aPoint1.y - aPoint2.y);
  let distX = Math.abs(aPoint1.x - aPoint2.x);

  if (Math.abs(aMiddlePoint.y - aPoint1.y) < distY &&
    Math.abs(aMiddlePoint.y - aPoint2.y) < distY &&
    Math.abs(aMiddlePoint.x - aPoint1.x) < distX &&
    Math.abs(aMiddlePoint.x - aPoint2.x) < distX)
    return true;
  return false;
}

function IsSame(aAsteroid1Coord, aAsteroid2Coord) {
  if ((aAsteroid1Coord.x == aAsteroid2Coord.x) &&
    (aAsteroid1Coord.y == aAsteroid2Coord.y))
    return true;
  return false;
}

function FindAsteroidsBetween(aAsteroid1Coord, aAsteroid2Coord, aAsteroids) {
  let f = ComputeFormula(aAsteroid1Coord, aAsteroid2Coord);

  for (let i = 0; i < aAsteroids.length; i++) {
    let middleAsteroidCoord = aAsteroids[i];

    if (middleAsteroidCoord.d)
      continue;

    if (IsSame(middleAsteroidCoord, aAsteroid1Coord) ||
      IsSame(middleAsteroidCoord, aAsteroid2Coord))
      continue;

    if (f.m === undefined) {
      if (PointIsBetween(middleAsteroidCoord, aAsteroid1Coord, aAsteroid2Coord)) {
        return true;
      }
    }
    else {
      let y = (f.m * middleAsteroidCoord.x + f.b);

      if ((Math.abs(middleAsteroidCoord.y - y) < 0.001) &&
        PointIsBetween2(middleAsteroidCoord, aAsteroid1Coord, aAsteroid2Coord))
        return true;
    }
  }

  return false;
}

function CountReachable(aAsteroidCoord, aAsteroids, aLog) {

  let reachable = [];
  for (let i = 0; i < aAsteroids.length; i++) {
    let asteroidCoord = asteroids[i];

    if (IsSame(aAsteroidCoord, asteroidCoord))
      continue;

    let f = ComputeFormula(aAsteroidCoord, asteroidCoord);

    let found = FindAsteroidsBetween(aAsteroidCoord, asteroidCoord, aAsteroids);

    if (aLog)
      console.log(JSON.stringify(aAsteroidCoord) + " " + JSON.stringify(asteroidCoord) + "--> y=" + f.m + "*x + " + f.b + " " + found);

    if (!found) 
    {
      aAsteroidCoord.count++;
      reachable.push(asteroidCoord);
    }
  }

  return reachable;
}

function ComputeMax(aMax, aElem) {
  if (aElem.count > aMax.count) {
    aMax.count = aElem.count;
    aMax.pt = aElem;
  }
  return aMax;
}

function FindStationLocation(aAsteroids) {
  for (let i = 0; i < aAsteroids.length; i++)
    CountReachable(aAsteroids[i], aAsteroids, true)
}

function Find200th(aAsteroidCoord, aAsteroids) {
  let count = 0;
  while (1) {
    for (let i = 0; i < aAsteroids.length; i++) {
      let asteroid = aAsteroids[i];

      if (asteroid.d)
        continue;

      if (IsSame(aAsteroidCoord, asteroid))
        continue;

      if (!FindAsteroidsBetween(aAsteroidCoord, asteroid, aAsteroids)) {
        count++;
        aAsteroidCoord.d = true;

        if (count == 200)
          return asteroid;
      }
    }
  }
}

function ComputeSlope(aPt1, aPt2) 
{
  return (aPt2.y - aPt1.y) / (aPt2.x - aPt1.x);
}

function ComputeAngle(aCenter, aPt1, aPt2) 
{
  let m1 = ComputeSlope(aCenter, aPt1);
  let m2 = ComputeSlope(aCenter, aPt2);

  let inc = 190 - Math.abs(Math.atan(m2) - Math.atan(m1));

  return inc;
}

function ComputeDistance(aPt1, aPt2) 
{
  let dist = Math.sqrt(Math.pow(aPt2.x - aPt1.x, 2) + Math.pow(aPt2.y - aPt1.y, 2));

  return dist;
}

function Sort360FromPoint(aCenter, aPt1, aPt2) {
  
  let rr = aCenter;
  rr.x += 1;

  let mCenter = ComputeSlope(rr, aCenter);
  let m1 = ComputeSlope(aPt1, aCenter);
  let m2 = ComputeSlope(aPt2, aCenter);

  if ((m1 === Infinity) || (m2 === Infinity))
  {
        
  }

  let inc1 = 360 - Math.abs(Math.atan(mCenter) - Math.atan(m1));
  let inc2 = 360 - Math.abs(Math.atan(mCenter) - Math.atan(m2));

  if (inc1 < inc2)
    return - 1;
  else if (inc1 > inc2)
    return 1;
  else 
    return 0;

  /*
  if (aPt1.x - aCenter.x >= 0 && aPt2.x - aCenter.x < 0)
    return -1;
  if (aPt1.x - aCenter.x < 0 && aPt2.x - aCenter.x >= 0)
    return 1;
  if (aPt1.x - aCenter.x == 0 && aPt2.x - aCenter.x == 0) {
    if (aPt1.y - aCenter.y >= 0 || aPt2.y - aCenter.y >= 0)
      return aPt1.y > aPt2.y ? 1 : -1;
    return aPt2.y > aPt1.y ? -1 : 1;
  }

  // compute the cross product of vectors (center -> a) x (center -> b)
  let det = (aPt1.x - aCenter.x) * (aPt2.y - aCenter.y) - (aPt2.x - aCenter.x) * (aPt1.y - aCenter.y);
  if (det < 0)
    return -1;
  if (det > 0)
    return 1;

  // points a and b are on the same line from the center
  // check which point is closer to the center
  let d1 = (aPt1.x - aCenter.x) * (aPt1.x - aCenter.x) + (aPt1.y - aCenter.y) * (aPt1.y - aCenter.y);
  let d2 = (aPt2.x - aCenter.x) * (aPt2.x - aCenter.x) + (aPt2.y - aCenter.y) * (aPt2.y - aCenter.y);
  return d1 > d2 ? -1 : 1;*/
}

function Sort360FromPoint2(aPt1, aPt2) 
{
  let d1 = Math.atan2(aPt1.x, aPt1.y);
  let d2 = Math.atan2(aPt2.x, aPt2.y);

  if (d1 < d2)
    return 1;
  else if (d1 > d2)
    return -1;
  else
    return 0;
}

console.log(asteroids);

//console.log(ComputeFormula({ x: 8, y: 6 }, { x: 2, y: 3 }));

var testPoint = { x: 11, y: 13, count: 0 };

//CountReachable(testPoint, asteroids);

//console.log(testPoint.count);

FindStationLocation(asteroids);

console.log(asteroids);

//var rr = util.CopyObject(asteroids);

var max = asteroids.reduce(ComputeMax, { count: 0, pt: null });

console.log(max);

//var origin = { x: max.x, y: max.y};
var origin = { x: max.x, y: max.y };

//console.log(ComputeAngle(origin, pt1, pt2));

var r = CountReachable(origin, asteroids, false);

r.sort(Sort360FromPoint2);

console.log(r);

console.log(r[199]);

//console.log(Find200th(origin , rr));