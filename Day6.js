const util = require('./Util.js');

function AddPlanetsToMap(aMap, aFirst, aSecond) 
{
  if (aMap[aFirst] === undefined) 
    aMap[aFirst] = [];

  aMap[aFirst].push(aSecond);
}

function ParseNode(aMap, aMap2, aElem) 
{
  let i = aElem.indexOf(')');           
  let first = aElem.substr(0, i);
  let second = aElem.substr(i + 1);

  AddPlanetsToMap(aMap, first, second);
  AddPlanetsToMap(aMap2, first, second);

  AddPlanetsToMap(aMap2, second, first);
}

var map = [];
var map2 = [];
util.MapInput('./Day6Input.txt', ParseNode.bind(null, map, map2), '\r\n');

for (let node in map) 
{
  console.log(node + "-->" + map[node]);
}

console.log("---------------------------------");

for (let node in map2) 
{
  console.log(node + "-->" + map2[node]);
}

function ComputeAllOrbits(aMap) 
{
  let orbits  = [];
  do
  {
    var repeat = false;
    for (let node in aMap) 
    {
      //console.log(node + "-->" + map[node]);

      let t = 0;
      if (orbits[node] !== undefined) 
      { 
        //repeat = true;
        //console.log(node);
        t = orbits[node];
      }  

      for (let i = 0; i < map[node].length; i++)
      {
        let planet = map[node][i];
        let newOrbitCount = t + 1;

        if (orbits[planet] === undefined)
        {
          orbits[planet] = newOrbitCount;
          repeat = true;
        }
        else 
        {
          if (newOrbitCount > orbits[planet]) 
          {
            orbits[planet] = newOrbitCount;
            repeat = true;
          }
        }
      }
    }
    //console.log(orbits);
  }
  while(repeat);

  let count = 0;
  for (let o in orbits) 
  {
    //console.log("[" + o + ": " + orbits[o] + "]");
    count += orbits[o];
  }

  console.log(count);
}

function Add(aStack, aElem, aPath) 
{
  let found = false;
  for (let i = 0; i < aStack.length; i++)
    if (aStack[i] == aElem)
      found = true;

  if (!found)
    aStack.push( { "n": aElem, "p": aPath });
}

function FindPath(aMap, aStart, aEnd) 
{
  let stack = [];
  stack.push( { "n": aStart, "p": [] });

  let visited = [];
  while (stack.length > 0)
  {
    let node = stack.pop();
    visited[node.n] = 1;

    for (i = 0; i < aMap[node.n].length; i++) 
    {
      let childNode = aMap[node.n][i];

      if (visited[childNode] == 1)
        continue;
 
      if (childNode == aEnd) 
        return node.p.length - 1;

      let path = util.CopyObject(node.p);
      path.push(childNode);
      Add(stack, childNode, path);
    }
  }
}

ComputeAllOrbits(map);

console.log(FindPath(map2, 'YOU', 'SAN'));
