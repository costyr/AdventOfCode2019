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

function AddPoint(aPoints, aX, aY, aLength, aMin) 
{
  let found = false;
  for (let i = 0; i < aPoints.length; i++)
   if ((aPoints[i].x == aX) && (aPoints[i].y == aY)) 
   {
     if (aMin != null) 
     {
       aPoints[i].l += aLength;

       let dist = Math.abs(originX - aPoints[i].x) + Math.abs(originY - aPoints[i].y);
       if (dist < aMin.dist) 
         aMin.dist = dist;
   
       if (points[i].l < aMin.len)
         aMin.len = aPoints[i].l;
     }
     found = true;
     break;
   }

  if (!found)
    aPoints.push({ "x": aX, "y": aY, "l": aLength });
}

function AddDirection(aPoints, aPt, aDirInst, aLen) 
{
  for (let i = 0; i < aDirInst.count; i++) 
  {
    if (aDirInst.dir == 'L')
      aPt.x--;
    else if (aDirInst.dir == 'R')
      aPt.x++;
    else if (aDirInst.dir == 'U')
      aPt.y++;
    else 
      aPt.y--;
    AddPoint(aPoints, aPt.x, aPt.y, ++aLen, null);
  }

  return aLen;
}

const originX = 1;
const originY = 1;

var points = [];

var min = { "dist": Number.MAX_SAFE_INTEGER, "len": Number.MAX_SAFE_INTEGER };

for (let l = 0; l < input.length; l++) 
{
  let ptLen = 0;
  let segmentPoints = [];
  let o = { "x": originX, "y": originY };
  for (let k = 0; k < input[l].length; k++)
    ptLen = AddDirection(segmentPoints, o, input[l][k], ptLen);
  
  for (let j = 0; j < segmentPoints.length; j++)
    AddPoint(points, segmentPoints[j].x, segmentPoints[j].y, segmentPoints[j].l, min);
}

console.log("Min distance: " + min.dist);
console.log("Min length: " + min.len);
