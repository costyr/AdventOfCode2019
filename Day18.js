const util = require('./Util.js');
const alg = require('./dijkstra.js');

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

function GetAllKeys(aMap) {
  let keys = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let charCode = aMap[i][j].charCodeAt(0);
      if (charCode >= "a".charCodeAt(0) && charCode <= "z".charCodeAt(0)) {
        let key = aMap[i][j];
        let pos = { x: j, y: i };
        keys.push({ key: key, pos: pos });
      }
    }

  return keys;
}

function FindStart(aMap) {
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == '@')
        return { x: j, y: i };
  return null;
}

function SetDirections(aMap, aX, aY, aDirections) {
  if (aMap[aY][aX].directions == null)
    aMap[aY][aX].directions = aDirections;
}

function IsValidDirection(aMap, aDirection) {
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

function FindValidDirections(aMap, aPos) {
  let x = aPos.x;
  let y = aPos.y;

  let posTop = { x: x, y: y + 1 };
  let posBottom = { x: x, y: y - 1 };
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

function GetNext(aMap, aPos) {
  return aMap[aPos.y][aPos.x].directions.pop();
}

function GetValue(aMap, aPos) {
  return aMap[aPos.y][aPos.x];
}

function IsKey(aValue) {
  let charCode = aValue.charCodeAt(0);
  if ((charCode >= "a".charCodeAt(0)) &&
    (charCode <= "z".charCodeAt(0)))
    return true;

  return false;
}

function FoundAllKeys(aKeys, aAllKeys) {
  if (aKeys.length != aAllKeys.length)
    return false;

  let keysSorted = util.CopyObject(aKeys).split("");
  keysSorted.sort();
  let allKeysSorted = util.CopyObject(aAllKeys).split("");
  allKeysSorted.sort();

  return (keysSorted == allKeysSorted);
}

function FindPath(aMap, aStateMap, aAllKeys, aAllDoors) {
  let start = FindStart(aMap);
  let path = [start];
  let keys = "";
  let stack = [start];

  let pos;
  while (stack.length > 0) {
    pos = stack.pop();
    console.log(pos);

    let valueAtPos = GetValue(aMap, pos);

    if (IsKey(valueAtPos)) {
      UnlockDoor(aMap, allDoors, valueAtPos);

      keys += valueAtPos;

      console.log(keys);
      if (FoundAllKeys(keys, aAllKeys)) {
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

function CreateStateMap(aMap) {
  let stateMap = [];
  for (let i = 0; i < aMap.length; i++) {
    stateMap[i] = [];
    for (let j = 0; j < aMap[i].length; j++)
      stateMap[i][j] = { cost: 0, visited: false };
  }

  return stateMap;
}

function ResetVisited(aStateMap) {
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      aStateMap[i][i].visited = false;
}

function UpdateCost(aStateMap, aPos) {
  aStateMap[aPos.y][aPos.x].cost++;
}

function MarkVisited(aStateMap, aPos) {
  return aStateMap[aPos.y][aPos.x].visited = true;
}

function IsVisited(aStateMap, aPos) {
  return aStateMap[aPos.y][aPos.x].visited;
}

function GetAllDoors(aMap) {
  let doors = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let charCode = aMap[i][j].charCodeAt(0);
      if (charCode >= "A".charCodeAt(0) && charCode <= "Z".charCodeAt(0)) {
        let door = aMap[i][j];
        let pos = { x: j, y: i };
        doors.push({ door: door, pos: pos });
      }
    }

  return doors;
}

function UnlockDoor(aMap, aDoors, aKey) {
  let door = aKey.toUpperCase();
  for (let i = 0; i < aDoors.length; i++)
    if (door == aDoors[i].door) {
      aMap[aDoors[i].pos.y][aDoors[i].pos.x] = '.';
      return;
    }
}

function UnlockDoors(aMap, aAllDoors, aKeys) {
  if (aKeys.length == 0)
    return;

  for (let i = 0; i < aKeys.length; i++)
    UnlockDoor(aMap, aAllDoors, aKeys[i]);
}

function InitCostMap(aMap, aValue) {
  let costMap = [];
  for (let i = 0; i < aMap.length; i++) {
    costMap[i] = [];
    for (let j = 0; j < aMap[i].length; j++)
      costMap[i][j] = aValue;
  }

  return costMap;
}

function ResetCostMap(aCostMap) {
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      aCostMap[i][j] = -1;
}

function GetCost(aCostMap, aPos) {
  if ((aCostMap[aPos.y] == undefined) ||
    (aCostMap[aPos.y][aPos.x] == undefined))
    return -1;
  return aCostMap[aPos.y][aPos.x];
}

function SetCost(aCostMap, aPos, aCost) {
  if (aCostMap[aPos.y] == undefined)
    aCostMap[aPos.y] = [];

  aCostMap[aPos.y][aPos.x] = aCost;
}

function ComputeLee(aMap, aStart, aStageKeys, aAllKeys) {
  let targetPoints = [];
  if (aStageKeys.length > 0) {
    for (let i = 0; i < aAllKeys.length; i++)
      if (aStageKeys.indexOf(aAllKeys[i].key) == -1)
        targetPoints.push(aAllKeys[i].pos);
  }

  let costMap = []; // InitCostMap(aMap, -1);
  let stack = [aStart];

  SetCost(costMap, aStart, 0);

  let pos;
  let targetCount = 0;
  while (stack.length > 0) {
    pos = stack.pop();

    let cost = GetCost(costMap, pos);

    let directions = FindValidDirections(aMap, pos);
    for (let i = 0; i < directions.length; i++) {
      let neighbourCost = GetCost(costMap, directions[i])

      let newCost = cost + 1;

      if (aStageKeys.length > 0) {
        for (let j = 0; j < targetPoints.length; j++)
          if ((directions[i].x == targetPoints[j].x) &&
            (directions[i].y == targetPoints[j].y))
            targetCount++;

        if (targetCount >= targetPoints.length)
          break;
      }

      if ((neighbourCost == -1) || (newCost < neighbourCost)) {
        SetCost(costMap, directions[i], newCost);
        stack.push(directions[i]);
      }
    }
  }

  return costMap;
}

function GetAccessibleKeys(aCostMap, aAllKeys, aKey, aStageKeys) {
  let accessibleKeys = [];
  for (let i = 0; i < aAllKeys.length; i++) {
    if (aKey == aAllKeys[i].key)
      continue;

    if ((aStageKeys != undefined) && (aStageKeys.indexOf(aAllKeys[i].key) != -1))
      continue;

    let keyCost = GetCost(aCostMap, aAllKeys[i].pos);
    if (keyCost >= 0)
      accessibleKeys.push({ key: aAllKeys[i].key, cost: keyCost });
  }

  return accessibleKeys;
}

function GetKeyPos(aAllKeys, aKey) {
  for (let i = 0; i < aAllKeys.length; i++)
    if (aKey == aAllKeys[i].key)
      return aAllKeys[i].pos;

  return null;
}

function SortByCost(aKey1, aKey2) {
  if (aKey1.cost < aKey2.cost)
    return -1;
  else if (aKey1.cost > aKey2.cost)
    return 1;
  else
    return 0;
}

function ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys) {
  let map = util.CopyObject(aMap);

  let accessibleMap = InitCostMap(aMap, []);

  let allKeys = "";
  for (let i = 0; i < aAllKeys.length; i++)
    allKeys += aAllKeys[i].key;

  UnlockDoors(map, aAllDoors, allKeys);

  let minCost = Number.MAX_SAFE_INTEGER;
  let maxCost = 0;
  for (let i = 0; i < aAllKeys.length; i++) {
    let pos = aAllKeys[i].pos;
    let costMap = ComputeLee(map, pos, "", aAllKeys);

    let accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aAllKeys[i].key);

    accessibleMap[pos.y][pos.x] = accessibleKeys;

    for (let j = 0; j < accessibleKeys.length; j++) {
      if (accessibleKeys[j].key == aAllKeys[i].key)
        continue;

      let cost = accessibleKeys[j].cost;
      if (cost < minCost)
        minCost = cost;

      if (cost > maxCost)
        maxCost = cost;
    }
  }
  return { map: accessibleMap, min: minCost, max: maxCost };
}

function FindAccessible(aMap, aGraph, aKey, aPos, aAllKeys, aAllDoors, aStageKeys, aCost, aCostMap, aCache) {
  let accessibleKeys = aCostMap.map[aPos.y][aPos.x];
  if (aStageKeys.length < aAllKeys.length) {
    let map = util.CopyObject(aMap);

    UnlockDoors(map, aAllDoors, aStageKeys);

    let costMap = ComputeLee(map, aPos, "", aAllKeys);

    accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aKey, aStageKeys);
  }

  //accessibleKeys.sort(SortByCost);

  for (let i = 0; i < accessibleKeys.length; i++) {
    let newKey = accessibleKeys[i].key;
    let cost = aCost + accessibleKeys[i].cost;
    let newKeyPos = GetKeyPos(aAllKeys, newKey);

    if (aStageKeys.indexOf(newKey) >= 0)
      continue;

    let newStageKeys = util.CopyObject(aStageKeys);
    newStageKeys += newKey;

    let graphNode = newStageKeys;

    AddToCache(aCache, graphNode, cost);

    let badEstimate = (aAllKeys.length - graphNode.length) * aCostMap.min;
    let goodEstimate = GetFromCache(aCache, aAllKeys, graphNode);

    let minCostEstimate = cost + goodEstimate != null ? goodEstimate : badEstimate;
    let maxCostEstimate = cost + (aAllKeys.length - graphNode.length) * aCostMap.max;

    if (minCostEstimate >= aGraph.min)
      continue;

    if (maxCostEstimate < aGraph.min) {
      aGraph.path = graphNode;
      aGraph.min = maxCostEstimate;
      console.log(graphNode + "-->" + cost);
    }

    if (graphNode.length < allKeys.length) {
      //console.log(newStageKeys + "-->" + cost + " " + minCostEstimate + " " + maxCostEstimate);
      FindAccessible(map, aGraph, newKey, newKeyPos, aAllKeys, aAllDoors, newStageKeys, cost, aCostMap, aCache);
    }

    if (cost > aGraph.min)
      return;
  }
}

function FindPath2(aMap, aStartKey, aStartPos, aAllKeys, aAllDoors, aStageKeys) {
  let graph = { path: "", min: Number.MAX_SAFE_INTEGER };

  let costMap = ComputeMinTwoKeyCost(aMap, allDoors, allKeys);

  let cache = [];

  console.log(costMap.min);
  console.log(costMap.max);

  FindAccessible(aMap, graph, aStartKey, aStartPos, aAllKeys, aAllDoors, aStageKeys, 0, costMap, cache);

  console.log(graph.path + "-->" + graph.min);
  return graph;
}

function FindPath3(aMap, aAllKeys, aAllDoors) {
  let startPos = FindStart(aMap);
  FindPath2(aMap, '@', startPos, aAllKeys, aAllDoors, "");
}

function FindPath99(aCostMap, aPos, aPath, aCost, aPathMap, aAllKeys, aStageKeys) {

  if (aStageKeys.length == aPath.length) {
    aPathMap[aPath] = aCost;
    //console.log(aPath + "-->" + aCost);
    return;
  }

  let accessibleKeys = aCostMap.map[aPos.y][aPos.x];

  for (let i = 0; i < accessibleKeys.length; i++) {
    let newKey = accessibleKeys[i].key;
    let cost = accessibleKeys[i].cost;
    if (aStageKeys.indexOf(newKey) == -1)
      continue;

    if (aPath.indexOf(newKey) >= 0)
      continue;

    let newCost = aCost + cost;
    let newPath = aPath + newKey;

    let newKeyPos = GetKeyPos(aAllKeys, newKey);

    FindPath99(aCostMap, newKeyPos, newPath, newCost, aPathMap, aAllKeys, aStageKeys);
  }
}

function FindStagePaths(aCostMap, aAllKeys, aStageKeys) {

  let pathMap = [];
  for (let i = 0; i < aStageKeys.length; i++) {
    let key = aStageKeys[i];
    let pos = GetKeyPos(aAllKeys, key);
    FindPath99(aCostMap, pos, key, 0, pathMap, aAllKeys, aStageKeys);
  }

  return pathMap;
}

function FindDeps(aMap, aPos, aKey, aAllKeys, aAllDoors, aStageKeys) {
  let map = util.CopyObject(aMap);

  UnlockDoors(map, aAllDoors, aStageKeys);

  let costMap = ComputeLee(map, aPos, aStageKeys, aAllKeys);

  accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aKey);

  let nextStage = "";
  for (let i = 0; i < accessibleKeys.length; i++) {
    let newKey = accessibleKeys[i].key;

    if (aStageKeys.indexOf(newKey) >= 0)
      continue;

    nextStage += newKey;
  }

  return nextStage;
}

function FindAllDeps(aMap, aAllKeys, aAllDoors) {
  let startPos = FindStart(aMap);
  let startKey = "@";

  let stageKeys = "";
  let stages = [];
  while (true) {
    let nextDeps = FindDeps(aMap, startPos, startKey, aAllKeys, aAllDoors, stageKeys);

    stageKeys += nextDeps;

    stages.push(nextDeps);

    if (stageKeys.length == allKeys.length)
      break;
  }

  return stages;
}

function StageIsInPath(aPath, aStage) {
  let path = util.CopyObject(aPath);
  path.sort();
  let stage = util.CopyObject(aStage);
  stage.sort();

  return path.includes(aStage);
}

function SetStageVisited(aUsedStages, aStage) {
  aUsedStages[aStage] = 1;
}

function StageIsVisited(aUsedStages, aStage) {
  if (aUsedStages[aStage] != undefined)
    return true;
  return false;
}

function GetKeysCost(aCostMap, aAllKeys, aKey1, aKey2) {
  let pos = GetKeyPos(aAllKeys, aKey1);
  let accessibleKeys = aCostMap.map[pos.y][pos.x];

  for (let i = 0; i < accessibleKeys.length; i++) {
    let key = accessibleKeys[i].key;
    if (key == aKey2)
      return accessibleKeys[i].cost;
  }

  return 0;
}

function FindPath100(aCostMap, aAllStagePaths, aStageIndex, aAllKeys, aPath, aCost, aMin) {

  console.log(aPath + ": " + aCost);
  if (aStageIndex >= aAllStagePaths.length) {
    if (aCost < aMin.cost) {
      aMin.cost = aCost;
      aMin.path = aPath;
      //console.log(aPath + ": " + aCost);
    }
    return;
  }

  for (let stage in aAllStagePaths[aStageIndex]) {
    let path = aPath + stage;
    let pathCost = aCost + aAllStagePaths[aStageIndex][stage];

    if (aStageIndex > 0) {
      let lastKey = aPath[aPath.length - 1];
      let nextKey = stage[0];
      pathCost += GetKeysCost(aCostMap, aAllKeys, lastKey, nextKey);
    }

    FindPath100(aCostMap, aAllStagePaths, aStageIndex + 1, aAllKeys, path, pathCost, aMin);
  }
}

function ComapareStages(aMap, aAllKeys, aAllDoors) {
  let stages = FindAllDeps(aMap, aAllKeys, aAllDoors);
  let costMap = ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys);

  console.log(stages);

  let allStagePaths = [];

  for (let i = 0; i < stages.length; i++) {
    let stagePaths = FindStagePaths(costMap, aAllKeys, stages[i]);
    allStagePaths.push(stagePaths);
  }

  let stageMins = [];
  for (let i = 0; i < allStagePaths.length; i++) {
    let min = Number.MAX_SAFE_INTEGER; 
    let path = "";

    for (let stage in allStagePaths[i]) {
      let cost = allStagePaths[i][stage];
      if (cost < min) {
        min = cost;
        path = stage;
      }
    }

    stageMins.push({ path: path, min: min });

    //console.log(stage + "-->" + allStagePaths[stage]);
  }

  console.log(JSON.stringify(stageMins));

  /*let min = {path: "", cost: Number.MAX_SAFE_INTEGER };

  FindPath100(costMap, allStagePaths, 0, aAllKeys, "", 0, min);*/

  //console.log(min.path + ": " + min.cost);
}

