const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var inst = util.MapInput('./Day2Input.txt', util.ParseInt, ',');

function RunProgram(aInst, aNoum, aVerb) 
{
  let inst = util.CopyObject(aInst);

  inst[1] = aNoum;
  inst[2] = aVerb;

  let prog1 = new intcodeComputer.IntcodeProgram(inst, null, null);
  prog1.Run();

  return prog1.GetValueAtMemPos(0);
}

console.log(RunProgram(inst, 12, 2));

for (k = 0; k < 100; k++)
 for (j = 0; j < 100; j++) 
 {
  let result = RunProgram(inst, k, j);

  if (result == 19690720) 
  {
    console.log(100 * k + j);
    break;  
  }
}
