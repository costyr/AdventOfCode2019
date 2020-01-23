const util = require('./Util.js');
const matrix = require('./Matrix.js');
const intcodeComputer = require('./IntcodeComputer.js');

function ConstructCoords(aWidth, aHeight) 
{
  let coords = [];
  for (let i = 0; i < aWidth; i++)
    for (let j = 0; j < aHeight; j++) 
    {
      coords.push(j);
      coords.push(i);
    }
  return coords;
}

function DiscoverBeam(aWidth, aHeight) 
{
  let total = 0;
  let coords = ConstructCoords(aWidth, aHeight)
  for (let i = 0; i < coords.length - 2; i+=2) 
  {
    let input = new intcodeComputer.IntcodeIOStream([coords[i], coords[i+1]]);
    let output = new intcodeComputer.IntcodeIOStream([]);

    var prog1 = new intcodeComputer.IntcodeProgram(inst, input, output);

    prog1.Run();

    let progOutput = output.Get();

    for (let i = 0; i < progOutput.length; i++)
      if (progOutput[i] == 1)
        total++;
  }

  return total;
}

function PrintBeam(aWidth, aHeight) 
{
  let map = new matrix.Matrix(aWidth, aHeight, '.');

  let coords = ConstructCoords(aWidth, aHeight)
  for (let i = 0; i < coords.length - 2; i+=2) 
  {
    let x = coords[i];
    let y = coords[i+1];
    let input = new intcodeComputer.IntcodeIOStream([x, y]);
    let output = new intcodeComputer.IntcodeIOStream([]);

    var prog1 = new intcodeComputer.IntcodeProgram(inst, input, output);

    prog1.Run();

    let progOutput = output.Get();

    if (progOutput[0] == 1)
      map.SetValue(x, y, '#');
  }

  return map;
}

function FindSquareOnMap(aMap, aMapWidth, aSquare) 
{
  for (let i = 0; i < aMapWidth; i++)
   for (let j = 0; j < aMapWidth; j++)
   {
     if (((i + aSquare) > aMapWidth) ||
         ((j + aSquare) > aMapWidth))
       continue;

     let foundLine = true;
     for (let x = j; x < j + aSquare; x++) 
       if (aMap.GetValue(i, x) != '#') 
       {
         foundLine = false;
         break;
       }

     if (!foundLine)
       continue;

     let foundCol = true;
     for (let y = i; y < i + aSquare; y++) 
       if (aMap.GetValue(y, j) != '#') 
       {
         foundCol = false;
         break;
       } 

     if (foundCol)
       return i * 10000 + j;       
   }
   
  return -1;
}

function FindClosestFit(aSquare) 
{
  //for (let i = 900; i < 1000; i++)
  //{
    let map = PrintBeam(2000, 2000);
    //console.log("Printed map!");
    let ret = FindSquareOnMap(map, 2000, aSquare);
    if (ret != -1)
      return ret;
  //}
  
  return -1;
}

var inst = util.MapInput('./Day19Input.txt', util.ParseInt, ',');

console.log(DiscoverBeam(50, 50));

let map = PrintBeam(100, 100);

//map.PrintReverse();

console.log(FindClosestFit(100));
