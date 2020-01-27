const util = require('./Util.js');
const intcodeComputer = require('./IntcodeComputer.js');

class NetworkControler {
  constructor() {
    this.mNetworkComputers = [];
    this.mErrorCode = 0;
    this.mBroadcastMap = [];
    this.mFirstBroadcast = false;
  }

  InitNetworkComputers(aComputerCount, aInst) {
    for (let i = 0; i < aComputerCount; i++)
    {
      let networkComputer = new NetworkComputer(i, this, [i]);
      let prog = new intcodeComputer.IntcodeProgram(inst, networkComputer, networkComputer);
      prog.SetBreakInterval(Math.floor(Math.random() * 10000) + i);
      this.mNetworkComputers.push({ state: networkComputer, prog: prog });
    } 
  }

  GetIdleComputersCount() {
    let idleComputerCount = 0;
    for (let i = 0; i < this.mNetworkComputers.length; i++) 
    {
      let comp = this.mNetworkComputers[i];
      if (comp.state.IsEndOfStream2())
        idleComputerCount++;
    }
    
    return idleComputerCount;
  }

  RunAllPrograms() {

    while (1) 
    {
      let normalExitCouter = 0;
      for (let i = 0; i < this.mNetworkComputers.length; i++)
      {
        if (this.mErrorCode != 0)
        {
          //console.log("Programs stopped because of an error!");
          return;
        }

        let comp = this.mNetworkComputers[i];
        let exitCode = comp.prog.Run();

        if (exitCode == intcodeComputer.ERROR_PROGRAM_HALTED)
          normalExitCouter ++;
      }
      
      if (normalExitCouter == this.mNetworkComputers.length)
        break;
    }
  }

  DeliverPacket(aAddress, aX, aY) {
    if (aAddress < 0 || aAddress >= this.mNetworkComputers.length)
    {
      //console.log("Invalid computer Address: " + aAddress);
      if (aAddress == 255)
      {
        if (!this.mFirstBroadcast) 
        {
          console.log(aY);
          this.mFirstBroadcast = true;
        }

        if (this.GetIdleComputersCount() == this.mNetworkComputers.length)
        {
          this.mNetworkComputers[0].state.ReceivePacket(aX, aY);
          if (this.mBroadcastMap[aY] == undefined)
            this.mBroadcastMap[aY] = 1;
          else 
          {
            console.log(aY);
            this.mErrorCode = 1;
            return;
          }
        }
      }
      
      //this.mErrorCode = 1;
      //return;
    }
    else
      this.mNetworkComputers[aAddress].state.ReceivePacket(aX, aY);  
  }
}

class NetworkComputer {
  constructor(aNetworkAddress, aNetworkControler, aInputStream) {
    this.mMyNetworkAddress = aNetworkAddress;
    this.mOutputOffset = 0;
    this.mNetworkControler = aNetworkControler;
    this.mInputStream = aInputStream;
    this.mInputStreamPos = 0;
    this.mX = 0;
    this.mY = 0;
    this.mNetworkAddress = 0;
  }

  ReceivePacket(aX, aY) 
  {
    this.mInputStream.push(aX);
    this.mInputStream.push(aY);
  }

  IsEndOfStream() {
    return false;
  }

  IsEndOfStream2() {
    return (this.mInputStreamPos >= this.mInputStream.length);
  }

  Read() {
    if (this.IsEndOfStream2())
      return -1;

    let input = this.mInputStream[this.mInputStreamPos++];
    return input;
  }

  Write(aValue) {
    if (this.mOutputOffset == 2)
    {
      this.mY = aValue;
      this.mOutputOffset = 0;

      console.log("NIC: " + this.mNetworkAddress + " x: " + this.mX + " y: " + this.mY);
      this.mNetworkControler.DeliverPacket(this.mNetworkAddress, this.mX, this.mY);
    }
    else if (this.mOutputOffset == 1)
    {
      this.mX = aValue;
      this.mOutputOffset ++;
    }
    else if (this.mOutputOffset == 0)
    {
      this.mNetworkAddress = aValue;
      this.mOutputOffset ++;
    }
    else
    {
      console.log("Invalid output!");
    }
  }
}

var inst = util.MapInput('./Day23Input.txt', util.ParseInt, ',');

var networkControler = new NetworkControler();

networkControler.InitNetworkComputers(50, inst);

networkControler.RunAllPrograms();
