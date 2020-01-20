const fs = require('fs');
const util = require('./Util.js');

function ComputeFFT(aPhaseIndex, aSignalLength) 
{
  let fft = [];
  for (let i = 0; i < aSignalLength; i++)
    fft.push(GetFFT(aPhaseIndex, i));
  return fft;
}

function GetFFT(aPhaseIndex, aPos) 
{
  let base = [0, 1, 0, -1];
  
  let phaseLen = (aPhaseIndex + 1);

  let pos = Math.floor((aPos + 1) / phaseLen);

  let index = pos % 4;
  
  return base[index];
}

function ComputeFFTMap(aPhaseLength, aOffset) 
{
  let fftMap = [];
  for (let i = 0; i < aPhaseLength - aOffset; i++) 
  {
    console.log(i);
    let fft = ComputeFFT(aOffset + i, aPhaseLength);
    fftMap[i] = fft;
  }
  
  return fftMap;
}

function ComputePhase(aPhase, aOffset) 
{
  let newPhase = [];
  for (let i = 0; i < aPhase.length; i++)
  { 
    let total = 0; 
    for (let j = 0; j < aPhase.length; j++) 
    {
      let fft = GetFFT(aOffset + i, j);
      let phase = aPhase[j];
      total += phase * fft;
    }
    newPhase.push(Math.abs(total) % 10);
  }
  
  return newPhase;
}

function ComputePhase2(aPhase) 
{
  let newPhase = [];
  let total = 0;
  for (let i = aPhase.length - 1; i >= 0; i--)
  { 
    total += aPhase[i];
    newPhase.push(Math.abs(total) % 10);
  }
  
  return newPhase.reverse();
}

function PhaseToString(aPhase, aOffset, aLength, aPadding) 
{
  let line = "";
  for (let i = aOffset; i < aOffset + aLength; i++) 
  {
    if (aPadding) 
    {
      if (aPhase[i] >= 0)
        line += " ";
    }
    line += aPhase[i].toString();
  }

  return line;
}

function PrintPhase(aPhase, aOffset, aLength) 
{
  let phaseStr = PhaseToString(aPhase, aOffset, aLength);
  if (phaseStr.length > 0)
    console.log(phaseStr);
}

function PrintFFTMap(aFFTMap) 
{
  let lines = "";
  for (let i = 0; i < aFFTMap.length; i++) 
  {
    lines += PhaseToString(aFFTMap[i], 0, aFFTMap[i].length, true);
    lines += "\r\n";
  }

  if (lines.length > 0)
    console.log(lines);
}

function Transform(aSignal, aPhaseCount, aOffset) 
{
  let phase = util.CopyObject(aSignal);
  for (let i = 0; i < aPhaseCount; i++) 
    phase = ComputePhase(phase, aOffset);

  return phase.slice(0, 8);
}

function Transform2(aSignal, aPhaseCount) 
{
  let phase = util.CopyObject(aSignal);
  for (let i = 0; i < aPhaseCount; i++) 
    phase = ComputePhase2(phase);

  return phase;
}

function AmplifySignal(aSignal, aStrength) 
{
  let newSignal = [];
  for (let i = 0; i < aStrength; i++)
    for (let j = 0; j < aSignal.length; j++)
      newSignal.push(aSignal[j]);
  
  return newSignal;
}

function ComputeMessageOffset(aSignal) 
{
  let rawOffset = aSignal.slice(0, 7);

  let messageOffset = 0;
  for (let i = 0; i < rawOffset.length; i++)
    messageOffset = messageOffset * 10  + rawOffset[i];
  return messageOffset;
}

var signal = util.MapInput('./Day16Input.txt', util.ParseInt, '');

console.log(Transform(signal, 100, 0));

let amplifiedSignal = AmplifySignal(signal, 10000);

let messageOffset = ComputeMessageOffset(amplifiedSignal);
 
PrintPhase(Transform2(amplifiedSignal.slice(messageOffset), 100), 0, 8, false);
