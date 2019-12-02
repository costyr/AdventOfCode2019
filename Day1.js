const util = require('./Util.js');

function CalculateFuel(aTotal, aElem) 
{
  let moduleFuel = Math.floor(parseInt(aElem, 10) / 3) - 2;

  if (moduleFuel > 0)
    aTotal.fuel += moduleFuel;

  while (moduleFuel > 0)
  {
    moduleFuel = Math.floor(moduleFuel / 3) - 2;
    if (moduleFuel > 0)
      aTotal.withFuel += moduleFuel;
  }

  return aTotal;
}

var total = { "fuel": 0, "withFuel": 0 };
util.ReduceInput('./Day1Input.txt', CalculateFuel, total, '\r\n');

console.log("Total fuel: " + total.fuel);
console.log("Total with fuel: " + (total.fuel + total.withFuel));