function GetNeighbours(aMap, aKey, aAllKeys, aAllDoors, aStageKeys, aCache) {

  let cacheKey = aKey + "_" + aStageKeys;
  if (aCache[cacheKey] != undefined) 
  {
    console.log("Found Neighbours in cache!");
    return aCache[cacheKey];
  }

  let map = util.CopyObject(aMap);

  UnlockDoors(map, aAllDoors, aStageKeys);

  let pos = (aKey == '@') ? FindStart(aMap) : GetKeyPos(aAllKeys, aKey);

  let costMap = ComputeLee(map, pos, "", aAllKeys);

  accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aKey, aStageKeys);

  //accessibleKeys.sort(SortByCost);

  aCache[cacheKey] = accessibleKeys;

  return accessibleKeys;
}

function ComputeAllDeps(aMap, aAllKeys, aAllDoors) {

  let map = util.CopyObject(aMap);

  let depsMap = [];
  let hh = true;
  let e = "";
  while (hh) {
    hh = false;
    for (let i = 0; i < aAllKeys.length; i++) {
      let key = aAllKeys[i];
      let costMap = ComputeLee(map, key.pos, "", aAllKeys);

      let foundDoors = [];
      for (let j = 0; j < aAllDoors.length; j++) {
        let door = aAllDoors[j];
        if (e.indexOf(door.door) != -1)
          continue;
        let dirs = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
        for (let k = 0; k < dirs.length; k++) {
          let pos = { x: door.pos.x + dirs[k].x, y: door.pos.y + dirs[k].y };
          let cost = GetCost(costMap, pos);
          if (cost != -1) {
            foundDoors.push(door);
          }
        }
      }

      if (foundDoors.length == 1) {
        hh = true;
        let foundDoor = foundDoors[0];
        let doorKey = foundDoor.door.toLowerCase();
        map[foundDoor.pos.y][foundDoor.pos.x] = '.';
        e += foundDoor.door;
        if (depsMap[doorKey] == undefined)
          depsMap[doorKey] = [];
        depsMap[doorKey].push(key.key);
      }
    }
  }

  return depsMap;
}

