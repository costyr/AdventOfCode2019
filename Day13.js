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

class ArcadeCabinet {
  constructor() {
    this.mX = 0;
    this.mY = 0;
    this.mPaddlePos = { x: 0, y: 0};
    this.mPaddleDir = 0;
    this.mOutputOffset = 0;
    this.mScore = 0;
  }

  GetScore()
  {
    return this.mScore;
  }

  IsEndOfStream() {
    return false;
  }

  Read() {
    return this.mPaddleDir;
  }

  Write(aValue) {
    if (this.mOutputOffset == 0) 
    {
      this.mX = aValue;
      this.mOutputOffset++;
    }
    else if (this.mOutputOffset == 1) 
    {
      this.mY = aValue;
      this.mOutputOffset++;
    }
    else if (this.mOutputOffset == 2) 
    {
      this.mOutputOffset = 0;

      if ((this.mX == -1) && (this.mY == 0))
        this.mScore = aValue;
      else 
      {
        if (aValue == ID_PADDLE)
        {
          this.mPaddlePos = { x: this.mX, y: this.mY };
        }
        else if (aValue == ID_BALL)
        {
          if (this.mX > this.mPaddlePos.x)
            this.mPaddleDir = DIR_RIGHT;
          else if (this.mX < this.mPaddlePos.x)
            this.mPaddleDir = DIR_LEFT;
          else 
            this.mPaddleDir = DIR_NONE;
        }
      }  
    }
  }
}

var inst = util.MapInput('./Day13Input.txt', util.ParseInt, ',');

var output1 = new intcodeComputer.IntcodeIOStream([]);
var prog1 = new intcodeComputer.IntcodeProgram(inst, null, output1);
prog1.Run();

console.log(ComputeBlockTiles(output1.Get()));

//PrintMap(ComputeMap(output1.Get()));

var game = new ArcadeCabinet();
var prog2 = new intcodeComputer.IntcodeProgram(inst, game, game);

prog2.SetValueAtMemPos(0, 2);

prog2.Run();

console.log(game.GetScore());
