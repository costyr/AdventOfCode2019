const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

const ID_EMPTY = 0;
const ID_WALL = 1;
const ID_BLOCK = 2;
const ID_PADDLE = 3;
const ID_BALL = 4;

const DIR_NONE = 0;
const DIR_LEFT = -1;
const DIR_RIGHT = 1;

function ComputeBlockTiles(aOutput, aMap) 
{
  let count = 0;
  for (let i = 0; i < aOutput.length; i++)
    if ((i >= 2) && (((i + 1) % 3) == 0) && (aOutput[i] == ID_BLOCK))
      count ++;

  return count;
}

function ComputeMap(aOutput) 
{
  let outputOffset = 0;
  let x = 0;
  let y = 0;
  let id = 0;
  let map = [];
  for (let i = 0; i < aOutput.length; i++)
  {
    if (outputOffset == 0)
      x = aOutput[i];
    else if (outputOffset == 1)
      y = aOutput[i];
    else 
    {
      id = aOutput[i];
      outputOffset = -1;

      if (map[y] == undefined)
        map[y] = [];
      map[y][x] = id;
    }

    outputOffset++;
  }

  return map;
}

function PrintMap(aMap) 
{
  for (let i = 0; i < aMap.length; i++)
  {
    let line = "";
    for (let j = 0; j < aMap[i].length; j++)
    {
      if (aMap[i][j] == ID_EMPTY)
        line += " ";
      else if (aMap[i][j] == ID_WALL)
        line += "W";
      else if (aMap[i][j] == ID_BLOCK)
        line += "B";
      else if (aMap[i][j] == ID_PADDLE)
        line += "P";
      else if (aMap[i][j] == ID_BALL)
        line += "O";
      else 
        line += " ";
    }

    console.log(line);
  }
}

function ComputeInputForMaxScore(aMap) 
{
    
}

var inst = util.MapInput('./Day13Input.txt', util.ParseInt, ',');

var input1 = new intcodeComputer.IntcodeIOStream([]);
var output1 = new intcodeComputer.IntcodeIOStream([]);
var prog1 = new intcodeComputer.IntcodeProgram(inst, input1, output1);
prog1.Run();

console.log(ComputeBlockTiles(output1.Get()));
PrintMap(ComputeMap(output1.Get()));

/*var input2 = ComputeInputForMaxScore(output1.Get());
var output2 = new intcodeComputer.IntcodeIOStream([]);
var prog2 = new intcodeComputer.IntcodeProgram(inst, input2, output2);

prog2.SetValueAtMemPos(0, 2);

prog2.Run();*/