function ComputeAllDeps22(aMap, aAllKeys, aAllDoors) {
  let map = util.CopyObject(aMap);
  let start = FindStart(aMap);

  let depsMap = [];
  let keys = "";
  let unlockedDoors = "";
  let doors = [{ door: '@', pos: start }];
  while (keys.length < aAllKeys.length) {
    let lastDoor = doors.pop();

    if (lastDoor.door != '@') {
      map[lastDoor.pos.y][lastDoor.pos.x] = '.';
      unlockedDoors += lastDoor.door;
    }

    let costMap = ComputeLee(map, start, "", aAllKeys);
    for (let i = 0; i < aAllKeys.length; i++) {
      let key = aAllKeys[i];

      if (keys.indexOf(key.key) != -1)
        continue;

      let cost = GetCost(costMap, key.pos);
      if (cost > 0) {
        keys += key.key;
        if (depsMap[lastDoor.door] == undefined)
          depsMap[lastDoor.door] = [];
        depsMap[lastDoor.door].push(key);
      }
      map[key.pos.y][key.pos.x] = '.';
    }

    for (let i = 0; i < aAllDoors.length; i++) {
      let door = aAllDoors[i];

      if (unlockedDoors.indexOf(door.door) != -1)
        continue;

      let dirs = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
      for (let k = 0; k < dirs.length; k++) {
        let pos = { x: door.pos.x + dirs[k].x, y: door.pos.y + dirs[k].y };
        let cost = GetCost(costMap, pos);
        if (cost != -1) {
          doors.push(door);
        }
      }
    }

  }

  return depsMap;
}

