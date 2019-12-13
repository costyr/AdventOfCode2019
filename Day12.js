const util = require('./Util.js');

var moons = util.MapInput("./Day12TestInput2.txt", ParseMoons, "\r\n");

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

function IsSamePos(aMoonPos1, aMoonPos2) 
{
  if (/*(aMoonPos1.pos.x == aMoonPos2.pos.x) && 
      (aMoonPos1.pos.y == aMoonPos2.pos.y) &&
      (aMoonPos1.pos.z == aMoonPos2.pos.z) &&*/
      (aMoonPos1.vel.x == aMoonPos2.vel.x) && 
      (aMoonPos1.vel.y == aMoonPos2.vel.y) &&
      (aMoonPos1.vel.z == aMoonPos2.vel.z))
    return true;
  return false;
}

function MoonsInInitialPos(aInitialMoonsPos, aMoons) 
{
  for (let i = 0; i < aMoons.length; i++)
    if (!IsSamePos(aInitialMoonsPos[i], aMoons[i]))
      return false;
  return true;
}


function SimulateMotion(aMoons, aStepsCount, aAcceleration) 
{
  for (let step = 0; step < aStepsCount; step++) 
  {
    //console.log(step);
    for (let i = 0; i < aMoons.length; i++) 
      for (let j = i + 1; j < aMoons.length; j++) 
      {
        if (aMoons[i].pos.x < aMoons[j].pos.x)
        {
          aMoons[i].vel.x += aAcceleration;
          aMoons[j].vel.x += -aAcceleration;
        }
        else if (aMoons[i].pos.x > aMoons[j].pos.x) 
        {
          aMoons[i].vel.x += -aAcceleration;
          aMoons[j].vel.x += aAcceleration;
        }

        if (aMoons[i].pos.y < aMoons[j].pos.y)
        {
          aMoons[i].vel.y += aAcceleration;
          aMoons[j].vel.y += -aAcceleration;
        }
        else if (aMoons[i].pos.y > aMoons[j].pos.y) 
        {
          aMoons[i].vel.y += -aAcceleration;
          aMoons[j].vel.y += aAcceleration;
        }

        if (aMoons[i].pos.z < aMoons[j].pos.z)
        {
          aMoons[i].vel.z += aAcceleration;
          aMoons[j].vel.z += -aAcceleration;
        }
        else if (aMoons[i].pos.z > aMoons[j].pos.z) 
        {
          aMoons[i].vel.z += -aAcceleration;
          aMoons[j].vel.z += aAcceleration;
        }
      }

    for (let i = 0; i < aMoons.length; i++)
    {
      let moon = aMoons[i];
      moon.pos.x += moon.vel.x;
      moon.pos.y += moon.vel.y;
      moon.pos.z += moon.vel.z;

      //console.log(step + "-->" + JSON.stringify(moon));
    }

    if (MoonsInInitialPos(initialMoonsPos, aMoons)) {
      console.log("Moons are in initial position:" + step);
      return;
    }

    //console.log();
  }

  return ComputeTotalEnergy(aMoons);
}

console.log(moons);
console.log(SimulateMotion(moons, 10000000000, 3));
