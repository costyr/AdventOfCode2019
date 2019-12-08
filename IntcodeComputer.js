const util = require('./Util.js');

class IntcodeIO {
  constructor(aInput) {
    this.mInput = aInput;
    this.mInputOffset = 0;
    this.mOutput = [];
  }

  HasInput() {
    return this.mInputOffset < this.mInput.length;
  }

  GetInput() {
    if (!this.HasInput()) {
      console.log("IntcodeIO input invalid index: " + this.mInputOffset + " " + this.mInput);
      return;
    }

    let input = this.mInput[this.mInputOffset++];
    //console.log("input<--" + input);
    return input;
  }

  AddInput(aInput) {
    this.mInput.push(aInput);
  }

  ResetInputOffset() {
    this.mInputOffset = 0;
  }

  AddOutput(aOutput) {
    this.mOutput.push(aOutput);
  }

  GetOutput() {
    return this.mOutput;
  }

  Clear() {
    this.mOutput = [];
  }

  PrintOutput() {
    console.log(this.mOutput);
  }
}

function GetParam(aInst, aMode, aPos) {
  return (aMode == 0) ? aInst[aInst[aPos]] : aInst[aPos];
}

function StoreResult(aInst, aMode, aPos, aValue) {
  if (aMode != 0) {
    console.log("Invalid param mode!");
    return false;
  }

  aInst[aInst[aPos]] = aValue;
  return true;
}

function SplitInstruction(aValue) {
  let codes = [];
  while (aValue > 0) {
    codes.unshift(aValue % 10);
    aValue = Math.floor(aValue / 10);
  }

  for (let j = codes.length; j < 5; j++)
    codes.unshift(0);

  return codes;
}

class IntcodeProgram {

  constructor(aInst, aIO) {
    this.mInst = util.CopyObject(aInst);
    this.mIO = aIO;
    this.mInstPos = 0;
    this.mErrorCode = 0;
  }

  GetErrorCode() {
    return this.mErrorCode;
  }

  Run() {

    if (this.mErrorCode == 2)
      return 0;

    this.mErrorCode = 0;

    for (let i = this.mInstPos; i < this.mInst.length;) {
      let detail = SplitInstruction(this.mInst[i]);

      let param3Mode = detail[0];
      let param2Mode = detail[1];
      let param1Mode = detail[2];

      let opCode = detail[3] * 10 + detail[4];

      if (opCode == 1) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        let param2 = GetParam(this.mInst, param2Mode, i + 2);

        if (!StoreResult(this.mInst, param3Mode, i + 3, param1 + param2))
          break;

        i += 4;
      }
      else if (opCode == 2) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        let param2 = GetParam(this.mInst, param2Mode, i + 2);

        if (!StoreResult(this.mInst, param3Mode, i + 3, param1 * param2))
          break;

        i += 4;
      }
      else if (opCode == 3) {
        if (!this.mIO.HasInput())
        {
          this.mInstPos = i;
          this.mErrorCode = 1;
          return 1;
        }
        if (!StoreResult(this.mInst, param1Mode, i + 1, this.mIO.GetInput()))
          break;

        i += 2;
      }
      else if (opCode == 4) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        this.mIO.AddOutput(param1);

        i += 2;
      }
      else if (opCode == 5) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        let param2 = GetParam(this.mInst, param2Mode, i + 2);
        if (param1) {
          i = param2;
        }
        else
          i += 3;
      }
      else if (opCode == 6) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        let param2 = GetParam(this.mInst, param2Mode, i + 2);
        if (param1 == 0) {
          i = param2;
        }
        else
          i += 3;
      }
      else if (opCode == 7) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        let param2 = GetParam(this.mInst, param2Mode, i + 2);

        if (!StoreResult(this.mInst, param3Mode, i + 3, (param1 < param2) ? 1 : 0))
          break;

        i += 4;
      }
      else if (opCode == 8) {
        let param1 = GetParam(this.mInst, param1Mode, i + 1);
        let param2 = GetParam(this.mInst, param2Mode, i + 2);

        if (!StoreResult(this.mInst, param3Mode, i + 3, (param1 == param2) ? 1 : 0))
          break;

        i += 4;
      }
      else if (opCode == 99) 
      {
        this.mErrorCode = 2;
        break;
      }
      else {
        console.log("Invalid instruction!");
        break
      }
    }

    return this.mInst[0];
  }
}

module.exports = {
  IntcodeProgram,
  IntcodeIO
}
