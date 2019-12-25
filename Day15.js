const util = require('./Util.js');
const matrix = require('./Matrix.js');
const intcodeComputer = require('./IntcodeComputer.js');

const ID_WALL = 0;
const ID_MOVED = 1;
const ID_OXYGEN_SYSTEM = 2;

const EMPTY = 0;
const WALL = 1;
const NOT_VISITED = 4;
const NO_PATH = 5;

const DIR_NORTH = 1;
const DIR_SOUTH = 2;
const DIR_WEST = 3;
const DIR_EAST = 4;

function IsValidDirection(aMap, aDirection) {
  let x = aDirection.x;
  let y = aDirection.y;
  if ((y < 0) || (y >= aMap.length) ||
    (x < 0) || (x >= aMap[y].length))
    return false;

  if (aMap[y][x] == '#' || aMap[y][x] == ' ')
    return false;

  return true;
}

function FindValidDirections(aMap, aPos) {
  let x = aPos.x;
  let y = aPos.y;

  let posTop = { x: x, y: y + 1 };
  let posBottom = { x: x, y: y - 1 };
  let posLeft = { x: x - 1, y: y };
  let posRight = { x: x + 1, y: y };

  let directions = [];
  if (IsValidDirection(aMap, posTop))
    directions.push(posTop);

  if (IsValidDirection(aMap, posBottom))
    directions.push(posBottom);

  if (IsValidDirection(aMap, posLeft))
    directions.push(posLeft);

  if (IsValidDirection(aMap, posRight))
    directions.push(posRight);

  return directions;
}

function GetCost(aCostMap, aPos) {
  if ((aCostMap[aPos.y] == undefined) ||
    (aCostMap[aPos.y][aPos.x] == undefined))
    return -1;
  return aCostMap[aPos.y][aPos.x];
}

function SetCost(aCostMap, aPos, aCost) {
  if (aCostMap[aPos.y] == undefined)
    aCostMap[aPos.y] = [];
  aCostMap[aPos.y][aPos.x] = aCost;
}

function ComputeLee(aMap, aStart) {
  let costMap = [];
  let stack = [aStart];

  SetCost(costMap, aStart, 0);

  let pos;
  while (stack.length > 0) {
    pos = stack.pop();

    let cost = GetCost(costMap, pos);

    let directions = FindValidDirections(aMap, pos);
    for (let i = 0; i < directions.length; i++) {
      if (GetCost(costMap, directions[i]) >= 0)
        continue;

      SetCost(costMap, directions[i], cost + 1);
      stack.push(directions[i]);
    }
  }

  return costMap;
}

class RemoteControl {
  constructor() {
    this.mX = 0;
    this.mY = 0;
    this.mDir = DIR_NORTH;
    this.mPath = [];
    this.mMap = [];
    this.mOxigenSystemPos = { x: 0, y: 0};
    this.mEndOfStream = false;
    this.mMinMax = null;
  }

  IsEndOfStream() {
    return this.mEndOfStream;
  }

  Read() {
    if (this.mDir > DIR_EAST || this.mDir < DIR_NORTH)
      console.log("Invalid position!");
    return this.mDir;
  }

  Write(aValue) {
    if ((aValue == ID_MOVED) || (aValue == ID_OXYGEN_SYSTEM))
    {
      if (this.mDir == DIR_NORTH)
        this.mY++;
      else if (this.mDir == DIR_SOUTH)
        this.mY--;
      else if (this.mDir == DIR_WEST)
        this.mX--;
      else if (this.mDir == DIR_EAST)
        this.mX++;
      
      this.AddToMap(this.mX, this.mY, (aValue == ID_MOVED) ? EMPTY : ID_OXYGEN_SYSTEM );

      if (aValue == ID_OXYGEN_SYSTEM) 
      {
        console.log("Oxygen system! " + this.mMap.length);
        this.mOxigenSystemPos = { x: this.mX, y: this.mY };
      }
    }
    else if (aValue == ID_WALL)
    {
      let x = this.mX;
      let y = this.mY;

      if (this.mDir == DIR_NORTH)
        y++;
      else if (this.mDir == DIR_SOUTH)
        y--;
      else if (this.mDir == DIR_WEST)
        x--;
      else if (this.mDir == DIR_EAST)
        x++;
      else
        console.log("Invalid direction!" + ID_WALL);

      this.AddToMap(x, y, WALL);
    }
    else
    {
      console.log("Invalid output code!");
    }

    let posNorth = this.GetNext(this.mX, this.mY, DIR_NORTH);
    let posSouth = this.GetNext(this.mX, this.mY, DIR_SOUTH);
    let posWest = this.GetNext(this.mX, this.mY, DIR_WEST);
    let posEast = this.GetNext(this.mX, this.mY, DIR_EAST);

    let dirs = [posNorth, posSouth, posWest, posEast];
    let validDirs = 0;
    for (let i = 0; i < dirs.length; i++)
      if (this.IsValidDir(dirs[i]))
        validDirs ++;
    
    if (validDirs == 0)
    {
      this.mEndOfStream = true;
      this.AddToMap(this.mOxigenSystemPos.x, this.mOxigenSystemPos.y, ID_OXYGEN_SYSTEM );
      this.mMinMax = this.GetMaxXY();
      return;
    }

    if (validDirs <= 1)
    {
      this.AddToMap(this.mX, this.mY, NO_PATH);

      if (this.IsValidDir(posNorth))
        this.mDir = DIR_NORTH;
      else if (this.IsValidDir(posSouth))
        this.mDir = DIR_SOUTH;
      else if (this.IsValidDir(posWest))
        this.mDir = DIR_WEST;
      else
        this.mDir = DIR_EAST;
    }
    else 
    {
      if (posNorth == NOT_VISITED)
        this.mDir = DIR_NORTH;
      else if (posSouth == NOT_VISITED)
        this.mDir = DIR_SOUTH;
      else if (posWest == NOT_VISITED)
        this.mDir = DIR_WEST;
      else if (posEast == NOT_VISITED)
        this.mDir = DIR_EAST;
      else 
      {
      if (posNorth == EMPTY)
        this.mDir = DIR_NORTH;
      else if (posSouth == EMPTY)
        this.mDir = DIR_SOUTH;
      else if (posWest == EMPTY)
        this.mDir = DIR_WEST;
      else if (posEast == EMPTY)
        this.mDir = DIR_EAST;
      else
      {
        if (posNorth == ID_OXYGEN_SYSTEM)
        this.mDir = DIR_NORTH;
      else if (posSouth == ID_OXYGEN_SYSTEM)
        this.mDir = DIR_SOUTH;
      else if (posWest == ID_OXYGEN_SYSTEM)
        this.mDir = DIR_WEST;
      else if (posEast == ID_OXYGEN_SYSTEM)
        this.mDir = DIR_EAST;
      }
      }
      
      //else
      //  console.log("Invalid position!");
    }

    //this.PrintMap({x: this.mX, y: this.mY});
  }

