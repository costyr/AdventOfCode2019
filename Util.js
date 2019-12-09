const fs = require('fs');

function ComputeMapFilePath(aFilePath) {
  let index = aFilePath.lastIndexOf('.');
  let mapFilePath = aFilePath.substr(0, index);
  mapFilePath += "Map.txt";

  return mapFilePath;
}

function CopyObject(aObject) {
  return JSON.parse(JSON.stringify(aObject));
}

function ParseCoordElem(aMax, aElem) 
{
  let coords = aElem.split(', ');

  let x = parseInt(coords[0]);
  let y = parseInt(coords[1]);

  if (x > aMax.x)
    aMax.x = x;

  if (y > aMax.y)
    aMax.y = y;

  return { "x": x, "y": y };
}

function ParseInt(aElem) 
{
  return parseInt(aElem);
}

function SplitInput(aFilePath, aSep) 
{
  let rawInput = fs.readFileSync(aFilePath);

  return rawInput.toString().split(aSep);
}

function ReduceInput(aFilePath, aElemFunc, aTotal, aSep) 
{
  let inputArray = SplitInput(aFilePath, aSep);

  return inputArray.reduce(aElemFunc, aTotal);
}

function MapInput(aFilePath, aElemFunc, aSep) 
{
  let inputArray = SplitInput(aFilePath, aSep);

  return inputArray.map(aElemFunc);
}

function ComputeMax(aMax, aValue) 
{
  if (aValue > aMax)
    return aValue;
  return aMax;
}

module.exports = {
  ComputeMapFilePath,
  CopyObject,
  ParseCoordElem,
  ParseInt,
  SplitInput,
  ReduceInput,
  MapInput,
  ComputeMax
}
