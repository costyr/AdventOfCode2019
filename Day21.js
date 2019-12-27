const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

function RenderOutput(aOutput) {

  if (aOutput.length == 1)
    return;

  let line = "";
  for (let i = 0; i < aOutput.length; i++)
    line += String.fromCharCode(aOutput[i]);
  return line;
}

function ConvertScriptInstructionsToAscii(aInstructions) {
  let asciiBuffer = [];
  for (let i = 0; i < aInstructions.length; i++)
  {
    for (let j = 0; j < aInstructions[i].length; j++)
      asciiBuffer.push(aInstructions[i][j].charCodeAt(0));
    asciiBuffer.push(10); 
  }

  return asciiBuffer;
}

var inst = util.MapInput('./Day21Input.txt', util.ParseInt, ',');

let script = [ 
  /*"NOT A J",
  "NOT B T",
  "AND T J",
  "NOT C T",
  "AND T J",
  "AND D J",*/
  "NOT A J",
  "NOT B T",
  "OR T J",
  "NOT C T",
  "OR T J",
  "AND D J",
  "WALK" ]; 

var rawInput = ConvertScriptInstructionsToAscii(script);

let input = new intcodeComputer.IntcodeIOStream(rawInput);
let output = new intcodeComputer.IntcodeIOStream([]);

var prog = new intcodeComputer.IntcodeProgram(inst, input, output);

prog.Run();

var rawOutput = output.Get();

console.log(RenderOutput(output.Get()));

if (rawOutput.length == 1)
  console.log(rawOutput[0]);