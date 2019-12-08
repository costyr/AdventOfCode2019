const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var inst = util.MapInput('./Day5Input.txt', util.ParseInt, ',');

var io1 = new intcodeComputer.IntcodeIO([1]);
var prog1 = new intcodeComputer.IntcodeProgram(inst, io1);
prog1.Run();

var io2 = new intcodeComputer.IntcodeIO([5]);
var prog2 = new intcodeComputer.IntcodeProgram(inst, io2);
prog2.Run(inst, io2);

console.log(io1.GetOutput());
console.log(io2.GetOutput());
