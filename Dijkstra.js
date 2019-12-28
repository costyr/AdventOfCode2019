
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

  SetNeighbours(aNode, aNeighbours) {
    this.mGraph[aNode.GetId()] = aNeighbours;
  }

  GetNeighbours(aNode) {
    return this.mGraph[aNode.GetId()];
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

  InitState(aNode) {

    let nodeId = this.GetId(aNode);

    if (this.mState[nodeId] == undefined) 
    {
      this.mState[nodeId] = { visited: false, dist: Number.MAX_SAFE_INTEGER };
      this.mSize++;
    }
  }

  SetDist(aNode, aDist) {
    this.InitState(aNode);
    this.mState[this.GetId(aNode)].dist = aDist;
  }

  GetDist(aNode) {
    if (this.mState[this.GetId(aNode)] == undefined)
      return Number.MAX_SAFE_INTEGER;
    return this.mState[this.GetId(aNode)].dist;
  }

  SetVisited(aNode) {
    this.InitState(aNode);
    this.mState[this.GetId(aNode)].visited = true;
  }

  IsVisited(aNode) {
    if (this.mState[this.GetId(aNode)] == undefined)
      return false;
    return this.mState[this.GetId(aNode)].visited;
  }
}

class Dijkstra {
  constructor(aGraph) {
    this.mGraph = aGraph;
  }

  FindShortestPath(aStart, aEnd) {
    let queue = new PriorityQueue(aStart);
    let state = new NodeState();

    state.SetDist(aStart, 0);

    let path = [];
    while (!queue.IsEmpty()) {
      let currentNode = queue.Pop();
      let currentDist = state.GetDist(currentNode);

      if (currentNode.IsEqual(aEnd))
        break;

      let neighbours = this.mGraph.GetNeighbours(currentNode);

      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (state.IsVisited(neighbour))
          continue;

        let estimateDist = currentDist + neighbour.cost;
        if (estimateDist < state.GetDist(neighbour)) {
          path[neighbour.GetId()] = currentNode.GetId();
          state.SetDist(neighbour, estimateDist);
        }

        queue.Push(neighbour.GetNode());
      }

      state.SetVisited(currentNode);
    }

    let goodPath = [];
    let next = aEnd.GetId();
    while (1) {
      goodPath.unshift(next);

      if (next == aStart.GetId())
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
