const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var inst = util.MapInput('./Day9Input.txt', util.ParseInt, ',');

var input1 = new intcodeComputer.IntcodeIOStream([1]);
var output1 = new intcodeComputer.IntcodeIOStream([]);
var prog1 = new intcodeComputer.IntcodeProgram(inst, input1, output1);
prog1.Run();

var input2 = new intcodeComputer.IntcodeIOStream([2]);
var output2 = new intcodeComputer.IntcodeIOStream([]);
var prog2 = new intcodeComputer.IntcodeProgram(inst, input2, output2);
prog2.Run();

output1.Print();
output2.Print();
