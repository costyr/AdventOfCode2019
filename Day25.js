const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');
const readlineSync = require('readline-sync');
const fs = require('fs');

class ASCIIComputer {
  constructor() {
    this.mInputStreamPos = 0;
    this.mInputStream = [];
  }

  IsEndOfStream() {
    return false;
  }

  LoadScript(aScriptPath) 
  {
    let scriptContent = fs.readFileSync(aScriptPath, 'utf8');
    this.ConvertToAscii(scriptContent);
  }

  Read() {

    if (this.mInputStreamPos >= this.mInputStream.length) 
    {
      let line = readlineSync.prompt();

      if (line.startsWith("batch"))
      {
        let tokens = line.split(" ");
        line = fs.readFileSync(tokens[1], 'utf8');
      }
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
      this.mInputStream.push(aInstruction[i].charCodeAt(0));

    if (this.mInputStream[this.mInputStream.length -1] != 10)
      this.mInputStream.push(10);
  }
}

function GenerateCombs() {
  let items = ["hologram", "fuel cell", "tambourine", "fixed point", "polygon", "boulder", "wreath", "manifold"];

  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++)
      for (let k = j + 1; k < items.length; k++)
        for (let m = k + 1; m < items.length; m++)
        {
          console.log("take" + " " + items[i]);
          console.log("take" + " " + items[j]);
          console.log("take" + " " + items[k]);
          console.log("take" + " " + items[m]);
          console.log("north");
          console.log("drop" + " " + items[i]);
          console.log("drop" + " " + items[j]);
          console.log("drop" + " " + items[k]);
          console.log("drop" + " " + items[m]);        
        }
}

var inst = util.MapInput('./Day25Input.txt', util.ParseInt, ',');

var comp = new ASCIIComputer();

comp.LoadScript("Day25script.txt");

let prog = new intcodeComputer.IntcodeProgram(inst, comp, comp);

prog.Run();
