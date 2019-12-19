const util = require('./Util.js');

function ParseLine(aElem) 
{
  return aElem.split("");  
}

function ParseMap(aElem) 
{
  return ParseLine(aElem);
}

function PrintMap(aMap) 
{
  for (let i = 0; i < aMap.length; i++)
  {
    let line = "";
    for (let j = 0; j < aMap[i].length; j++)
      line += aMap[i][j];
    console.log(line);
  }
}

function GetAllKeys(aMap) 
{
  let keys = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) 
    {
      let charCode = aMap[i][j].charCodeAt(0);
      if (charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0))
        keys.push({ key: aMap[i][j], pos: { x: j, y: i }});
    }

  return keys;
}

function FindStart(aMap) 
{
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) 
      if (aMap[i][j] == '@')
        return { x: j, y: i};
  return null;
}

function SetDirections(aMap, aX, aY, aDirections) 
{
  if (aMap[aY][aX].directions == null)
    aMap[aY][aX].directions = aDirections;
}

function IsValidDirection(aMap, aDirection) 
{
  let x = aDirection.x;
  let y = aDirection.y;
  if ((x < 0) || (x >= aMap[0].length) ||
      (y < 0) || (y >= aMap.length))
    return false;

  if (aMap[y][x] == '#')
    return false;

  let posCharCode = aMap[y][x].charCodeAt(0);
  if ((posCharCode >= "A".charCodeAt(0)) && (posCharCode <= "Z".charCodeAt(0)))
    return false;

  return true;
}

function FindValidDirections(aMap, aPos) 
{
  let x = aPos.x;
  let y = aPos.y;

  let posTop = { x: x , y: y + 1};
  let posBottom = { x: x , y: y - 1};
  let posLeft = { x: x - 1, y: y };
  let posRight = { x: x + 1, y: y };

  let directions = [];
  if (IsValidDirection(aMap, posTop))
    directions.push(posTop);
  
  if (IsValidDirection(aMap, posBottom))
    directions.push(posBottom);
  
  if (IsValidDirection(aMap, posLeft))
    directions.push(posLeft);
  
  if (IsValidDirection(aMap, posRight))
    directions.push(posRight);

  return directions;
}

function GetNext(aMap, aPos) 
{
  return aMap[aPos.y][aPos.x].directions.pop();    
}

function GetValue(aMap, aPos) 
{
  return aMap[aPos.y][aPos.x];
}

function IsKey(aValue) 
{
  let charCode = aValue.charCodeAt(0);
  if ((charCode >= "a".charCodeAt(0)) && 
      (charCode <= "z".charCodeAt(0)))
    return true;
  
  return false;
}

function FoundAllKeys(aKeys, aAllKeys) 
{
  if (aKeys.length != aAllKeys.length)
    return false;

  let keysSorted = util.CopyObject(aKeys).split("");
  keysSorted.sort();
  let allKeysSorted = util.CopyObject(aAllKeys).split("");
  allKeysSorted.sort();
  
  return (keysSorted == allKeysSorted);
}

function FindPath(aMap, aStateMap, aAllKeys, aAllDoors) 
{
  let start = FindStart(aMap);
  let path = [start];
  let keys = "";
  let stack = [start];
  
  let pos;
  while (stack.length > 0)
  {
    pos = stack.pop();
    console.log(pos);

    let valueAtPos = GetValue(aMap, pos);

    if (IsKey(valueAtPos)) 
    {
      UnlockDoor(aMap, allDoors, valueAtPos);

      keys += valueAtPos;
      
      console.log(keys);
      if (FoundAllKeys(keys, aAllKeys)) 
      {
        console.log("Found all keys!");
        break;
      }
    }
    else if ((valueAtPos != '.') && (valueAtPos != '@')) 
      continue;

    path.push(pos);

    MarkVisited(aStateMap, pos);

    UpdateCost(aStateMap, pos);

    let directions = FindValidDirections(aMap, pos);

    for (let i = 0; i < directions.length; i++)
      if (!IsVisited(aStateMap, directions[i]))
        stack.push(directions[i]);
  }
}

