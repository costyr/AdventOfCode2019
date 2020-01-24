const util = require('./Util.js');
const alg = require('./Dijkstra.js');
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

function IsPortalMarker(aElem) {
  if ((aElem != '.') && (aElem != '#') && (aElem != ' '))
    return true;
  return false;
}

function GetMapValue(aMap, aX, aY) {
  if ((aY < 0) || (aY >= aMap.length) ||
    (aX < 0) || (aX >= aMap[aY].length))
    return ' ';

  return aMap[aY][aX];
}

function FindPortals(aMap) {
  let portals = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (IsPortalMarker(aMap[i][j])) {
        if ((j < aMap[i].length - 1) && IsPortalMarker(aMap[i][j + 1])) {
          let portalId = aMap[i][j] + aMap[i][j + 1];

          let left = GetMapValue(aMap, j - 1, i);
          let right = GetMapValue(aMap, j + 2, i);

          let x = (left == '.') && (right == ' ') ? j - 1 :
            ((left == ' ') && (right == '.')) ? j + 2 : -1;

          if (x == -1) {
            console.log("Parsing error!")
            return;
          }

          if (((j == 0) || (j == aMap[i].length - 2)) &&
            (portalId != "AA") && (portalId != "ZZ"))
            portalId = portalId + "1";

          portals[portalId] = { x: x, y: i };
        }
        else if ((i < aMap.length - 1) && IsPortalMarker(aMap[i + 1][j])) {
          let portalId = aMap[i][j] + aMap[i + 1][j];

          let top = GetMapValue(aMap, j, i - 1);
          let bottom = GetMapValue(aMap, j, i + 2);

          let y = (top == '.') && (bottom == ' ') ? i - 1 :
            ((top == ' ') && (bottom == '.')) ? i + 2 : -1;

          if (y == -1) {
            console.log("Parsing error!")
            return;
          }

          if (((i == 0) || (i == aMap.length - 2)) &&
            (portalId != "AA") && (portalId != "ZZ"))
            portalId = portalId + "1";

          portals[portalId] = { x: j, y: y };
        }
      }
    }

  return portals;
}

function PrintHashMap(aPortals) {
  for (let p in aPortals)
    console.log(p + ": " + JSON.stringify(aPortals[p]));
}

function IsValidDirection(aMapElem) {
  if (aMapElem == '#' || aMapElem == ' ')
    return false;

  return true;
}

function GetOppositePortal(aPortal) {
  if (aPortal == "AA" || aPortal == "ZZ")
    return aPortal;

  if (aPortal.endsWith("1"))
    return aPortal.substr(0, aPortal.length - 1);
  else
    return aPortal + "1";
}

function ComputeCostMap(aMap, aPortals) {
  let graph = new alg.Graph();
  for (let portal in aPortals) {

    let costMap = new lee.Lee(aMap, IsValidDirection);
    costMap.ComputeLee(aPortals[portal]);

    if (portal != "AA" && portal != "ZZ")
      graph.AddNeighbour(portal, { id: GetOppositePortal(portal), cost: 1 });

    for (let target in aPortals) {
      if (portal == target)
        continue;

      let targetPos = aPortals[target];

      let cost = costMap.GetCost(targetPos);

      if (cost > -1)
        graph.AddNeighbour(portal, { id: target, cost: cost });
    }
  }

  return graph;
}

function CreateDistMap(aCostMap) {
  let distMap = [];
  for (let portal in aCostMap.GetGraph()) {
    distMap[portal] = { visited: false, dist: Number.MAX_SAFE_INTEGER };
  }

  return distMap;
}

function SortByDist(aDistMap, aElem1, aElem2) {
  let dist1 = aDistMap[aElem1].dist;
  let dist2 = aDistMap[aElem2].dist;

  if (dist1 < dist2)
    return -1;
  else if (dist1 > dist2)
    return 1;
  else
    return 0;
}

function FindElem(aElements, aElem) {
  for (let i = 0; i < aElements.length; i++)
    if (JSON.stringify(aElements[i]) == JSON.stringify(aElem))
      return true;
  return false;
}

function FindShortestPath(aCostMap, aStart, aEnd) {
  let queue = [aStart];

  let distMap = CreateDistMap(aCostMap);
  distMap[aStart].dist = 0;

  let path = [];
  while (queue.length > 0) {
    let currentNode = queue.shift();
    let currentDist = distMap[currentNode].dist;

    if (currentNode == aEnd) {
      foundEnd = true;
      break;
    }

    let neighbours = aCostMap.GetNeighbours(currentNode);

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];

      if (distMap[neighbour.id].visited)
        continue;

      let estimateDist = currentDist + neighbour.cost;
      if (estimateDist < distMap[neighbour.id].dist) {
        path[neighbour.id] = currentNode;
        distMap[neighbour.id].dist = estimateDist;
      }

      if (!FindElem(queue, neighbour.id))
        queue.push(neighbour.id);
    }

    distMap[currentNode].visited = true;
    queue.sort(SortByDist.bind(null, distMap));
  }

  let portalsPath = [];
  let next = aEnd;
  while (1) {
    portalsPath.unshift(next);

    if (next == aStart)
      break;
    next = path[next];
  }

  console.log(portalsPath);

  return distMap[aEnd].dist;
}

