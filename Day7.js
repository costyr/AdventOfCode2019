const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var acs = util.MapInput('./Day7Input.txt', util.ParseInt, ',');

//console.log(acs);

function RunPhaseSetting(aPhaseSetting) 
{
  let inputSignal = 0;
  for (let i = 0; i < aPhaseSetting.length; i++)
  {
    let input = [ aPhaseSetting[i], inputSignal];
    let output = [];
    intcodeComputer.RunProgram(acs, input, output);
    inputSignal = output[0];

    //console.log(output);
  }

  return inputSignal;
}

function IsValidPhaseSetting(aSetting, aPhaseSettings) 
{
  for (let i = 0; i < aPhaseSettings.length; i++)
    if (aSetting == aPhaseSettings[i])
      return false;

  return true;
}

//console.log(RunPhaseSetting([0,1,2,3,4]));

var phaseSetting = [];
let maxOutput = 0;
for (i0 = 0; i0 < 5; i0++) 
  for (i1 = 0; i1 < 5; i1++) 
  {
    if (!IsValidPhaseSetting(i1, [i0]))
      continue;
    for (i2 = 0; i2 < 5; i2++) 
    {
      if (!IsValidPhaseSetting(i2, [i0, i1]))
        continue;
      for (i3 = 0; i3 < 5; i3++)
      {
        if (!IsValidPhaseSetting(i3, [i0, i1, i2]))
          continue;
        for (i4 = 0; i4 < 5; i4++) 
        {
          if (!IsValidPhaseSetting(i4, [i0, i1, i2, i3]))
          continue;

          phaseSetting[0] = i0;
          phaseSetting[1] = i1;
          phaseSetting[2] = i2;
          phaseSetting[3] = i3;
          phaseSetting[4] = i4;

          //console.log(phaseSetting);

          let output = RunPhaseSetting(phaseSetting);

          if (output > maxOutput)
            maxOutput = output;
          //console.log(phaseSetting);
        }
      }
    }
  }

//console.log(totalOutput);
console.log(maxOutput);
