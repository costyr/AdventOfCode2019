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

function IsSame(aPortal1, aPortal2) {
  return aPortal1.substr(0, 2) == aPortal2.substr(0, 2);
}

function IsOuter(aPortal) {
  return aPortal.endsWith("1");
}

class FindShortestPathMulti {
  constructor() {
    this.mLevel = 0;
  }

  ComputeNeighbourLevel(aCurrentNode, aNeighbourId) {
    this.mLevel = aCurrentNode.level;
    if (IsSame(aCurrentNode.id, aNeighbourId)) 
    {
      if (IsOuter(aCurrentNode.id) && !IsOuter(aNeighbourId)) 
      {
        this.mLevel--;
      }
      else
        this.mLevel++;
    }

    return this.mLevel;
  }

  CreateQueueNode(aCurrentNode, aNeighbourId) {
    return { id: aNeighbourId, level: this.mLevel };
  }

  ComputeStateId(aCurrentNode, aNeighbourId) {
    let stateId = "";
    if (aNeighbourId == undefined) 
    {
      if ((aCurrentNode.id == undefined) && ((aCurrentNode == "AA") || (aCurrentNode == "ZZ")))
        return aCurrentNode + "_0"; 
      stateId = aCurrentNode.id + "_" + aCurrentNode.level;
    }
    else
    {
      let level = this.ComputeNeighbourLevel(aCurrentNode, aNeighbourId);
      stateId = aNeighbourId + "_" + level;
    }

    return stateId;
  }

  SetStartState(aState, aStart) {
    let start = aStart + "_0";
    aState.SetDist(start, 0);
  }

  InitQueue(aQueue, aStart) {
    aQueue.Push({ id: aStart, level: 0 });
  }

  GetNodeId(aNode) {
    return aNode.id;
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {
    return ((aCurrentNode.id == aEndNodeId) && (aCurrentNode.level == 0));
  }

  IsValidNeighbour(aCurrentNode, aNeighbourId) {
    if (((aNeighbourId == "ZZ") && (aCurrentNode.level > 0)) || 
         (IsOuter(aNeighbourId) && !IsSame(aCurrentNode.id, aNeighbourId) && (aCurrentNode.level == 0)))
      return false;
    return true;
  }

  SortByDist(aDistMap, aElem1, aElem2) {

    let stateId1 = aElem1.id + "_" + aElem1.level;
    let stateId2 = aElem2.id + "_" + aElem2.level;

    let dist1 = aDistMap.GetDist(stateId1);
    let dist2 = aDistMap.GetDist(stateId2);
  
    if (dist1 < dist2)
      return -1;
    else if (dist1 > dist2)
      return 1;
    else
      return 0;
  }
}

var map = util.MapInput("./Day20Input.txt", ParseMap, "\r\n");

PrintMap(map);

var portals = FindPortals(map);

var costMap = ComputeCostMap(map, portals);

var dijkstra = new alg.Dijkstra(costMap);

console.log(dijkstra.FindShortestPath("AA", "ZZ").dist);

var searchMulti = new FindShortestPathMulti();

var dijkstraMulti = new alg.Dijkstra(costMap, searchMulti);

console.log(dijkstraMulti.FindShortestPath("AA", "ZZ").dist);
