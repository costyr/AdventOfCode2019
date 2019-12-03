const util = require('./Util.js');

function ParseDirection(aElem) 
{
  let direction = aElem.substr(0, 1);
  let count = parseInt(aElem.substr(1));

  return { "dir": direction, "count": count };
}

function ParseWire(aElem) 
{
  return aElem.split(',').map(ParseDirection);
}

var input = util.MapInput('./Day3Input.txt', ParseWire, '\r\n');

console.log(input);

function AddPoint(aPoints, aX, aY, aLength) 
{
  let found = false;
  for (let i = 0; i < aPoints.length; i++)
   if ((aPoints[i].x == aX) && (aPoints[i].y == aY)) 
   {
     found = true;
     aPoints[i].l += aLength;
     points[i].c += 1;
     break;
   }

  if (!found)
    aPoints.push({ "x": aX, "y": aY, "c": 0, "l": aLength });
}

function AddToSegment(aPoints, aX, aY, aLength) 
{
  let found = false;
  for (let i = 0; i < aPoints.length; i++)
   if ((aPoints[i].x == aX) && (aPoints[i].y == aY)) 
   {
     found = true;
     break;
   }

  if (!found)
    aPoints.push({ "x": aX, "y": aY, "l": aLength });
}

const originX = 1;
const originY = 1;

var points = [];
for (let l = 0; l < input.length; l++) 
{
  let ptLen = 0;
  let segmentPoints = [];
  let oX = originX;
  let oY = originY;
  for (let k = 0; k < input[l].length; k++)
  {
    let p = input[l][k];
  
    if (p.dir == 'L')
    {
      for (let i = 0; i < p.count; i++) 
      {
        oX--;
        AddToSegment(segmentPoints, oX, oY, ++ptLen);
      }
    }
    else if (p.dir == 'R')
    {
      for (let i = 0; i < p.count; i++) 
      {
        oX++;
        AddToSegment(segmentPoints, oX, oY, ++ptLen);
      }
    }
    else if (p.dir == 'U')
    {
      for (let i = 0; i < p.count; i++) 
      {
        oY++; 
        AddToSegment(segmentPoints, oX, oY, ++ptLen);
      }
    }
    else 
    {
      for (let i = 0; i < p.count; i++) 
      {
        oY--;
        AddToSegment(segmentPoints, oX, oY, ++ptLen);
      }
    }
  }
  
  for (let j = 0; j < segmentPoints.length; j++)
    AddPoint(points, segmentPoints[j].x, segmentPoints[j].y, segmentPoints[j].l);
}

var minDist = Number.MAX_SAFE_INTEGER;
var minLen = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < points.length; i++)
{
  if (points[i].c > 0)
  {
    let dist = Math.abs(originX - points[i].x) + Math.abs(originY - points[i].y);
    if (dist < minDist) 
      minDist = dist;

    if (points[i].l < minLen)
      minLen = points[i].l;
  }
}

console.log("Min distance: " + minDist);
console.log("Min length: " + minLen);