function CreateStateMap(aMap) 
{
  let stateMap = [];
  for (let i = 0; i < aMap.length; i++) 
  {
    stateMap[i] = [];
    for (let j = 0; j < aMap[i].length; j++)
      stateMap[i][j] = { cost: 0, visited: false };
  }

  return stateMap;
}

function ResetVisited(aStateMap) 
{
  for (let i = 0; i < aMap.length; i++) 
    for (let j = 0; j < aMap[i].length; j++)
      aStateMap[i][i].visited = false;
}

function UpdateCost(aStateMap, aPos) 
{
  aStateMap[aPos.y][aPos.x].cost++;
}

function MarkVisited(aStateMap, aPos) 
{
  return aStateMap[aPos.y][aPos.x].visited = true;
}

function IsVisited(aStateMap, aPos) 
{
  return aStateMap[aPos.y][aPos.x].visited;
}

function GetAllDoors(aMap) 
{
  let doors = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) 
    {
      let charCode = aMap[i][j].charCodeAt(0);
      if (charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0))
        doors.push({ door: aMap[i][j], pos: { x: j, y: i } });
    }

  return doors;
}

function UnlockDoor(aMap, aDoors, aKey) 
{
  let door = aKey.toUpperCase();
  for (let i = 0; i < aDoors.length; i++)
    if (door == aDoors[i].door)
    {
      aMap[aDoors[i].pos.y][aDoors[i].pos.x] = '.';
      return;
    }
}

function UnlockDoors(aMap, aAllDoors, aKeys) 
{
  if (aKeys.length == 0)
   return;

  for (let i = 0; i < aKeys.length; i++)
    UnlockDoor(aMap, aAllDoors, aKeys[i]);
}

function InitCostMap(aMap, aValue) 
{
  let costMap = [];
  for (let i = 0; i < aMap.length; i++) 
  {
    costMap[i] = [];
    for (let j = 0; j < aMap[i].length; j++)
      costMap[i][j] = aValue;
  }

  return costMap;
}

function ResetCostMap(aCostMap) 
{
  for (let i = 0; i < aMap.length; i++) 
    for (let j = 0; j < aMap[i].length; j++)
      aCostMap[i][j] = -1;
}

function GetCost(aCostMap, aPos) 
{
  if ((aCostMap[aPos.y] == undefined) || 
      (aCostMap[aPos.y][aPos.x] == undefined))
    return -1;
  return aCostMap[aPos.y][aPos.x];
}

function SetCost(aCostMap, aPos, aCost) 
{
  if (aCostMap[aPos.y] == undefined)
    aCostMap[aPos.y] = [];
  aCostMap[aPos.y][aPos.x] = aCost;
}

function ComputeLee(aMap, aStart, aStageKeys, aAllKeys) 
{
  let targetPoints = [];
  if (aStageKeys.length > 0) 
  {
    for (let i = 0; i < aAllKeys.length; i++)
      if (aStageKeys.indexOf(aAllKeys[i].key) == -1)
        targetPoints.push(aAllKeys[i].pos);
  }

  let costMap = []; // InitCostMap(aMap, -1);
  let stack = [aStart];

  SetCost(costMap, aStart, 0);
  
  let pos;
  let targetCount = 0;
  while (stack.length > 0)
  {
    pos = stack.pop();

    let cost = GetCost(costMap, pos);

    let directions = FindValidDirections(aMap, pos);
    for (let i = 0; i < directions.length; i++) 
    {
      if (GetCost(costMap, directions[i]) >= 0)
        continue;

      SetCost(costMap, directions[i], cost + 1);

      if (aStageKeys.length > 0) 
      {
        for (let j = 0; j < targetPoints.length; j++)
          if ((directions[i].x == targetPoints[j].x) &&
              (directions[i].y == targetPoints[j].y))
            targetCount ++;

        if (targetCount >= targetPoints.length)
          break;
      }

      stack.push(directions[i]);
    }
  }

  return costMap;
}

