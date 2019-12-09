const util = require('./Util.js');

var rawImage = util.MapInput("./Day8Input.txt", util.ParseInt, "");

function InitImage(aImage, aWidth, aHeight) 
{
  for (let y = 0; y < aHeight; y++) 
  {
    aImage[y] = [];
    for (let x = 0; x < aWidth; x++)
      aImage[y][x] = 0;
  }
}

function PrintImage(aImage, aWidth, aHeight) 
{
  for (let y = 0; y < aHeight; y++) 
  {
    let line = "";
    for (let x = 0; x < aWidth; x++)
      line += aImage[y][x] == 0 ? " " : "0";
    console.log(line);
  }
}

function RenderLayer(aRawImage, aStart, aEnd, aImage, aWidth, aHeight) 
{
  //console.log(aStart + " " + aEnd);
  let x = 0;
  let y = 0;
  for (let i = aStart; i < aEnd; i++, x++)
  {
    if (i >= (aStart + aWidth) && (i % aWidth == 0))
    {
      x = 0;
      y++;
    }

    let pixel = aRawImage[i];
    if (pixel == 2)
      continue;
    aImage[y][x] = pixel;
  }
}

function RenderImage(aRawImage, aImage, aWidth, aHeight) 
{
  let layerCount = aRawImage.length / layerSize;

  for (let i = layerCount - 1; i >= 0; i--) 
  {
    let start = i * layerSize;
    let end = start + layerSize;

    RenderLayer(aRawImage, start, end, aImage, aWidth, aHeight);
    //PrintImage(aImage, imageWidth, imageHeight);
  }
}

//console.log(rawImage);

const imageWidth = 25;
const imageHeight = 6;

const layerSize = imageWidth * imageHeight;

var layerCheckSum;
var layerPos = 1;
var zeroCount = 0;
var oneCount = 0;
var twoCount = 0;
var minZero = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < rawImage.length; i++) 
{
  if ((i >= layerSize) && (i % layerSize) == 0)
  {
    //console.log(i + " " + zeroCount + " " + oneCount + " " + twoCount); 
    if (zeroCount < minZero)
    {
      layerCheckSum = oneCount * twoCount;
      minZero = zeroCount;

      layerPos = Math.floor(i / layerSize);
    }

    zeroCount = 0;
    oneCount = 0;
    twoCount = 0;
  }

  if (rawImage[i] == 0)
    zeroCount ++;
  else if (rawImage[i] == 1)
    oneCount ++;
  else if (rawImage[i] == 2)
    twoCount ++;

}

if (zeroCount < minZero)
  layerCheckSum = oneCount * twoCount;

console.log(layerCheckSum);

var image = [];
InitImage(image, imageWidth, imageHeight);

RenderImage(rawImage, image, imageWidth, imageHeight);

PrintImage(image, imageWidth, imageHeight);

