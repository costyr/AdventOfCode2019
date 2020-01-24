const util = require('./Util.js');
const alg = require('./dijkstra.js');
const lee = require('./Lee.js');

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
  let starts = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == '@')
        starts.push({ x: j, y: i });
  return starts;
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

function GetAccessibleKeys(aCostMap, aAllKeys, aKey, aStageKeys) {
  let accessibleKeys = [];
  for (let i = 0; i < aAllKeys.length; i++) {
    if (aKey == aAllKeys[i].key)
      continue;

    if ((aStageKeys != undefined) && (aStageKeys.indexOf(aAllKeys[i].key) != -1))
      continue;

    let keyCost = aCostMap.GetCost(aAllKeys[i].pos);
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

function IsValidDirection(aMapElem) {
  if (aMapElem == '#')
    return false;

  let posCharCode = aMapElem.charCodeAt(0);
  if ((posCharCode >= "A".charCodeAt(0)) && (posCharCode <= "Z".charCodeAt(0)))
    return false;

  return true;
}

function ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys) {
  let map = util.CopyObject(aMap);

  let accessibleMap = InitCostMap(aMap, []);

  let allKeys = "";
  for (let i = 0; i < aAllKeys.length; i++)
    allKeys += aAllKeys[i].key;

  UnlockDoors(map, aAllDoors, allKeys);

  let costMap = new lee.Lee(map, IsValidDirection);

  let minCost = Number.MAX_SAFE_INTEGER;
  let maxCost = 0;
  for (let i = 0; i < aAllKeys.length; i++) {
    let pos = aAllKeys[i].pos;
    costMap.ComputeLee(pos);

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

function GetNeighbours(aMap, aKey, aStartPos, aAllKeys, aAllDoors, aStageKeys, aCache) {

  let cacheKey = aKey + "_" + aStageKeys;
  if (aCache[cacheKey] != undefined) 
  {
    console.log("Found Neighbours in cache!");
    return aCache[cacheKey];
  }

  let map = util.CopyObject(aMap);

  UnlockDoors(map, aAllDoors, aStageKeys);

  let pos = (aKey == '@') ? aStartPos : GetKeyPos(aAllKeys, aKey);

  let costMap = new lee.Lee(map, IsValidDirection);

  costMap.ComputeLee(pos);

  accessibleKeys = GetAccessibleKeys(costMap, aAllKeys, aKey, aStageKeys);

  aCache[cacheKey] = accessibleKeys;

  return accessibleKeys;
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

function BFS(aMap, aStartPos, aStartKey, aStartKeys, aStartPath, aStartCost, aAllKeys, aAllDoors) {
  let costMap = ComputeMinTwoKeyCost(aMap, aAllDoors, aAllKeys);

  let neighboursCache = [];

  let queue = new alg.PriorityQueue({ key: aStartKey, keys: aStartKeys });

  let minCost = Number.MAX_SAFE_INTEGER;

  let cache = [];
  cache[aStartKey + "_" + aStartKeys] = { cost: aStartCost, path: aStartPath };

  let currentNodeCost = aStartCost;
  let currentNodePath = aStartPath;
  let currentNodeKeys = aStartKeys;
  let currentNodeKey = aStartKey;
  while (!queue.IsEmpty()) {
    let currentNode = queue.Pop();

    let hashKey = currentNode.key + "_" + currentNode.keys;
    currentNodeKeys = currentNode.keys;
    currentNodeKey = currentNode.key;
    if (cache[hashKey] != undefined) {
      currentNodeCost = cache[hashKey].cost;
      currentNodePath = cache[hashKey].path;

      delete cache[hashKey];
    }

    let neighbours = GetNeighbours(aMap, currentNode.key, aStartPos, aAllKeys, aAllDoors, currentNode.keys, neighboursCache);

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];

      let keys = AppendKey(currentNode.keys, neighbour.key);

      let cost = currentNodeCost + neighbour.cost;
      let path = currentNodePath + neighbour.key;

      let remainingKeys = (aAllKeys.length - keys.length);

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

      let newNode = { key: neighbour.key, keys: keys }

      queue.Push(newNode);
    }
  }

  return { key: currentNodeKey, keys: currentNodeKeys, path: currentNodePath, cost: minCost };
}

function OpenDoors(aAllKeys, aStarts) {
  let visited = ["", "", "", ""];
  let topLeft = aStarts[0];
  let topRight = aStarts[1];
  let bottomLeft = aStarts[2];
  let bottomRight = aStarts[3];
  for (let i = 0; i < aAllKeys.length; i++)
  {
    let x = aAllKeys[i].pos.x;
    let y = aAllKeys[i].pos.y;
    
    if (!((x <= topLeft.x) && (y <= topLeft.y)))
    {
      visited[0] += aAllKeys[i].key;
    }
    
    if (!((x >= topRight.x) && (y <= topRight.y)))
    {
      visited[1] += aAllKeys[i].key;
    }

    if (!((x <= bottomLeft.x) && (y >= bottomLeft.y)))
    {
      visited[2] += aAllKeys[i].key;
    }

    if (!((x >= bottomRight.x) && (y >= bottomRight.y)))
    {
      visited[3] += aAllKeys[i].key;
    }
  }

  for (let i = 0; i < visited.length; i++)
  {
    let bb = visited[i].split("");
    bb.sort();

    let s = "";
    for (let j = 0; j < bb.length; j++)
      s += bb[j];

    visited[i] = s;
  }

  return visited;
}

function BFSMulti(aMap, aAllKeys, aAllDoors) {
  let map = util.CopyObject(aMap);
  let starts = FindStart(aMap);
  let visited = OpenDoors(aAllKeys, starts);

  let robotState = [];
  for (let i = 0; i < starts.length; i++)
    robotState.push({ startPos: starts[i], key: '@', keys: visited[i], path: "@", cost: 0 });

    let totalCost = 0;
    for (let i = 0; i < robotState.length; i++)
    {
      console.log("-------------------------------");
      let state = robotState[i];
      let ret = BFS(map, state.startPos, state.key, state.keys, state.path, state.cost, aAllKeys, aAllDoors);

      totalCost += ret.cost;
    }

  return totalCost;
}

function BFSMulti2(aMap, aAllKeys, aAllDoors) {
  let map = util.CopyObject(aMap);
  let starts = FindStart(aMap);

  let robotState = [];
  for (let i = 0; i < starts.length; i++)
    robotState.push({ startPos: starts[i], key: '@', keys: "", path: "@", cost: 0 });

  let keysFound = "";

  while (keysFound.length < aAllKeys.length)
  {
    for (let i = 0; i < robotState.length; i++)
    {
      let state = robotState[i];
      let ret = BFS(map, state.startPos, state.key, state.keys, state.path, state.cost, aAllKeys, aAllDoors);

      let foundNewKeys = false;
      for (let j = 0; j < ret.keys.length; j++)
      {
        let key = ret.keys[j];
        if (keysFound.indexOf(key) == -1) 
        {
          keysFound += key;
          foundNewKeys = true;
        }
      }

      if (foundNewKeys) {
        UnlockDoors(map, aAllDoors, keysFound);

      state.key = ret.key;
      state.keys = ret.keys;
      state.path = ret.path;
      state.cost = ret.cost;
      }
    }
  }

  let totalCost = 0;
  for (let i = 0; i < robotState.length; i++) 
  {
    console.log(JSON.stringify(robotState[i]));
    totalCost += robotState[i].cost;
  }

  return totalCost;
}

var map = util.MapInput("./Day18Input.txt", ParseMap, "\r\n");

PrintMap(map);

var allKeys = GetAllKeys(map);
var allDoors = GetAllDoors(map);

let startPos = FindStart(map)[0];
console.log(BFS(map, startPos, '@', "", "@", 0, allKeys, allDoors).cost);

var map2 = util.MapInput("./Day18Input2.txt", ParseMap, "\r\n");

console.log(BFSMulti(map2, allKeys, allDoors));
