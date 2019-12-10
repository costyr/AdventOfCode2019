const util = require('./Util.js');

function ParseLine(aLine) {
  return aLine.split("");
}

var map = util.MapInput('./Day10Input.txt', ParseLine, '\r\n');

function FindAsteroids(aMap, aAsteroids) {
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (aMap[y][x] == '#')
        aAsteroids.push({ "x": x, "y": y, "reachable": [] });
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

function CountReachable(aAsteroidCoord, aAsteroids) 
{
  for (let i = 0; i < aAsteroids.length; i++) {
    let asteroidCoord = asteroids[i];

    if (IsSame(aAsteroidCoord, asteroidCoord))
      continue;

    let f = ComputeFormula(aAsteroidCoord, asteroidCoord);

    let found = FindAsteroidsBetween(aAsteroidCoord, asteroidCoord, aAsteroids);

    if (!found) 
      aAsteroidCoord.reachable.push( { x: asteroidCoord.x, y: asteroidCoord.y});
  }
}

function ComputeMax(aMax, aElem) {
  if (aElem.reachable.length > aMax.count) {
    aMax.count = aElem.reachable.length;
    aMax.asteroid = aElem;
  }
  return aMax;
}

function FindStationLocation(aAsteroids) {
  for (let i = 0; i < aAsteroids.length; i++)
    CountReachable(aAsteroids[i], aAsteroids)
}

function Sort360FromPoint(aOrigin, aPt1, aPt2) 
{
  let d1 = Math.atan2(aPt1.x - aOrigin.x, aPt1.y - aOrigin.y);
  let d2 = Math.atan2(aPt2.x - aOrigin.x, aPt2.y - aOrigin.y);

  if (d1 < d2)
    return 1;
  else if (d1 > d2)
    return -1;
  else
    return 0;
}

FindStationLocation(asteroids);

var station = asteroids.reduce(ComputeMax, { count: 0, asteroid: null });

console.log(station.count);

var origin = { x: station.asteroid.x, y: station.asteroid.y };

station.asteroid.reachable.sort(Sort360FromPoint.bind(null, origin));

console.log(station.asteroid.reachable[199].x * 100 + station.asteroid.reachable[199].y);
