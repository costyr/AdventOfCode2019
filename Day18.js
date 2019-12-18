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

function InitCostMap(aMap) 
{
  let costMap = [];
  for (let i = 0; i < aMap.length; i++) 
  {
    costMap[i] = [];
    for (let j = 0; j < aMap[i].length; j++)
      costMap[i][j] = -1;
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
  return aCostMap[aPos.y][aPos.x];
}

function SetCost(aCostMap, aPos, aCost) 
{
  aCostMap[aPos.y][aPos.x] = aCost;
}

function ComputeLee(aMap, aStart) 
{
  let costMap = InitCostMap(aMap);
  let stack = [aStart];

  SetCost(costMap, aStart, 0);
  
  let pos;
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

function FindAccessible(aMap, aGraph, aKey, aPos, aAllKeys, aAllDoors, aStageKeys) 
{
  let map = util.CopyObject(aMap);

  UnlockDoors(map, aAllDoors, aStageKeys);

  let costMap = ComputeLee(map, aPos);
  
  let accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aKey);

  console.log(aStageKeys);

  if (accessibleKeys.length == 0)
    return; 
   
  let minCost = Number.MAX_SAFE_INTEGER;
  let minAccessibleKey = null;
  for (let i = 0; i < accessibleKeys.length; i++) 
  {
    if (aStageKeys.indexOf(accessibleKeys[i].key) >= 0)
      continue;

    let cost = accessibleKeys[i].cost;
    if (cost < minCost) 
    {
      minCost = cost;
      minAccessibleKey = accessibleKeys[i];
    }
  }

  if (minAccessibleKey == null)
    return;
  
  let newKey = minAccessibleKey.key;
  let newKeyPos = GetKeyPos(aAllKeys, newKey);

  let newStageKeys = util.CopyObject(aStageKeys);
  newStageKeys += newKey;

  let graphNode = newStageKeys;

  if (aGraph[graphNode] == undefined) 
  {
    aGraph[graphNode] = minCost;
    FindAccessible(map, aGraph, newKey, newKeyPos, aAllKeys, aAllDoors, newStageKeys);
  }
}

function FindPath2(aMap, aAllKeys, aAllDoors) 
{
  let startPos = FindStart(aMap);

  let graph = [];

  let stack = [ { key: '@', inherited: "" } ];

  while (stack.length > 0) 
  {
    let current = stack.pop();

    let accessibleKeys = FindAccessible(aMap, graph, current.key, startPos, aAllKeys, aAllDoors, current.inherited);
    
    
  }

  for (key in graph)
    console.log(key + "-->" + JSON.stringify(graph[key]));
}

var map = util.MapInput("./Day18TestInput3.txt", ParseMap, "\r\n");
var stateMap = CreateStateMap(map);

PrintMap(map);

var allKeys = GetAllKeys(map);
var allDoors = GetAllDoors(map);

FindPath2(map, allKeys, allDoors);