function PrintDeps(aDepsMap) {

  let depsAsString = "";
  for (let dep in aDepsMap)
  {
    if (depsAsString.length > 0)
      depsAsString += "\n";
    depsAsString += dep + "-->" + JSON.stringify(aDepsMap[dep]);
  }

  return depsAsString;
}

function GetNeighbours44(aMap, aKey, aPos, aAllKeys, aAllDoors, aStageKeys) {
  let accessibleKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  let depsMap = ComputeAllDeps22(aMap, aAllKeys, aAllDoors);

  let ss = PrintDeps(depsMap);
  console.log(ss);
  /*depsMap['a'] = ['j'];
  depsMap['e'] = ['k'];
  depsMap['f'] = ['l'];
  depsMap['g'] = ['i'];
  depsMap['h'] = ['p'];
  depsMap['d'] = ['o'];
  depsMap['b'] = ['n'];
  depsMap['c'] = ['m'];*/
  /*
    for (let i = 0; i < aStageKeys.length; i++)
    {
      let deps = depsMap[aStageKeys[i]];
      if (deps == undefined)
        continue;
      for (let j = 0; j < deps.length; j++)
        accessibleKeys.push(deps[j]);  
    }
   
    return accessibleKeys;*/
}

function Sort123(aState, aElem1, aElem2) {
  let cost1 = aState.GetDist(aElem1);
  let cost2 = aState.GetDist(aElem2);

  if (cost1 < cost2)
    return -1;
  else if (cost1 > cost2)
    return 1;
  else
    return 0;
}

