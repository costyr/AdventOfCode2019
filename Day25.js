const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');
const readlineSync = require('readline-sync');

class ASCIIComputer {
  constructor() {
    this.mInputStreamPos = 0;
    this.mInputStream = [];
  }

  IsEndOfStream() {
    return false;
  }

  Read() {

    if (this.mInputStreamPos >= this.mInputStream.length) 
    {
      let line = readlineSync.question("");
      this.ConvertToAscii(line);
    }

    let input = this.mInputStream[this.mInputStreamPos++];
    return input;     
  }

  Write(aValue) {
    process.stdout.write(String.fromCharCode(aValue));
  }

  ConvertToAscii(aInstruction) {
    for (let i = 0; i < aInstruction.length; i++)
    {
      this.mInputStream.push(aInstruction[i].charCodeAt(0));
    }

    this.mInputStream.push(10);
  }
}

var inst = util.MapInput('./Day25Input.txt', util.ParseInt, ',');

var comp = new ASCIIComputer();

let prog = new intcodeComputer.IntcodeProgram(inst, comp, comp);

prog.Run();
