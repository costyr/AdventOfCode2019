const util = require('./Util.js');

var inst = util.MapInput('./Day5Input.txt', util.ParseInt, ',');

function GetParam(aInst, aMode, aPos) 
{
  return (aMode == 0) ? aInst[aInst[aPos]] : aInst[aPos];
}

function StoreResult(aInst, aMode, aPos, aValue) 
{
  if (aMode != 0)
  {
    console.log("Invalid param mode!");
    return false;
  }

  aInst[aInst[aPos]] = aValue;
  return true;
}

function SplitInstruction(aValue) 
{
  let codes = [];
  while (aValue > 0) 
  {
    codes.unshift(aValue % 10);
    aValue = Math.floor(aValue / 10);
  }

  for (let j = codes.length; j < 5; j++)
    codes.unshift(0);

  return codes;
}

function RunProgram(aInst, aInput, aOutput) 
{
  let inst = util.CopyObject(aInst);

  for (i = 0; i < inst.length;) 
  {
    let detail = SplitInstruction(inst[i]);
    
    let param3Mode = detail[0];
    let param2Mode = detail[1];
    let param1Mode = detail[2];

    let opCode = detail[3] * 10 + detail[4];  
  
    if (opCode == 1)
    {
      let param1 = GetParam(inst, param1Mode, i + 1);
      let param2 = GetParam(inst, param2Mode, i + 2);
    
      if (!StoreResult(inst, param3Mode, i + 3,  param1 + param2))
        break;

      i += 4;
    }
    else if (opCode == 2)
    {
      let param1 = GetParam(inst, param1Mode, i + 1);
      let param2 = GetParam(inst, param2Mode, i + 2);
    
      if (!StoreResult(inst, param3Mode, i + 3,  param1 * param2))
        break;

      i += 4;
    }
    else if (opCode == 3) 
    {
      if (!StoreResult(inst, param1Mode, i + 1, aInput))
        break;

      i += 2;
    }
    else if (opCode == 4) 
    {
      let param1 = GetParam(inst, param1Mode, i + 1);
      aOutput.push(param1);

      i += 2;
    }
    else if (opCode == 5)
    {
      let param1 = GetParam(inst, param1Mode, i + 1);
      let param2 = GetParam(inst, param2Mode, i + 2);
      if (param1)
      {
        i = param2;
      }
      else
        i += 3; 
    }
    else if (opCode == 6)
    { 
      let param1 = GetParam(inst, param1Mode, i + 1);
      let param2 = GetParam(inst, param2Mode, i + 2);
      if (param1 == 0)
      {
        i = param2;
      }
      else
        i += 3;
    }
    else if (opCode == 7)
    {
      let param1 = GetParam(inst, param1Mode, i + 1);
      let param2 = GetParam(inst, param2Mode, i + 2);

      if (!StoreResult(inst, param3Mode, i + 3, (param1 < param2) ? 1 : 0))
        break;

      i += 4; 
    }
    else if (opCode == 8)
    {
      let param1 = GetParam(inst, param1Mode, i + 1);
      let param2 = GetParam(inst, param2Mode, i + 2);

      if (!StoreResult(inst, param3Mode, i + 3, (param1 == param2) ? 1 : 0))
        break;

      i += 4;
    }
    else if (opCode == 99)
      break;
    else 
    {
      console.log("Invalid instruction!");
      break
    }
  }

  return inst[0];
}

var output1 = [];
RunProgram(inst, 1, output1);

var output2 = [];
RunProgram(inst, 5, output2);

console.log(output1);
console.log(output2);
