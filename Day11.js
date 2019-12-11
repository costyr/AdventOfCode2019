const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var inst = util.MapInput('./Day11Input.txt', util.ParseInt, ',');

const COLOR_BLACK = 0;
const COLOR_WHITE = 1;

const DIR_LEFT = 0;
const DIR_RIGHT = 1;
const DIR_UP = 2;
const DIR_DOWN = 3;

class PanelState 
{
  constructor(aX, aY, aColor)
  {
    this.mX = aX;
    this.mY = aY;
    this.mColor = aColor;
    this.mPath = [];
    this.mOutputOffset = 0;
    this.mDirection = DIR_UP;
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
    for (let i = 0; i < this.mPath.length; i++)
      if ((aX == this.mPath[i].x) && (aY == this.mPath[i].y))
        return this.mPath[i].color;
    return COLOR_BLACK;
  }

  WriteNotifier(aInput, aValue) 
  {
    if (this.mOutputOffset >= 1) 
    {
      this.AddPath({ x: this.mX, y: this.mY, color: this.mColor });

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

      aInput.Write(this.GetPanelColor(this.mX, this.mY));

      return;
    }

    this.mColor = aValue;

    this.mOutputOffset++;                
  }

  PrintPanels()
  {
    console.log(this.mPath.length);
  }

  GetMaxXY() 
  {
    let maxX = 0;
    let minX = Number.MAX_SAFE_INTEGER;
    let maxY = 0;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this.mPath.length; i++)
    {
      maxX = Math.max(this.mPath[i].x, maxX);

      maxY = Math.max(this.mPath[i].y, maxY);

      minX = Math.min(this.mPath[i].x, minX);

      minY = Math.min(this.mPath[i].y, minY);
    }

    return { min: { x: minX, y: minY }, max: { x: maxX, y: maxY} };
  }

  PrintMessage() 
  {
    let minMax = this.GetMaxXY();

    let width = Math.abs(minMax.min.x) + Math.abs(minMax.max.x) + 1;
    let height = Math.abs(minMax.min.y) + Math.abs(minMax.max.y) + 1;

    let screen = [];
    for (let i = 0; i < height; i++) 
    {
      screen[i] = [];
      for (let j = 0; j < width; j++)
        screen[i][j] = ".";
    }

    for (let i = 0; i < this.mPath.length; i++) 
    {
      let x = this.mPath[i].x + Math.abs(minMax.min.x);
      let y = this.mPath[i].y + Math.abs(minMax.min.y);

      if (this.mPath[i].color == COLOR_WHITE) 
        screen[y][x] = "#";
    }

    for (let i = height - 1; i >= 0; i--) 
    {
      let line = ""; 
      for (let j = 0; j < width; j++)
        line += screen[i][j];

      console.log(line);
    }
  }
}

var input1 = new intcodeComputer.IntcodeIOStream([0]);
var output1 = new intcodeComputer.IntcodeIOStream([]);

var panelState1 = new PanelState(0, 0, COLOR_BLACK);

output1.SetWriteNotifier(panelState1.WriteNotifier.bind(panelState1, input1));

var prog1 = new intcodeComputer.IntcodeProgram(inst, input1, output1);
prog1.Run();

panelState1.PrintPanels();

var input2 = new intcodeComputer.IntcodeIOStream([1]);
var output2 = new intcodeComputer.IntcodeIOStream([]);

var panelState2 = new PanelState(0, 0, COLOR_BLACK);

output2.SetWriteNotifier(panelState2.WriteNotifier.bind(panelState2, input2));

var prog2 = new intcodeComputer.IntcodeProgram(inst, input2, output2);
prog2.Run();

panelState2.PrintMessage();