function GetAccessibleKeys(aCostMap, aAllKeys, aKey)
{
  let accessibleKeys = [];
  for (let i = 0; i < aAllKeys.length; i++)
  {
    if (aKey == aAllKeys[i].key)
      continue;

    let keyCost = GetCost(aCostMap, aAllKeys[i].pos);
    if (keyCost >= 0)
      accessibleKeys.push({ key: aAllKeys[i].key, cost: keyCost });  
  }

  return accessibleKeys;
}

function GetKeyPos(aAllKeys, aKey) 
{
  for (let i = 0; i < aAllKeys.length; i++)
    if (aKey == aAllKeys[i].key)
      return aAllKeys[i].pos;

  return null;
}

function SortByCost(aKey1, aKey2) 
{
  if (aKey1.cost < aKey2.cost)
    return -1;
  else if (aKey1.cost > aKey2.cost)
    return 1;
  else 
    return 0;
}

function ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys) 
{
  let map = util.CopyObject(aMap);

  let accessibleMap = InitCostMap(aMap, []);

  let allKeys = "";
  for (let i = 0; i < aAllKeys.length; i++)
    allKeys += aAllKeys[i].key;

  UnlockDoors(map, aAllDoors, allKeys);

  let minCost = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < aAllKeys.length; i++)
  {
    let pos = aAllKeys[i].pos;
    let costMap = ComputeLee(map, pos, "", aAllKeys);
  
    let accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aAllKeys[i].key);

    accessibleMap[pos.y][pos.x] = accessibleKeys;
    
    for (let j = 0; j < accessibleKeys.length; j++) 
    {
      if (accessibleKeys[j].key == aAllKeys[i].key)
        continue;

      let cost = accessibleKeys[j].cost;
      if (cost < minCost)
        minCost = cost;
    }
  }
  return { map: accessibleMap, min: minCost };  
}

function FindAccessible(aMap, aGraph, aKey, aPos, aAllKeys, aAllDoors, aStageKeys, aCost, aCostMap) 
{ 
  let accessibleKeys = aCostMap.map[aPos.y][aPos.x];
  if (aStageKeys.length < aAllKeys.length) 
  {
    let map = util.CopyObject(aMap);

    UnlockDoors(map, aAllDoors, aStageKeys);

    let costMap = ComputeLee(map, aPos, aStageKeys, aAllKeys);

    accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aKey);
  }

  //accessibleKeys.sort(SortByCost);

  for (let i = 0; i < accessibleKeys.length; i++) 
  {
    let newKey = accessibleKeys[i].key;
    let cost = aCost + accessibleKeys[i].cost;
    let newKeyPos = GetKeyPos(aAllKeys, newKey);

    if (aStageKeys.indexOf(newKey) >= 0)
      continue;
  
    let newStageKeys = util.CopyObject(aStageKeys);
    newStageKeys += newKey;

    let graphNode = newStageKeys;

    let costEstimate = cost + (aAllKeys.length - graphNode.length) * aCostMap.min; 

    if (costEstimate >= aGraph.min)
      continue;

    if (graphNode.length == allKeys.length) 
    {
      if (cost < aGraph.min) 
      {
        aGraph.path = graphNode;
        aGraph.min = cost;
        console.log(graphNode + "-->" + cost);
      }
    }
    else
    {
      console.log(newStageKeys + "-->" + cost + " " + costEstimate);
      FindAccessible(map, aGraph, newKey, newKeyPos, aAllKeys, aAllDoors, newStageKeys, cost, aCostMap);
    }
  }
}

function FindPath2(aMap, aAllKeys, aAllDoors) 
{
  let startPos = FindStart(aMap);

  let graph = { path: "", min: Number.MAX_SAFE_INTEGER };

  let costMap = ComputeMinTwoKeyCost(aMap, allDoors, allKeys);
  
  console.log(costMap.min);

  FindAccessible(aMap, graph, '@', startPos, aAllKeys, aAllDoors, "", 0, costMap);

  console.log(graph.path + "-->" + graph.min);
}

var map = util.MapInput("./Day18TestInput2.txt", ParseMap, "\r\n");

PrintMap(map);

var allKeys = GetAllKeys(map);
var allDoors = GetAllDoors(map);

console.log(allKeys.length);
FindPath2(map, allKeys, allDoors);