function AppendKey(aKeys, aKey) {
  let k = aKeys.split('');
  k.push(aKey);
  k.sort();

  let s = "";
  for (let i = 0; i < k.length; i++)
    s += k[i];
  return s;
}

function BFS(aMap, aAllKeys, aAllDoors) {
  let costMap = ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys);

  console.log(costMap.min + " " + costMap.max);

  let neighboursCache = [];

  let queue = new alg.PriorityQueue({ key: '@', keys: "" });

  let minCost = Number.MAX_SAFE_INTEGER;

  let cache = [];
  cache["@_"] = {cost: 0, path: "@"};

  while (!queue.IsEmpty()) {
    let currentNode = queue.Pop();

    //console.log(currentNode.key + " " + currentNode.keys + " " + currentNode.cost);
    //console.log(queue.mQueue.length);

    let hashKey = currentNode.key + "_" + currentNode.keys;
    let currentNodeCost = 0;
    let currentNodePath = "@";
    if (cache[hashKey] != undefined) {
      currentNodeCost = cache[hashKey].cost;
      currentNodePath = cache[hashKey].path;

      delete cache[hashKey];
    }

    if (currentNode.keys.length == aAllKeys.length) {
      //console.log(currentNodePath + " " + currentNodeCost);
      //break;
    }

    let neighbours = GetNeighbours(aMap, currentNode.key, aAllKeys, aAllDoors, currentNode.keys, neighboursCache);

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];

      let keys = AppendKey(currentNode.keys, neighbour.key);

      let cost = currentNodeCost + neighbour.cost;
      let path = currentNodePath + neighbour.key;

      let remainingKeys = (aAllKeys.length - keys.length);

      //if (remainingKeys == 0)
     // {
     //   console.log(queue.mQueue.length + " " + remainingKeys + " " + path + "-->" + cost);
     // }

      let minCostEstimate = cost + remainingKeys * costMap.min;
      let maxCostEstimate = cost + remainingKeys * costMap.max;

      if (maxCostEstimate < minCost) {
        minCost = maxCostEstimate;
        console.log(queue.mQueue.length + " " + remainingKeys + " " + path + "-->" + minCost);
      }

      hashKey = neighbour.key + "_" + keys;
      if (cache[hashKey] != undefined) {
        if (cost < cache[hashKey].cost)
        {
          cache[hashKey].cost = cost;
          cache[hashKey].path = path;
        }
        continue;
      }
      else
        cache[hashKey] =  { cost: cost, path: path };

      if (minCostEstimate > minCost)
        continue;

      let newNode = { key: neighbour.key, keys: keys }

      queue.Push(newNode);
    }
  }

  for (let p in cache)
  {
    if ((p.length - 2) == aAllKeys.length)
      console.log(cache[p].path + " " + cache[p].cost);
  }
}

