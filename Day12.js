const util = require('./Util.js');
const { lcm } = require('mathjs');

var moons = util.MapInput("./Day12Input.txt", ParseMoons, "\r\n");

var initialMoonsPos = util.CopyObject(moons);

function ParseCoordElem(aElem) 
{
  let coords = aElem.split(', ');

  let x = parseInt(coords[0].split('=')[1]);
  let y = parseInt(coords[1].split('=')[1]);
  let z = parseInt(coords[2].split('=')[1]);

  return { pos: { "x": x, "y": y, "z": z }, vel: { x: 0, y: 0, z: 0 } };
}

function ParseMoons(aElem) 
{
  return ParseCoordElem(aElem.substr(1, aElem.length - 2));
}

function ComputeTotalEnergy(aMoons) 
{
  let total = 0;
  for (let i = 0; i < aMoons.length; i++)
  {
    let moon = aMoons[i];

    pot = Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
    kin = Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);

    total += pot * kin;
  }

  return total;
}

function IsSamePos(aMoonPos1, aMoonPos2, aScanX, aScanY, aScanZ) 
{
  if (((aScanX && (aMoonPos1.pos.x == aMoonPos2.pos.x)) || !aScanX) && 
      ((aScanY && (aMoonPos1.pos.y == aMoonPos2.pos.y)) || !aScanY) &&
      ((aScanZ && (aMoonPos1.pos.z == aMoonPos2.pos.z)) || !aScanZ))
    return true;
  return false;
}

function IsSameVel(aMoonPos1, aMoonPos2, aScanX, aScanY, aScanZ) 
{
  if (((aScanX && (aMoonPos1.vel.x == aMoonPos2.vel.x)) || !aScanX) &&
      ((aScanY && (aMoonPos1.vel.y == aMoonPos2.vel.y)) || !aScanY) &&
      ((aScanZ && (aMoonPos1.vel.z == aMoonPos2.vel.z)) || !aScanZ))
    return true;
  return false;
}

function MoonsInInitialPos(aInitialMoonsPos, aMoons, aScanX, aScanY, aScanZ) 
{
  let samePos = 0;
  let sameVel = 0;
  for (let i = 0; i < aMoons.length; i++) 
  {
    if (IsSamePos(aInitialMoonsPos[i], aMoons[i], aScanX, aScanY, aScanZ))
      samePos++;
    if (IsSameVel(aInitialMoonsPos[i], aMoons[i], aScanX, aScanY, aScanZ))
      sameVel++;
  }

  return (samePos == 4) && (sameVel == 4);
}

function SimulateMotion(aMoons, aStepsCount, aComputeEnergy) 
{
  let freqX = 0;
  let freqY = 0;
  let freqZ = 0;
  for (let step = 0; step < aStepsCount; step++) 
  {
    for (let i = 0; i < aMoons.length; i++) 
      for (let j = i + 1; j < aMoons.length; j++) 
      {
        if (aMoons[i].pos.x < aMoons[j].pos.x)
        {
          aMoons[i].vel.x += 1;
          aMoons[j].vel.x += -1;
        }
        else if (aMoons[i].pos.x > aMoons[j].pos.x) 
        {
          aMoons[i].vel.x += -1;
          aMoons[j].vel.x += 1;
        }

        if (aMoons[i].pos.y < aMoons[j].pos.y)
        {
          aMoons[i].vel.y += 1;
          aMoons[j].vel.y += -1;
        }
        else if (aMoons[i].pos.y > aMoons[j].pos.y) 
        {
          aMoons[i].vel.y += -1;
          aMoons[j].vel.y += 1;
        }

        if (aMoons[i].pos.z < aMoons[j].pos.z)
        {
          aMoons[i].vel.z += 1;
          aMoons[j].vel.z += -1;
        }
        else if (aMoons[i].pos.z > aMoons[j].pos.z) 
        {
          aMoons[i].vel.z += -1;
          aMoons[j].vel.z += 1;
        }
      }

    for (let i = 0; i < aMoons.length; i++)
    {
      let moon = aMoons[i];
      moon.pos.x += moon.vel.x;
      moon.pos.y += moon.vel.y;
      moon.pos.z += moon.vel.z;
    }

    let mX = MoonsInInitialPos(initialMoonsPos, aMoons, true, false, false);
    if (mX && freqX == 0) 
      freqX = step + 1;

    let mY = MoonsInInitialPos(initialMoonsPos, aMoons, false, true, false);
    if (mY && freqY == 0) 
      freqY= step + 1;

    let mZ = MoonsInInitialPos(initialMoonsPos, aMoons, false, false, true);
    if (mZ && freqZ == 0) 
      freqZ= step + 1;

    if (freqX > 0 && freqY > 0 && freqZ > 0)
      break;
  }

  if (aComputeEnergy)
    return ComputeTotalEnergy(aMoons);
  else 
    return lcm(freqX, freqY, freqZ);
}

console.log(SimulateMotion(moons, 1000, true));
console.log(SimulateMotion(util.CopyObject(initialMoonsPos), 1000000000, false));
