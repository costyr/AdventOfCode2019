const util = require('./Util.js');

function ParseLine(aElem) {
  return aElem.split("");
}

function ParseMap(aElem) {
  return ParseLine(aElem);
}

function PrintMap(aMap) {
  for (let i = 0; i < aMap.length; i++) {
    let line = "";
    for (let j = 0; j < aMap[i].length; j++)
      line += aMap[i][j];
    console.log(line);
  }
}

function GetValue(aMap, aX, aY) {
  if ((aY < 0) || (aY >= aMap.length) || (aX < 0) || (aX >= aMap[aY].length))
    return '.';

  return aMap[aY][aX];
}

function AnalizeNeighbors(aMap, aX, aY) {
  let neighbors = [
    { x: aX - 1, y: aY },
    //{ x: aX - 1, y: aY + 1 }, 
    { x: aX, y: aY + 1 },
    //{ x: aX + 1, y: aY + 1 }, 
    { x: aX + 1, y: aY },
    //{ x: aX + 1, y: aY - 1 },
    { x: aX, y: aY - 1 },
    /*{ x: aX - 1, y: aY - 1 }*/];

  let bugsCount = 0;
  for (let i = 0; i < neighbors.length; i++)
    if (GetValue(aMap, neighbors[i].x, neighbors[i].y) == '#')
      bugsCount++;

  let currentValue = aMap[aY][aX];

  if (bugsCount > 0) {
    if (currentValue == '#') {
      if (bugsCount == 1)
        return '#';
      else
        return '.';
    }
    else {
      if ((bugsCount == 1) || (bugsCount == 2)) {
        return '#';
      }
      else
        return '.';
    }
  }

  return '.';
}

function SetValue(aMap, aX, aY, aValue) {
  if (aMap[aY] == undefined)
    aMap[aY] = [];

  if (aMap[aY][aX] == undefined)
    aMap[aY][aX] = aValue;
  else
    aMap[aY][aX] = aValue;
}

function Evolve(aMap) {

  let newMap = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let newValue = AnalizeNeighbors(aMap, j, i);

      SetValue(newMap, j, i, newValue);
    }
  return newMap;
}

function ComputeBiodiversityRating(aMap) {
  let counter = 0;
  let biodiversityRating = 0;
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (GetValue(aMap, j, i) == '#')
        biodiversityRating += Math.pow(2, counter);

      counter++;
    }

  return biodiversityRating;
}

function EvolveInTime(aMap, aTimeCount) {
  let map = util.CopyObject(aMap);

  let stages = [];
  for (let i = 0; i < aTimeCount; i++) {
    map = Evolve(map);

    console.log();
    PrintMap(map);

    if (stages[JSON.stringify(map)] != undefined)
      break;

    stages[JSON.stringify(map)] = 1;
  }

  console.log(ComputeBiodiversityRating(map));
}

function GetValueMultilevel(aMap, aInnerMap, aOuterMap, aX, aY, aDir) {

  let mX = 2;
  let mY = 2;

  let bugsCount = 0;
  if ((aY < 0) || (aY >= aMap.length) || (aX < 0) || (aX >= aMap[aY].length)) {
    let value = '';
    if (aY < 0) {
      value = aOuterMap ? aOuterMap[mY - 1][mX] : '.';
    }
    else if (aY >= aMap.length) {
      value = aOuterMap ? aOuterMap[mY + 1][mX] : '.';
    }
    else if (aX < 0) {
      value = aOuterMap ? aOuterMap[mY][mX - 1] : '.'
    }
    else if (aX >= aMap[aY].length)
      value = aOuterMap ? aOuterMap[mY][mX + 1] : '.';

    if (value == '#')
      bugsCount++;

    return bugsCount;
  }

  if ((aX == mX) && (aY == mY) && (aInnerMap != null)) {
    if (aDir == 0) {
      for (let i = 0; i < aMap.length; i++)
        if (aInnerMap[i][aMap.length - 1] == '#')
          bugsCount++;
    }
    else if (aDir == 1) {
      for (let i = 0; i < aMap.length; i++)
        if (aInnerMap[0][i] == '#')
          bugsCount++;
    }
    else if (aDir == 2) {
      for (let i = 0; i < aMap.length; i++)
        if (aInnerMap[i][0] == '#')
          bugsCount++;
    }
    else if (aDir == 3) {
      for (let i = 0; i < aMap.length; i++)
        if (aInnerMap[aMap.length - 1][i] == '#')
          bugsCount++;
    }
  }
  else {
    if (aMap[aY][aX] == '#')
      bugsCount++;
  }

  return bugsCount;
}