  IsValidDir(aDir) {
    return (aDir == EMPTY) || (aDir == ID_OXYGEN_SYSTEM) || (aDir == NOT_VISITED);
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
    return NOT_VISITED;
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
      //if (mapPos.v == ID_OXYGEN_SYSTEM)
      //  return;

      if (mapPos.v != aValue)
        mapPos.v = aValue;
    }
    else
      this.mMap.push({ x: aX, y: aY, v: aValue});
  }

  GetMaxXY() 
  {
    let maxX = 0;
    let minX = Number.MAX_SAFE_INTEGER;
    let maxY = 0;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this.mMap.length; i++)
    {
      maxX = Math.max(this.mMap[i].x, maxX);

      maxY = Math.max(this.mMap[i].y, maxY);

      minX = Math.min(this.mMap[i].x, minX);

      minY = Math.min(this.mMap[i].y, minY);
    }

    return { min: { x: minX, y: minY }, max: { x: maxX, y: maxY} };
  }

  PrintMap(aPos)
  {
    let minMax = this.mMinMax;

    let width = Math.abs(minMax.min.x) + Math.abs(minMax.max.x) + 1;
    let height = Math.abs(minMax.min.y) + Math.abs(minMax.max.y) + 1;

    let screen = new matrix.Matrix(width, height, ".");

    let pos = this.ConvertPosToMap(aPos);

    for (let i = 0; i < this.mMap.length; i++) 
    {
      let x = this.mMap[i].x + Math.abs(minMax.min.x);
      let y = this.mMap[i].y + Math.abs(minMax.min.y);

      if (this.mMap[i].v == WALL)
        screen.SetValue(y, x, "#");
      else if (this.mMap[i].v == ID_OXYGEN_SYSTEM)
        screen.SetValue(y, x, "o");

      if (pos.x == x && pos.y == y)
        screen.SetValue(y, x, "x");
    }

    return screen;
  }

  ConvertPosToMap(aPos) {
    let x = aPos.x + Math.abs(this.mMinMax.min.x);
    let y = aPos.y + Math.abs(this.mMinMax.min.y);

    return { x: x, y: y };
  }

  ComputeMinDistToOxygenSystem() {
    let map = this.PrintMap({ x: 0, y: 0 }).GetMatrix();

    let start = this.ConvertPosToMap({ x: 0, y: 0 });

    let oxygenSystem = this.ConvertPosToMap(this.mOxigenSystemPos);

    let costMap = ComputeLee(map, start);

    return costMap[oxygenSystem.y][oxygenSystem.x];
  }

  ComputeOxygenSpread() {
    let map = this.PrintMap({ x: 0, y: 0 }).GetMatrix();

    let oxygenSystem = this.ConvertPosToMap(this.mOxigenSystemPos);

    let costMap = ComputeLee(map, oxygenSystem);

    let oxygenSpreadTime = 0;
    for (let i = 0; i < costMap.length; i++)
    {
      if (costMap[i] == undefined)
        continue;
      for (let j = 0; j < costMap[i].length; j++)
      {
        if ((costMap[i][j] != undefined) && (costMap[j][i] > oxygenSpreadTime))
          oxygenSpreadTime = costMap[j][i];
      }
    }
    return oxygenSpreadTime;
  }
}

var inst = util.MapInput('./Day15Input.txt', util.ParseInt, ',');

var remoteControl = new RemoteControl();
var prog1 = new intcodeComputer.IntcodeProgram(inst, remoteControl, remoteControl);

prog1.Run();

remoteControl.PrintMap({ x: 0, y: 0 }).PrintReverse();

var minDist = remoteControl.ComputeMinDistToOxygenSystem();
console.log(minDist);

var oxygenSpreadTime = remoteControl.ComputeOxygenSpread();
console.log(oxygenSpreadTime);
