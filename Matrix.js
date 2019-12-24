
function PrintLine(aLine) 
{
  let line = ""; 
  for (let i = 0; i < aLine.length; i++)
    line += aLine[i];

  return line;
}

class Matrix {
  constructor(aWidth, aHeight, aValue)
  {
    this.mMatix = [];
    for (let i = 0; i < aHeight; i++) 
    {
      this.mMatix[i] = [];
      for (let j = 0; j < aWidth; j++)
        this.mMatix[i][j] = aValue;
    }
  }

  GetMatrix() {
    return this.mMatix;
  }

  SetValue(aLine, aCol, aValue) 
  {
    this.mMatix[aLine][aCol] = aValue;
  }

  GetValue(aLine, aCol) 
  {
    return this.mMatix[aLine][aCol];
  }

  Print()
  {
    for (let i = 0; i < this.mMatix.length; i++) 
      console.log(PrintLine(this.mMatix[i]));
  }

  PrintReverse()
  {
    for (let i = this.mMatix.length - 1; i >= 0; i--) 
      console.log(PrintLine(this.mMatix[i]));
  }
}

module.exports = {
  Matrix
}