function IsSame(aPortal1, aPortal2) {
  return aPortal1.substr(0, 2) == aPortal2.substr(0, 2);
}

function IsOuter(aPortal) {
  return aPortal.endsWith("1");
}

function IsVisited(aDistMap, aNode, aLevel) {
  if (aDistMap[aNode] == undefined)
    return false;
 
  if (aDistMap[aNode][aLevel] == undefined)
    return false;

  return aDistMap[aNode][aLevel].visited;
}

function SetVisited(aDistMap, aNode, aLevel) {
  if (aDistMap[aNode] == undefined)
    aDistMap[aNode] = [];

  if (aDistMap[aNode][aLevel] == undefined)
    aDistMap[aNode][aLevel] = { visited: true, dist: Number.MAX_SAFE_INTEGER };
  else
    aDistMap[aNode][aLevel].visited = true;
}

function GetDist(aDistMap, aNode, aLevel) 
{
  if (aDistMap[aNode] == undefined)
    return Number.MAX_SAFE_INTEGER;
 
  if (aDistMap[aNode][aLevel] == undefined)
    return Number.MAX_SAFE_INTEGER;

  return aDistMap[aNode][aLevel].dist;
}

function SetDist(aDistMap, aNode, aLevel, aDist) {
  if (aDistMap[aNode] == undefined)
    aDistMap[aNode] = [];

  if (aDistMap[aNode][aLevel] == undefined)
    aDistMap[aNode][aLevel] = { visited: false, dist: aDist };
  else
    aDistMap[aNode][aLevel].dist = aDist;
}

function SortByDistAndLevel(aDistMap, aElem1, aElem2) {
  let dist1 = GetDist(aDistMap, aElem1.id, aElem1.level);
  let dist2 = GetDist(aDistMap, aElem2.id, aElem2.level);

  if (dist1 < dist2)
    return -1;
  else if (dist1 > dist2)
    return 1;
  else
    return 0;
}

function FindShortestPath2(aCostMap, aStart, aEnd) {
  let queue = [{ id: aStart, level: 0 }];

  let distMap = [];
  SetDist(distMap, aStart, 0, 0);

  let path = [];
  while (queue.length > 0) {
    let currentNode = queue.shift();

    let currentDist = GetDist(distMap, currentNode.id, currentNode.level);

    if ((currentNode.id == aEnd) && (currentNode.level == 0))
      break;

    let neighbours = aCostMap.GetNeighbours(currentNode.id);

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];

     if (((neighbour.id == "ZZ") && (currentNode.level > 0)) || 
           (IsOuter(neighbour.id) && !IsSame(currentNode.id, neighbour.id) && (currentNode.level == 0)))
        continue;

      let level = currentNode.level;
      if (IsSame(currentNode.id, neighbour.id)) 
      {
        if (IsOuter(currentNode.id) && !IsOuter(neighbour.id)) 
        {
          level--;
        }
        else
          level++;
      }

      if (IsVisited(distMap, neighbour.id, level))
        continue;

      let estimateDist = currentDist + neighbour.cost;
      if (estimateDist < GetDist(distMap, neighbour.id, level)) {
        path[neighbour.id] = currentNode.id;
        //console.log(currentNode.id + " " + currentNode.level + "-->" + neighbour.id);
        SetDist(distMap, neighbour.id, level, estimateDist);
      }

      let newNode = { id: neighbour.id, level: level };

      if (!FindElem(queue, newNode))
        queue.push(newNode);
    }

    SetVisited(distMap, currentNode.id, currentNode.level);
    queue.sort(SortByDistAndLevel.bind(null, distMap));
  }

  return GetDist(distMap, aEnd, 0);
}

var map = util.MapInput("./Day20Input.txt", ParseMap, "\r\n");

PrintMap(map);

var portals = FindPortals(map);

//PrintHashMap(portals);

var costMap = ComputeCostMap(map, portals);

//PrintHashMap(costMap);

console.log(FindShortestPath(costMap, "AA", "ZZ"));

//PrintHashMap(fullCostMap);

console.log(FindShortestPath2(costMap, "AA", "ZZ"));
