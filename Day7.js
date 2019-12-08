const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

var acs = util.MapInput('./Day7Input.txt', util.ParseInt, ',');

//console.log(acs);

function RunPhaseSetting(aPhaseSetting) 
{
  let inputSignal = 0;
  for (let i = 0; i < aPhaseSetting.length; i++)
  {
    let io = new intcodeComputer.IntcodeIO([ aPhaseSetting[i], inputSignal]);
    let prog = new intcodeComputer.IntcodeProgram(acs, io);
    prog.Run();
    inputSignal = io.GetOutput()[0];

    //console.log(output);
  }

  return inputSignal;
}

function AddInput(aIO, aOutput) 
{
  //console.log(aOutput);
  for (let i = 0; i < aOutput.length; i++)
     aIO.AddInput(aOutput[i]);
}

function RunPhaseSetting2(aPhaseSetting) 
{
  let ioA = new intcodeComputer.IntcodeIO([aPhaseSetting[0], 0]);
  let progA = new intcodeComputer.IntcodeProgram(acs, ioA);

  let ioB = new intcodeComputer.IntcodeIO([aPhaseSetting[1]]);
  let progB = new intcodeComputer.IntcodeProgram(acs, ioB);

  let ioC = new intcodeComputer.IntcodeIO([aPhaseSetting[2]]);
  let progC = new intcodeComputer.IntcodeProgram(acs, ioC);

  let ioD = new intcodeComputer.IntcodeIO([aPhaseSetting[3]]);
  let progD = new intcodeComputer.IntcodeProgram(acs, ioD);

  let ioE = new intcodeComputer.IntcodeIO([aPhaseSetting[4]]);
  let progE = new intcodeComputer.IntcodeProgram(acs, ioE);

  let stopped = 0;
  let maxSignal = 0;
  do {
   progA.Run();

   if (progA.GetErrorCode() == 2) {
    stopped ++; 
  }

   AddInput(ioB, ioA.GetOutput());
   ioA.Clear();

   progB.Run();

   if (progB.GetErrorCode() == 2) {
    stopped ++; 
  }

   AddInput(ioC, ioB.GetOutput());
   ioB.Clear();

   progC.Run();

   if (progC.GetErrorCode() == 2) {
     stopped ++; 
   }

   AddInput(ioD, ioC.GetOutput());

   ioC.Clear();

   progD.Run();

   if (progD.GetErrorCode() == 2) {
    stopped ++; 
  }

   AddInput(ioE, ioD.GetOutput());

   ioD.Clear();

   progE.Run();

   if (progE.GetErrorCode() == 2) {
     let outputE = ioE.GetOutput();
     for (let i = 0; i < outputE.length; i++)
       if (outputE[i] > maxSignal)
         maxSignal = outputE[i];
     stopped ++; 
   }

   
   AddInput(ioA, ioE.GetOutput());
   ioE.Clear();
    
  }
  while (stopped < 5);
  
  //console.log(maxSignal);
  return maxSignal;
}

function IsValidPhaseSetting(aSetting, aPhaseSettings) 
{
  for (let i = 0; i < aPhaseSettings.length; i++)
    if (aSetting == aPhaseSettings[i])
      return false;

  return true;
}

//console.log(RunPhaseSetting2([9,7,8,5,6]));

function ComputeAplifiers(aStart, aEnd, aPhase2) 
{
let phaseSetting = [];
let maxOutput = 0;
for (i0 = aStart; i0 < aEnd; i0++) 
  for (i1 = aStart; i1 < aEnd; i1++) 
  {
    if (!IsValidPhaseSetting(i1, [i0]))
      continue;
    for (i2 = aStart; i2 < aEnd; i2++) 
    {
      if (!IsValidPhaseSetting(i2, [i0, i1]))
        continue;
      for (i3 = aStart; i3 < aEnd; i3++)
      {
        if (!IsValidPhaseSetting(i3, [i0, i1, i2]))
          continue;
        for (i4 = aStart; i4 < aEnd; i4++) 
        {
          if (!IsValidPhaseSetting(i4, [i0, i1, i2, i3]))
          continue;

          phaseSetting[0] = i0;
          phaseSetting[1] = i1;
          phaseSetting[2] = i2;
          phaseSetting[3] = i3;
          phaseSetting[4] = i4;

          //console.log(phaseSetting);

          let output = aPhase2 ? RunPhaseSetting2(phaseSetting) : RunPhaseSetting(phaseSetting);

          if (output > maxOutput)
            maxOutput = output;
          //console.log(phaseSetting);
        }
      }
    }
  }

  return maxOutput;
}

//console.log(totalOutput);
console.log(ComputeAplifiers(0, 5, false));
console.log(ComputeAplifiers(5, 10, true));
