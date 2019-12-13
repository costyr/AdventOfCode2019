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

function ComputeBlockTiles(aOutput) 
{
  let count = 0;
  for (let i = 0; i < aOutput.length; i++)
    if ((i >= 2) && (((i + 1) % 3) == 0) && (aOutput[i] == ID_BLOCK))
      count ++;

  return count;
}

var inst = util.MapInput('./Day13Input.txt', util.ParseInt, ',');

var input1 = new intcodeComputer.IntcodeIOStream([]);
var output1 = new intcodeComputer.IntcodeIOStream([]);
var prog1 = new intcodeComputer.IntcodeProgram(inst, input1, output1);
prog1.Run();

console.log(ComputeBlockTiles(output1.Get()));

console.log(count);

class GameState 
{
  constructor(aX, aY, aColor)
  {
    this.mX = aX;
    this.mY = aY;
    this.mId = aColor;
    this.mPath = [];
    this.mOutputOffset = 0;
  }

  IsEndOfStream() 
  {
    return false;
  }

  Read() {
    return this.GetPanelColor(this.mX, this.mY);
  }

  Write(aValue) 
  {
    if (this.mOutputOffset >= 2) 
    {
      this.AddPath({ x: this.mX, y: this.mY, id: this.mId });

      if (this.mDirection == DIR_UP)
      {
        if (aValue == DIR_LEFT)
        {
          this.mDirection = DIR_LEFT;
          this.mX -= 1;
        } 
        else if (aValue == DIR_RIGHT)
        {
          this.mDirection = DIR_RIGHT;
          this.mX += 1;
        } 
      }
      else if (this.mDirection == DIR_DOWN)
      {
        if (aValue == DIR_LEFT)
        {
          this.mDirection = DIR_RIGHT;
          this.mX += 1;
        } 
        else if (aValue == DIR_RIGHT)
        {
          this.mDirection = DIR_LEFT;
          this.mX -= 1;
        } 
      }
      else if (this.mDirection == DIR_LEFT)
      {
        if (aValue == DIR_LEFT)
        {
          this.mDirection = DIR_DOWN;
          this.mY -= 1;
        } 
        else if (aValue == DIR_RIGHT)
        {
          this.mDirection = DIR_UP;
          this.mY += 1;
        }   
      }
      else if (this.mDirection == DIR_RIGHT) 
      {
        if (aValue == DIR_LEFT)
        {
          this.mDirection = DIR_UP;
          this.mY += 1;
        } 
        else if (aValue == DIR_RIGHT)
        {
          this.mDirection = DIR_DOWN;
          this.mY -= 1;
        }   
      }
      else
      {
        console.log("Invalid direction!");
      }

      this.mOutputOffset = 0;

      return;
    }

    this.mColor = aValue;

    this.mOutputOffset++;
  }

  AddPath(aValue) 
  {
    let found = false;
    for (let i = 0; i < this.mPath.length; i++)
    {
      if ((aValue.x == this.mPath[i].x) && (aValue.y == this.mPath[i].y))
      {
        this.mPath[i].color = aValue.color;
        found = true;
        break;
      }
    }

    if (!found)
      this.mPath.push(aValue);
  }

  GetPanelColor(aX, aY) 
  {
    if (this.mPath.length == 0)
      return this.mColor;

    for (let i = 0; i < this.mPath.length; i++)
      if ((aX == this.mPath[i].x) && (aY == this.mPath[i].y))
        return this.mPath[i].color;
    return COLOR_BLACK;
  }

  PrintPanels()
  {
    console.log(this.mPath.length);
  }
}

var input2 = new intcodeComputer.IntcodeIOStream([]);
var output2 = new intcodeComputer.IntcodeIOStream([]);
var prog2 = new intcodeComputer.IntcodeProgram(inst, input2, output2);

prog2.SetValueAtMemPos(0, 2);

prog2.Run();
