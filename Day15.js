const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

const ID_WALL = 0;
const ID_MOVED = 1;
const ID_OXYGEN_SYSTEM = 2;

const EMPTY = 0;
const WALL = 1;
const NO_PATH = 3;

const DIR_NORTH = 1;
const DIR_SOUTH = 2;
const DIR_WEST = 3;
const DIR_EAST = 4;

class Node {
  constructor(aX, aY, aDir) {
    this.mX = aX;
    this.mY = aY;
    this.mDir = aDir;
    this.mPath = [];
  }
}

class RemoteControl {
  constructor() {
    this.mX = 0;
    this.mY = 0;
    this.mDir = DIR_NORTH;
    this.mPath = [];
    this.mMap = [];
  }

  StopProgram() 
  {
    return false;
  }

  IsEndOfStream() {
    return false;
  }

  Read() {
    return this.mDir;
  }

  Write(aValue) {

    if (aValue == ID_MOVED)
    {
      if (this.mDir == DIR_NORTH)
        this.mY++;
      else if (this.mDir == DIR_SOUTH)
        this.mY--;
      else if (this.mDir == DIR_WEST)
        this.mX--;
      else if (this.mDir == DIR_EAST)
        this.mX++;
      
      this.AddToMap(this.mX, this.mY, EMPTY);
    }
    else if (aValue == ID_WALL)
    {
      if (this.mDir == DIR_NORTH)
        this.AddToMap(this.mX, this.mY + 1, WALL);
      else if (this.mDir == DIR_SOUTH)
        this.AddToMap(this.mX, this.mY - 1, WALL);
      else if (this.mDir == DIR_WEST)
        this.AddToMap(this.mX - 1, this.mY, WALL);
      else if (this.mDir == DIR_EAST)
        this.AddToMap(this.mX + 1, this.mY, WALL);
      else
        console.log("Invalid direction!" + ID_WALL);
    }
    else if (aValue == ID_OXYGEN_SYSTEM)
    {
      if (this.mDir == DIR_NORTH)
        this.AddToMap(this.mX, this.mY + 1, ID_OXYGEN_SYSTEM);
      else if (this.mDir == DIR_SOUTH)
        this.AddToMap(this.mX, this.mY - 1, ID_OXYGEN_SYSTEM);
      else if (this.mDir == DIR_WEST)
        this.AddToMap(this.mX - 1, this.mY, ID_OXYGEN_SYSTEM);
      else if (this.mDir == DIR_EAST)
        this.AddToMap(this.mX + 1, this.mY, ID_OXYGEN_SYSTEM);
      else
        console.log("Invalid direction!");

      console.log("Oxygen system! " + this.mMap.length);
    }

    let posNorth = this.GetNext(this.mX, this.mY, DIR_NORTH);
    let posSouth = this.GetNext(this.mX, this.mY, DIR_SOUTH);
    let posWest = this.GetNext(this.mX, this.mY, DIR_WEST);
    let posEast = this.GetNext(this.mX, this.mY, DIR_EAST);

    let dirs = [posNorth, posSouth, posWest, posEast];
    let validDirs = 0;
    for (let i = 0; i < dirs; i++)
      if (dirs[i] == EMPTY)
        validDirs ++;
    
    if (validDirs <= 1)
      this.AddToMap(this.mX, this.mY, NO_PATH);
    
    if (posNorth == EMPTY)
      this.mDir = DIR_NORTH;
    else if (posSouth == EMPTY)
      this.mDir = DIR_SOUTH;
    else if (posWest == EMPTY)
      this.mDir = DIR_WEST;
    else if (posEast == EMPTY)
      this.mDir = DIR_EAST;
    else
      console.log("Invalid position!");
  }

  GetNext(aX, aY, aDir) 
  {
    if (aDir == DIR_NORTH)
      aY++;
    else if (aDir == DIR_SOUTH)
      aY--;
    else if (aDir == DIR_WEST)
      aX--;
    else if (aDir == DIR_EAST)
      aX++;

    let mapPos = this.FindMapPoint(aX, aY);
    if (mapPos)
      return mapPos.v;
    return EMPTY;
  }

  FindMapPoint(aX, aY) 
  {
    for (let i = 0; i < this.mMap.length; i++)
      if ((this.mMap[i].x == aX) && (this.mMap[i].y == aY))
        return this.mMap[i];

    return null;
  }

  AddToMap(aX, aY, aValue) 
  {
    console.log(aX + " " + aY + "-->" + aValue);
    let mapPos = this.FindMapPoint(aX, aY);
    if (mapPos)
    {
      if (mapPos.v != aValue)
        mapPos.v = aValue;
    }
    else
      this.mMap.push({ x: aX, y: aY, v: aValue});
  }

  PrintMap()
  {
    console.log(this.mMap);
  }
}

var inst = util.MapInput('./Day15Input.txt', util.ParseInt, ',');

var remoteControl = new RemoteControl();
var prog1 = new intcodeComputer.IntcodeProgram(inst, remoteControl, remoteControl);

prog1.Run();

remoteControl.PrintMap();
