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

function IsPortalMarker(aElem) 
{
  if ((aElem != '.') && (aElem != '#') && (aElem != ' '))
    return true;
  return false;
}

function GetMapValue(aMap, aX, aY) 
{
  if ((aY < 0) || (aY >= aMap.length) ||
      (aX < 0) || (aX >= aMap[aY].length))
    return ' ';

  return aMap[aY][aX];
}

function FindPortals(aMap) 
{
  let portals = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
    {
      if (IsPortalMarker(aMap[i][j]))
      {
        if ((j < aMap[i].length - 1) && IsPortalMarker(aMap[i][j + 1]))
        {
          let portalId = aMap[i][j] + aMap[i][j + 1];

          let left = GetMapValue(aMap, j - 1, i);
          let right = GetMapValue(aMap, j + 2, i);

          let x = (left == '.') && (right == ' ') ? j - 1 : 
                  ((left == ' ') && (right == '.')) ? j + 2 : -1;

          if (x == -1) 
          {
            console.log("Parsing error!")
            return;
          }

          if (((j == 0) || (j == aMap[i].length - 2)) && 
              (portalId != "AA") && (portalId != "ZZ"))
            portalId = portalId + "1";

          portals[portalId] = { x: x, y: i }; 
        }
        else if ((i < aMap.length - 1) && IsPortalMarker(aMap[i + 1][j]))
        {
          let portalId = aMap[i][j] + aMap[i + 1][j];
          
          let top = GetMapValue(aMap, j, i - 1);
          let bottom = GetMapValue(aMap, j, i + 2);

          let y = (top == '.') && (bottom == ' ') ? i - 1 : 
                  ((top == ' ') && (bottom == '.')) ? i + 2 : -1;

          if (y == -1)
          {
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

function PrintHashMap(aPortals) 
{
  for (let p in aPortals)
    console.log(p + ": " + JSON.stringify(aPortals[p]));
}

function IsValidDirection(aMap, aDirection) 
{
  let x = aDirection.x;
  let y = aDirection.y;
  if ((y < 0) || (y >= aMap.length) ||
      (x < 0) || (x >= aMap[y].length))
    return false;

  if (aMap[y][x] == '#' || aMap[y][x] == ' ')
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

function ComputeLee(aMap, aStart) 
{
  let costMap = [];
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

function ComputeCostMap(aMap, aPortals, aMergePortals) 
{
  let portalDeps = [];
  for (let portal in aPortals)
  {
    let costMap = ComputeLee(aMap, aPortals[portal]);
    
    let deps = [];
    for (let target in aPortals)
    {
      if (portal == target)
        continue;

      let targetPos = aPortals[target]; 

      let cost = GetCost(costMap, targetPos);

      if (cost > -1) 
        deps.push({ id: target, cost: cost });
    }

    portalDeps[portal] = deps;
  }

  if (!aMergePortals)
    return portalDeps;

  for (let pp in portalDeps)
  {
    if (pp.endsWith("1"))
    {
      let portal = pp.substr(0, pp.length - 1);
      for (let i = 0; i < portalDeps[pp].length; i++) 
      {
        if (portalDeps[pp][i].id.endsWith("1"))
          portalDeps[pp][i].id = portalDeps[pp][i].id.substr(0, portalDeps[pp][i].id.length - 1);
        portalDeps[portal].push(portalDeps[pp][i]);
      }
      delete portalDeps[pp];            
    }
    else
    {
      for (let i = 0; i < portalDeps[pp].length; i++) 
      {
        if (portalDeps[pp][i].id.endsWith("1"))
          portalDeps[pp][i].id = portalDeps[pp][i].id.substr(0, portalDeps[pp][i].id.length - 1);
      }
    }
  }
  return portalDeps;
}

function GetInnerPortals(aCostMap) 
{
  let innerPortals = [];
  for (let portal in aCostMap)
  {
    if (portal.endsWith("1"))
      continue;
    
    let dists = [];
    for (let i = 0; aCostMap[portal].length; i++) 
    {
      if (aCostMap[portal][i].id.endsWith("1") || 
         (aCostMap[portal][i].id == "ZZ"))
        continue;

      dists.push(aCostMap[portal][i]);
    }

    innerPortals[portal] = dists;
  }
  
  return innerPortals;
}

function CreateDistMap(aCostMap) 
{
  let distMap = [];
  for (let portal in aCostMap)
  {
    distMap[portal] = { visited: false, dist: Number.MAX_SAFE_INTEGER };
  }

  return distMap;
}

function SortByDist(aDistMap, aElem1, aElem2) 
{
  let dist1 = aDistMap[aElem1].dist;
  let dist2 = aDistMap[aElem2].dist;

  if (dist1 < dist2)
    return -1;
  else if (dist1 > dist2)
    return 1;
  else 
    return 0;
}

function FindShortestPath(aCostMap, aStart, aEnd) 
{
  let queue = [aStart];

  let distMap = CreateDistMap(aCostMap);
  distMap[aStart].dist = 0;

  let path = [];

  while (queue.length > 0) 
  {
    let currentNode = queue.shift();
    let currentDist = distMap[currentNode].dist;

    if (currentNode == aEnd)
      break;

    let neighbours = aCostMap[currentNode];    

    for (let i = 0; i < neighbours.length; i++)
    {
      let neighbour = neighbours[i];

      if (distMap[neighbour.id].visited)
        continue;

      let estimateDist = currentDist + neighbour.cost;
      if (estimateDist < distMap[neighbour.id].dist) 
      {
        path[neighbour.id] = currentNode;
        distMap[neighbour.id].dist = estimateDist;
      }
      queue.push(neighbour.id);
    }

    distMap[currentNode].visited = true;
    queue.sort(SortByDist.bind(null, distMap));
  }

  let portalsPath = [];
  let next = aEnd;
  while(1)
  {
    portalsPath.unshift(next);

    if (next == aStart)
      break;
    next = path[next];
  }
  
  console.log(portalsPath);

  return distMap[aEnd].dist + portalsPath.length - 2;
}

function FindShortestPath2(aCostMap, aStart, aEnd) 
{
  let innerPortals = GetInnerPortals(aCostMap);
  let start = aStart;
  let minDist = Number.MAX_SAFE_INTEGER;
  let minDistNode = aStart;

  let level = 0;
  let totalDist = 0;
  while (true) 
  {
    let costMap = (level == 0) ? innerPortals : aCostMap;
    for (let node in costMap)
    {
      if (node == start)
        continue;

      let dist = FindShortestPath(costMap, start, node);
      if (dist < minDist) 
      {
        minDist = dist;
        minDistNode = node;
      }
    }

    console.log(minDistNode + " " + minDist + " " + level);

    totalDist += minDist;

    if (minDistNode.endsWith(1))
    {
      level --;  
    }
    else
    {
      level ++;
    }

    start = minDistNode;

    if ((level == 0) && (minDistNode == aEnd))
      break;
  }

  return totalDist;
}

var map = util.MapInput("./Day20TestInput3.txt", ParseMap, "\r\n");

PrintMap(map);

var portals = FindPortals(map);

PrintHashMap(portals);

var costMap = ComputeCostMap(map, portals, true);

PrintHashMap(costMap);

let dist = FindShortestPath(costMap, "AA", "ZZ");
console.log(dist);

let fullCostMap = ComputeCostMap(map, portals, false);

PrintHashMap(fullCostMap);

let total = FindShortestPath2(fullCostMap, "AA", "ZZ");

console.log(total);