function ComputeOposite(aAllKeys, aKeys) {
  let keys = [];
  for (let i = 0; i < aAllKeys.length; i++)
    if (aKeys.indexOf(aAllKeys[i].key) == -1)
      keys.push(aAllKeys[i].key);
  keys.sort();
  return keys.toString().replace(/,/g, "");
}

function AddToCache(aCache, aKeys, aCost) {
  let keys = util.CopyObject(aKeys).split("").sort().toString();

  if (aCache[keys] == undefined)
    aCache[keys] = aCost;

  if (aCost < aCache[keys])
    aCache[keys] = aCost;
}

function GetFromCache(aCache, aAllKeys, aKeys) {
  let keys = ComputeOposite(aAllKeys, aKeys);

  if (aCache[keys] != undefined) {
    console.log("From cache: " + keys + "-->" + aCache[keys])
    return aCache[keys];
  }

  return null;
}

function ComputePathCost(aMap, aAllKeys, aAllDoors, aPath) {

  let map = util.CopyObject(aMap);

  let allKeys = "";
  for (let i = 0; i < aAllKeys.length; i++)
    allKeys += aAllKeys[i].key;

  UnlockDoors(map, aAllDoors, allKeys);

  let startPos = FindStart(aMap);
  let costMapStart = ComputeLee(map, startPos, "", aAllKeys);

  let costMap = ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys);

  let totalCost = 0;
  for (let i = 0; i < (aPath.length - 1); i++)
  {
    let key = aPath[i];
    let nextKey = aPath[i + 1];
    let cost = 0;

    if (key == '@')
    {
      let pos = GetKeyPos(aAllKeys, nextKey);

      
      cost = costMapStart[pos.y][pos.x];
    }
    else 
    {
      let pos = GetKeyPos(aAllKeys, key);

      let neighbours = costMap.map[pos.y][pos.x];

      for (let j = 0; j < neighbours.length; j++)
        if (neighbours[j].key == nextKey) 
        {
          cost = neighbours[j].cost;
          break;
        }
    }

    totalCost += cost;
    console.log(key  + "-->" + nextKey + ": " + cost);
  }

  return totalCost;
}

var map = util.MapInput("./Day18Input.txt", ParseMap, "\r\n");

PrintMap(map);

var allKeys = GetAllKeys(map);
var allDoors = GetAllDoors(map);

console.log(allKeys.length);
console.log(allDoors.length);

//GetNeighbours44(map, '', null, allKeys, allDoors, "");

//FindPath3(map, allKeys, allDoors);
//@omethqalgyxziujwdrfpnvbkcs
//@omqkczayxlgethiujdwrfvpnbs
//console.log(ComputePathCost(map, allKeys, allDoors, "@omqkczayxlgethiujdwrfvpnbs"));

BFS(map, allKeys, allDoors);
