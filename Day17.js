const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

const DIR_UP = "^".charCodeAt(0);
const DIR_DOWN = "v".charCodeAt(0);
const DIR_LEFT = "<".charCodeAt(0);
const DIR_RIGHT = ">".charCodeAt(0);

class ScaffoldingControl {
  constructor() {
    this.mMap = [];
    this.mPos = 0;
    this.mStart = { x: 0, y: 0, code: '' };
  }

  IsEndOfStream() {
    return false;
  }

  Read() {
    return 0;
  }

  Write(aValue) {

    if (aValue == 10) {
      this.mPos++;
    }
    else {
      if (this.mMap[this.mPos] == undefined)
        this.mMap[this.mPos] = [];

      let charCode = String.fromCharCode(aValue);
      this.mMap[this.mPos].push(charCode);

      if ((charCode == '^') ||
        (charCode == 'v') ||
        (charCode == '<') ||
        (charCode == '>')) {
        this.mStart = { x: this.mMap[this.mPos].length - 1, y: this.mPos, d: aValue };
      }
    }
  }

  PrintMap() {
    for (let i = 0; i < this.mMap.length; i++) {
      let line = "";
      for (let j = 0; j < this.mMap[i].length; j++)
        line += this.mMap[i][j];
      console.log(line);
    }
  }

  GetMapValue(aX, aY) {
    if ((aX >= 0) && (aX < this.mMap[0].length) &&
      (aY >= 0) && (aY < this.mMap.length))
      return this.mMap[aY][aX];
    return ".";
  }

  IsIntersection(aX, aY) {
    if (this.mMap[aY][aX] == "#") {
      let top = this.GetMapValue(aX, aY - 1);
      let bottom = this.GetMapValue(aX, aY + 1);
      let left = this.GetMapValue(aX - 1, aY);
      let right = this.GetMapValue(aX + 1, aY);

      if ((top == "#") &&
        (bottom == "#") &&
        (left == "#") &&
        (right == "#"))
        return true;
    }

    return false;
  }

  ComputeSumOfTheAlignmentParameters() {
    let total = 0;
    for (let i = 0; i < this.mMap.length; i++)
      for (let j = 0; j < this.mMap[i].length; j++) {
        if (this.IsIntersection(j, i))
          total += j * i;
      }
    return total;
  }

  GetNeighbors(aX, aY) {
    let top = this.GetMapValue(aX, aY - 1);
    let bottom = this.GetMapValue(aX, aY + 1);
    let left = this.GetMapValue(aX - 1, aY);
    let right = this.GetMapValue(aX + 1, aY);

    let neighbors = [];
    if (top == '#')
      neighbors.push({ x: aX, y: aY - 1, d: DIR_UP });
    if (bottom == '#')
      neighbors.push({ x: aX, y: aY + 1, d: DIR_DOWN });
    if (left == '#')
      neighbors.push({ x: aX - 1, y: aY, d: DIR_LEFT });
    if (right == '#')
      neighbors.push({ x: aX + 1, y: aY, d: DIR_RIGHT });

    return neighbors;
  }

  ComputeDirection(aPos, aNextPos) {
    if (aPos.d == DIR_UP) {
      if (aNextPos.d == DIR_LEFT)
        return DIR_LEFT;
      else if (aNextPos.d == DIR_RIGHT)
        return DIR_RIGHT;
    }
    else if (aPos.d == DIR_DOWN) {
      if (aNextPos.d == DIR_RIGHT)
        return DIR_LEFT;
      else if (aNextPos.d == DIR_LEFT)
        return DIR_RIGHT;
    }
    else if (aPos.d == DIR_LEFT) {
      if (aNextPos.d == DIR_UP)
        return DIR_RIGHT;
      else if (aNextPos.d == DIR_DOWN)
        return DIR_LEFT;
    }
    else if (aPos.d == DIR_RIGHT) {
      if (aNextPos.d == DIR_UP)
        return DIR_LEFT;
      else if (aNextPos.d == DIR_DOWN)
        return DIR_RIGHT;
    }
    else
      console.log("Invalid direction!");
  }

  AddToPath(aPath, aDirection) {
    console.log(aPath);
    if (aDirection >= DIR_LEFT) {
      aPath.push(aDirection);
      aPath.push(1);
    }
    else {
      let topPos = aPath.length - 1;
      if (aPath[topPos] == undefined)
        aPath[topPos] = 1;
      else {
        if (aPath[topPos] > 1)
          aPath.push(1);
        else
          aPath[topPos]++;
      }
    }
  }

