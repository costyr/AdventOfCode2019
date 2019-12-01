const fs = require('fs');

var rawDay1Input = fs.readFileSync('./Day1Input.txt');

var day1Input = rawDay1Input.toString().split('\r\n');

var totalFuel = 0;
var totalWithFuel = 0;
for (i = 0; i < day1Input.length; i++) {
  let moduleFuel = Math.floor(parseInt(day1Input[i], 10) / 3) - 2;

  if (moduleFuel > 0)
    totalFuel += moduleFuel;

  while (moduleFuel > 0)
  {
    moduleFuel = Math.floor(moduleFuel / 3) - 2;
    if (moduleFuel > 0)
      totalWithFuel += moduleFuel;
  }
}

console.log("Total fuel: " + totalFuel);
console.log("Total with fuel: " + (totalFuel + totalWithFuel));