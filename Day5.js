const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var inst = util.MapInput('./Day5Input.txt', util.ParseInt, ',');

var output1 = [];
intcodeComputer.RunProgram(inst, [ 1 ], output1);

var output2 = [];
intcodeComputer.RunProgram(inst, [ 5 ], output2);

console.log(output1);
console.log(output2);