  GetNext(aPos) {
    let neighbors = this.GetNeighbors(aPos.x, aPos.y);

    if (neighbors.length > 1) {
      let noDir = DIR_UP;
      if (aPos.d == DIR_LEFT)
        noDir = DIR_RIGHT;
      else if (aPos.d == DIR_RIGHT)
        noDir = DIR_LEFT;
      else if (aPos.d == DIR_UP)
        noDir = DIR_DOWN;

      for (let i = 0; i < neighbors.length; i++)
        if (neighbors[i].d == aPos.d)
          return neighbors[i];

      for (let i = 0; i < neighbors.length; i++)
        if (neighbors[i].d != noDir)
          return neighbors[i];
    }
    else {
      if (((aPos.d == DIR_UP) && (neighbors[0].d == DIR_DOWN)) ||
        ((aPos.d == DIR_DOWN) && (neighbors[0].d == DIR_UP)) ||
        ((aPos.d == DIR_LEFT) && (neighbors[0].d == DIR_RIGHT)) ||
        ((aPos.d == DIR_RIGHT) && (neighbors[0].d == DIR_LEFT)))
        return null;
      return neighbors[0];
    }
  }

  ComputePath() {
    let path = [];

    let pos = this.mStart;
    while (1) {
      let next = this.GetNext(pos);

      if (next == null)
        break;

      if (next.d != pos.d) {
        path.push(this.ComputeDirection(pos, next));
        path.push(1);
      }
      else
        path[path.length - 1]++;

      pos = next;
    }

    //console.log(path);

    return path;
  }

  PrintPath(aPath) {
    let line = "";
    for (let i = 0; i < aPath.length; i++) {
      if (line.length > 0)
        line += ", ";
      if (aPath[i] >= DIR_LEFT)
        line += (aPath[i] == DIR_LEFT) ? "L" : "R";
      else
        line += aPath[i].toString();
    }

    console.log(line);
  }

  SplitPath(aPath) {
    let functions = [];
    let maxBuffer = 20;
    do {
      functions = [];
      let func = [];
      for (let i = 0; i < aPath.length; i++) {
        if (func.length < maxBuffer) {
          func.push(aPath[i]);
          func.push(",".charCodeAt(0));
        }
        else {
          let found = (functions.length > 0) ? true : false;
          for (let j = 0; j < functions.length; j++) {
            if (functions[j].length != func.length) {
              found = false;
              break;
            }

            for (let k = 0; k < functions[j].length; k++)
              if (functions[j][k] != func[k]) {
                found = false;
                break;
              }
          }

          if (!found) {
            functions.push(func);
            func = [];
          }
        }
      }

      //console.log(functions.length);
      maxBuffer -= 2;
    }
    while (functions.length != 3);
    return functions;
  }
}

var inst = util.MapInput('./Day17Input.txt', util.ParseInt, ',');

var scaffoldingControl = new ScaffoldingControl();
var prog1 = new intcodeComputer.IntcodeProgram(inst, scaffoldingControl, scaffoldingControl);

prog1.Run();

scaffoldingControl.PrintMap();
console.log(scaffoldingControl.ComputeSumOfTheAlignmentParameters());

let path = scaffoldingControl.ComputePath();
scaffoldingControl.PrintPath(path);

//console.log(scaffoldingControl.SplitPath(path));

let rawInput = [
'A', ',', 'B', ',', 'B', ',', 'A', ',', 'B', ',', 'C', ',', 'A', ',', 'C', ',' , 'B', ',' , 'C', '\n', 
'L', ',', '4', ',', 'L', ',', '6', ',', 'L', ',', '8', ',', 'L', ',', '1', '2', '\n', 
'L', ',', '8', ',', 'R', ',', '1', '2', ',', 'L', ',', '1', '2', '\n', 
'R', ',', '1', '2', ',', 'L', ',', '6', ',', 'L', ',', '6', ',', 'L', ',', '8', '\n',
'n', '\n' ];

let line0 = ""
for (let i = 0; i < rawInput.length; i++) 
{
  if (line0.length > 0)
    line0 += " ";
  line0 += rawInput[i].charCodeAt(0);
  if (rawInput[i] == '\n')
    line0 += '\n';
}

console.log(line0);

let bb = [];
for (let i = 0; i < rawInput.length; i++)
  bb.push(rawInput[i].charCodeAt(0));

let input = new intcodeComputer.IntcodeIOStream(bb);
let output = new intcodeComputer.IntcodeIOStream([]);

var prog2 = new intcodeComputer.IntcodeProgram(inst, input, output);

prog2.SetValueAtMemPos(0, 2);

prog2.Run();

let progOutput = output.Get();

let line = "";
for (let i = 0; i < progOutput.length - 1; i++)
  line += String.fromCharCode(progOutput[i]);

console.log(line);

console.log(progOutput[progOutput.length - 1]);

