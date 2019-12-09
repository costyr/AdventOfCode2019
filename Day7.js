const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var acs = util.MapInput('./Day7Input.txt', util.ParseInt, ',');

//console.log(acs);

function RunPhaseSetting(aPhaseSetting) {
  let inputSignal = 0;
  for (let i = 0; i < aPhaseSetting.length; i++) {
    let input = new intcodeComputer.IntcodeIOStream([aPhaseSetting[i], inputSignal]);
    let output = new intcodeComputer.IntcodeIOStream([]);
    let prog = new intcodeComputer.IntcodeProgram(acs, input, output);
    prog.Run();
    inputSignal = output.Get()[0];
  }

  return inputSignal;
}

function InitAmplifierInput(aPhaseSetting, aIndex) 
{
  let initialInput = [aPhaseSetting];
  if (aIndex == 0)
    initialInput.push(0);
  return new intcodeComputer.IntcodeIOStream(initialInput);
}

function RunPhaseSetting2(aPhaseSetting) {
  let amplifierInput = aPhaseSetting.map(InitAmplifierInput);

  let amplifiers = [];
  for (let i = 0; i < aPhaseSetting.length; i++)
    amplifiers.push(new intcodeComputer.IntcodeProgram(acs, amplifierInput[i], amplifierInput[i == (aPhaseSetting.length - 1) ? 0 : i + 1]));

  let stopped = 0;
  do {
    for (let i = 0; i < amplifiers.length; i++)
      if (amplifiers[i].Run() == intcodeComputer.ERROR_PROGRAM_HALTED)
        stopped++;
  }
  while (stopped < amplifiers.length);

  let amplifierEOutput = amplifierInput[0].Get();
  amplifierEOutput.shift();
  amplifierEOutput.shift();
  let maxSignal = amplifierEOutput.reduce(util.ComputeMax);

  return maxSignal;
}

function IsValidPhaseSetting(aSetting, aPhaseSettings) {
  for (let i = 0; i < aPhaseSettings.length; i++)
    if (aSetting == aPhaseSettings[i])
      return false;

  return true;
}

function ComputeAplifiers(aStart, aEnd, aPhase2) {
  let phaseSetting = [];
  let maxOutput = 0;
  for (i0 = aStart; i0 < aEnd; i0++)
    for (i1 = aStart; i1 < aEnd; i1++) {
      if (!IsValidPhaseSetting(i1, [i0]))
        continue;
      for (i2 = aStart; i2 < aEnd; i2++) {
        if (!IsValidPhaseSetting(i2, [i0, i1]))
          continue;
        for (i3 = aStart; i3 < aEnd; i3++) {
          if (!IsValidPhaseSetting(i3, [i0, i1, i2]))
            continue;
          for (i4 = aStart; i4 < aEnd; i4++) {
            if (!IsValidPhaseSetting(i4, [i0, i1, i2, i3]))
              continue;

            phaseSetting[0] = i0;
            phaseSetting[1] = i1;
            phaseSetting[2] = i2;
            phaseSetting[3] = i3;
            phaseSetting[4] = i4;

            let output = aPhase2 ? RunPhaseSetting2(phaseSetting) : RunPhaseSetting(phaseSetting);

            if (output > maxOutput)
              maxOutput = output;
          }
        }
      }
    }

  return maxOutput;
}

console.log(ComputeAplifiers(0, 5, false));
console.log(ComputeAplifiers(5, 10, true));
