const fs = require('fs');
const util = require('./Util.js');

function ComputeFFT(aPhaseIndex, aSignalLength) 
{
  let base = [0, 1, 0, -1];
  
  let phasedBase = [];

  for (let i = 0; i < base.length; i++)
    for (let j = 0; j < aPhaseIndex + 1; j++)
      phasedBase.push(base[i]);
      
  let fft = [];     
  for (let i = 0; i < aSignalLength / phasedBase.length + 1; i++)
  {
    for (let j = 0; j < phasedBase.length; j++)
      fft.push(phasedBase[j]);
  }

  return fft.slice(1, aSignalLength  + 1);
}

function ComputeFFTMap(aPhaseLength, aOffset, aTotal) 
{
  let fftMap = [];
  for (let i = 0; i < aTotal; i++) 
  {
    let fft = ComputeFFT(aOffset + i, aPhaseLength);
    fftMap[i] = fft.slice(aOffset, aOffset + aTotal);
  }
  
  return fftMap;
}

function ComputePhase(aPhase, aFFTMap) 
{
  let newPhase = [];
  for (let i = 0; i < aPhase.length; i++)
  { 
    let fft = aFFTMap[i];
    let total = 0; 
    for (let j = 0; j < aPhase.length; j++)
      total += aPhase[j] * fft[j];
    newPhase.push(Math.abs(total) % 10);
  }
  
  return newPhase;
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

function Transform(aSignal, aPhaseCount, aFFTMap) 
{
  let phase = util.CopyObject(aSignal);
  for (let i = 0; i < aPhaseCount; i++) 
  { 
    phase = ComputePhase(phase, aFFTMap);
  }

  return phase.slice(0, 8);
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

var signal = util.MapInput('./Day16TestInput2.txt', util.ParseInt, '');

//console.log(signal);

//ComputeFFT(1, signal.length);

let fftMap = ComputeFFTMap(signal.length, 0, signal.length);

PrintFFTMap(fftMap);

console.log(Transform(signal, 100, fftMap));

/*let amplifiedSignal = AmplifySignal(signal, 10000);

let messageOffset = ComputeMessageOffset(amplifiedSignal);

let fftMap = ComputeFFTMap(amplifiedSignal.length, messageOffset, 8);

PrintFFTMap(fftMap);

console.log(messageOffset);
 
let jj = Transform(amplifiedSignal.slice(messageOffset, messageOffset + 8), 100, fftMap);

PrintPhase(jj, 0, jj.length, false);*/