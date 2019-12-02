const util = require('./Util.js');

var inst = util.ParseInput('./Day2Input.txt', util.ParseInt, ',');

function RunProgram(aInst, aNoum, aVerb) 
{
  let inst = util.CopyObject(aInst);

  inst[1] = aNoum;
  inst[2] = aVerb;

  for (i = 0; i < inst.length; i += 4) 
  {
    let opCode = inst[i];
  
    if (opCode == 1)
    {
      let param1 = inst[inst[i + 1]];
      let param2 = inst[inst[i + 2]];
    
      inst[inst[i + 3]] = param1 + param2;
    }
    else if (opCode == 2)
    {
      let param1 = inst[inst[i + 1]];
      let param2 = inst[inst[i + 2]];
    
      inst[inst[i + 3]] = param1 * param2;
    }
    else if (opCode == 99)
      break;
  }

  return inst[0];
}

console.log("First problem result: " + RunProgram(inst, 12, 1));

for (k = 0; k < 100; k++)
 for (j = 0; j < 100; j++) 
 {
  let result = RunProgram(inst, k, j);

  if (result == 19690720) 
  {
    console.log("Second problem result: " + (100 * k + j));
    break;  
  }
}
