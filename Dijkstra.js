
class Node {
  constructor(aRawNode) {
    this.mRawNode = aRawNode;
    this.mId = JSON.stringify(this.mRawNode);
  }

  GetId() {
    return this.mId;
  }

  IsEqual(aNode) {
    return JSON.stringify(this.mRawNode) == JSON.stringify(aNode);
  }
}

class Graph {
  constructor() {
    this.mGraph = [];
  }

  SetNeighbours(aNodeId, aNeighbours) {
    this.mGraph[aNodeId] = aNeighbours;
  }

  AddNeighbour(aNodeId, aNeighbour) {
    if (this.mGraph[aNodeId] == undefined)
      this.mGraph[aNodeId] = [];
    this.mGraph[aNodeId].push(aNeighbour);
  }

  GetNeighbours(aNodeId) {
    return this.mGraph[aNodeId];
  }

  GetGraph() {
    return this.mGraph;
  }
}

class PriorityQueue {
  constructor(aStatNode) 
  {
    this.mQueue = [aStatNode];
    this.mSortFunc = null;
  }

  SetSortFunc(aSortFunc) {
    this.mSortFunc = aSortFunc;
  }

  Pop()
  {
    return this.mQueue.shift();
  }

  Push(aNode) {
    let found = false;
    for (let i = 0; i < this.mQueue.length; i++)
      if (JSON.stringify(aNode) == JSON.stringify(this.mQueue[i]))
      {
        found = true;
        break;
      }
    
    if (!found) 
    {
      this.mQueue.push(aNode);

      this.Sort();
    }
  }

  Sort() {
    if (this.mSortFunc)
      this.mQueue.sort(this.mSortFunc);
  }

  IsEmpty() {
    return (this.mQueue.length == 0);
  }
}

class NodeState {
  constructor() {
    this.mState = [];
    this.mSize = 0;
  }
  
  GetVisitedCount() {
    let count = 0;
    for (let state in this.mState)
      if (this.mState[state].visited)
        count++;

    return count;
  }


  GetId(aNode) {
    return JSON.stringify(aNode);
  }

  InitState(aNodeId) {

    if (this.mState[aNodeId] == undefined) 
    {
      this.mState[aNodeId] = { visited: false, dist: Number.MAX_SAFE_INTEGER };
      this.mSize++;
    }
  }

  SetDist(aNodeId, aDist) {
    this.InitState(aNodeId);
    this.mState[aNodeId].dist = aDist;
  }

  GetDist(aNodeId) {
    if (this.mState[aNodeId] == undefined)
      return Number.MAX_SAFE_INTEGER;
    return this.mState[aNodeId].dist;
  }

  SetVisited(aNodeId) {
    this.InitState(aNodeId);
    this.mState[aNodeId].visited = true;
  }

  IsVisited(aNodeId) {
    if (this.mState[aNodeId] == undefined)
      return false;
    return this.mState[aNodeId].visited;
  }
}

function SortByDist(aDistMap, aElem1Id, aElem2Id) {
  let dist1 = aDistMap.GetDist(aElem1Id);
  let dist2 = aDistMap.GetDist(aElem2Id);

  if (dist1 < dist2)
    return -1;
  else if (dist1 > dist2)
    return 1;
  else
    return 0;
}

class Dijkstra {
  constructor(aGraph) {
    this.mGraph = aGraph;
  }

  FindShortestPath(aStart, aEnd) {
    let queue = new PriorityQueue(aStart);
    let state = new NodeState();

    queue.SetSortFunc(SortByDist.bind(null, state));

    state.SetDist(aStart, 0);

    let path = [];
    while (!queue.IsEmpty()) {
      let currentNode = queue.Pop();
      let currentDist = state.GetDist(currentNode);

      if (currentNode == aEnd)
        break;

      let neighbours = this.mGraph.GetNeighbours(currentNode);

      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (state.IsVisited(neighbour.id))
          continue;

        let estimateDist = currentDist + neighbour.cost;
        if (estimateDist < state.GetDist(neighbour.id)) {
          path[neighbour.id] = currentNode;
          state.SetDist(neighbour.id, estimateDist);
        }

        queue.Push(neighbour.id);
      }

      state.SetVisited(currentNode);
    }

    let goodPath = [];
    let next = aEnd;
    while (1) {
      goodPath.unshift(next);

      if (next == aStart)
        break;
      next = path[next];
    }

    return { dist: state.GetDist(aEnd), path: goodPath };
  }
}

module.exports = {
  Node,
  NodeState,
  Graph,
  PriorityQueue,
  Dijkstra
}
