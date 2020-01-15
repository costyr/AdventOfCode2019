const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

function RenderOutput(aOutput) {

  if (aOutput.length == 1)
    return;

  let line = "";
  for (let i = 0; i < aOutput.length; i++)
  {
    if (aOutput[i] > 127)
      line += aOutput[i].toString();
    else
      line += String.fromCharCode(aOutput[i]);
  }
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
  "NOT A J",
  "NOT B T",
  "OR T J",
  "NOT C T",
  "OR T J",
  "AND D J",
  "RUN" ]; 

var rawInput = ConvertScriptInstructionsToAscii(script);

let input = new intcodeComputer.IntcodeIOStream(rawInput);
let output = new intcodeComputer.IntcodeIOStream([]);

var prog = new intcodeComputer.IntcodeProgram(inst, input, output);

prog.Run();

console.log(RenderOutput(output.Get()));