function AnalizeNeighborsMultilevel(aMap, aInnerMap, aOuterMap, aX, aY) {
  let neighbors = [
    { x: aX - 1, y: aY },
    //{ x: aX - 1, y: aY + 1 }, 
    { x: aX, y: aY + 1 },
    //{ x: aX + 1, y: aY + 1 }, 
    { x: aX + 1, y: aY },
    //{ x: aX + 1, y: aY - 1 },
    { x: aX, y: aY - 1 },
    /*{ x: aX - 1, y: aY - 1 }*/];

  let bugsCount = 0;
  for (let i = 0; i < neighbors.length; i++) {
    let x = neighbors[i].x;
    let y = neighbors[i].y;
    bugsCount += GetValueMultilevel(aMap, aInnerMap, aOuterMap, x, y, i);
  }

  let currentValue = aMap[aY][aX];

  if (bugsCount > 0) {
    if (currentValue == '#') {
      if (bugsCount == 1)
        return '#';
      else
        return '.';
    }
    else {
      if ((bugsCount == 1) || (bugsCount == 2)) {
        return '#';
      }
      else
        return '.';
    }
  }

  return '.';
}

function CreateEmptyMap(aMap) {

  let newMap = [];
  for (let i = 0; i < aMap.length; i++) {
    newMap[i] = [];
    for (let j = 0; j < aMap[i].length; j++)
      newMap[i][j] = '.';
  }

  return newMap;
}

function CreateMultiLevel(aMap, aTotalLevels) {
  let levels = [];
  for (let i = 0; i < aTotalLevels; i++) {
    if (i == aTotalLevels / 2)
      levels.push(aMap);
    else
      levels.push(CreateEmptyMap(aMap));
  }

  return levels;
}

function EvolveLevel(aMap, aInnerMap, aOuterMap) {
  let newMap = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if ((i == 2) && (j == 2))
        SetValue(newMap, j, i, '?');
      else 
      {
        let newValue = AnalizeNeighborsMultilevel(aMap, aInnerMap, aOuterMap, j, i);

        SetValue(newMap, j, i, newValue);
      }
    }
  return newMap;
}

function EvolveMultiLevel(aLevels) {
  let newLevels = [];
  for (let i = 0; i < aLevels.length; i++) {
    let innerMap = i > 0 ? aLevels[i - 1] : null;
    let outerMap = i < (aLevels.length - 1) ? aLevels[i + 1] : null;

    let newMap = EvolveLevel(aLevels[i], innerMap, outerMap);
    newLevels.push(newMap);
  }

  return newLevels;
}

function CountBugs(aMap) {
  let bugsCount = 0;
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (GetValue(aMap, j, i) == '#')
        bugsCount++;
  return bugsCount;
}

function PrintLevels(aLevels) {
  for (let i = 0; i < aLevels.length; i++) 
  {
    console.log("");
    PrintMap(aLevels[i]);
  }
}

function EvolveInTimeMultiLevel(aMap, aTimeCount, aLevelEstimate) {
  let map = util.CopyObject(aMap);

  let levels = CreateMultiLevel(map, aLevelEstimate);
  for (let i = 0; i < aTimeCount; i++) {
    console.log("Time " + i + " ---------------------------");
    PrintLevels(levels);
    levels = EvolveMultiLevel(levels);
  }

  let totalBugsCount = 0;

  for (let i = 0; i < levels.length; i++)
    totalBugsCount += CountBugs(levels[i]);

  console.log(totalBugsCount);
}

var map = util.MapInput("./Day24Input.txt", ParseMap, "\r\n");

PrintMap(map);

//EvolveInTime(map, 1000);

EvolveInTimeMultiLevel(map, 200, 250);
