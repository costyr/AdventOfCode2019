const passStart = 197487;
const passEnd = 673251;

function HasSame2(aDigits) 
{
  let count = [];
  for (let i = 0; i < aDigits.length; i++) 
  {
    let ind = 0;
    for (let j = i + 1; j < aDigits.length; j++)
      if (aDigits[i] == aDigits[j])
        ind++;
      else
        break;
    
    count[i] = ind + 1;
    i += ind;
  }

  for (let k in count)
    if (count[k] == 2)
      return true;
  return false;
}

var count = 0;
var count2 = 0;
for (let i = passStart; i <= passEnd; i++) 
{
  let digits = i.toString().split("");

  let hasSame2 = HasSame2(digits);
  let hasSame = false;
  let isAscending = true;
  for (let j = 0; j < digits.length; j++)
  {
    if (j < digits.length - 1) 
    {
      if (digits[j] == digits[j + 1]) 
        hasSame = true;

      if (digits[j] > digits[j + 1])  
        isAscending = false;
    }
  }
  
  if (isAscending) 
  {
    if (hasSame)
      count++;
    if (hasSame2)
      count2++;
  }
}

console.log(count);
console.log(count2);
