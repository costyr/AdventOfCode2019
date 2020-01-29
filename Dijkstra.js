
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
    this.mQueue = [];
    if (aStatNode != undefined)
      this.mQueue.push(aStatNode);
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
  constructor(aGraph, aStateExtra) {
    this.mGraph = aGraph;
    this.mStateExtra = aStateExtra;
  }

  CreateQueueNode(aCurrentNode, aNeighbourId) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.CreateQueueNode(aCurrentNode, aNeighbourId);
    return aNeighbourId;
  }

  ComputeStateId(aCurrentNode, aNeighbourId) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.ComputeStateId(aCurrentNode, aNeighbourId);

    if (aNeighbourId == undefined)
      return aCurrentNode;
    return aNeighbourId;  
  }

  SetStartState(aState, aStart) {
    if (this.mStateExtra != undefined) {
      this.mStateExtra.SetStartState(aState, aStart);
      return;
    }
    aState.SetDist(aStart, 0);
  }

  InitQueue(aQueue, aStart) {
    if (this.mStateExtra != undefined) {
      this.mStateExtra.InitQueue(aQueue, aStart);
      return;
    }
    aQueue.Push(aStart);
  }

  GetNodeId(aNode) {
    if (this.mStateExtra != undefined) 
      return this.mStateExtra.GetNodeId(aNode);

    return aNode;
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {
    if (this.mStateExtra != undefined) 
      return this.mStateExtra.EndNodeReached(aCurrentNode, aEndNodeId);

    return aCurrentNode == aEndNodeId;
  }

  IsValidNeighbour(aCurrentNode, aNeighbourId) {
    if (this.mStateExtra != undefined) 
      return this.mStateExtra.IsValidNeighbour(aCurrentNode, aNeighbourId);
    return true;
  }

  FindShortestPath(aStart, aEnd) {
    let queue = new PriorityQueue();
    this.InitQueue(queue, aStart);

    let state = new NodeState();
    this.SetStartState(state, aStart);

    if (this.mStateExtra != undefined)
      queue.SetSortFunc(this.mStateExtra.SortByDist.bind(null, state))
    else
      queue.SetSortFunc(SortByDist.bind(null, state));

    let path = [];
    while (!queue.IsEmpty()) {
      let currentNode = queue.Pop();

      let currentNodeStateId = this.ComputeStateId(currentNode);

      let currentDist = state.GetDist(currentNodeStateId);

      if (this.EndNodeReached(currentNode, aEnd))
        break;

      let neighbours = this.mGraph.GetNeighbours(this.GetNodeId(currentNode));

      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (!this.IsValidNeighbour(currentNode, neighbour.id))
          continue;

        let neighbourStateId = this.ComputeStateId(currentNode, neighbour.id);

        if (state.IsVisited(neighbourStateId))
          continue;

        let estimateDist = currentDist + neighbour.cost;
        if (estimateDist < state.GetDist(neighbourStateId)) {
          path[neighbourStateId] = currentNodeStateId;
          state.SetDist(neighbourStateId, estimateDist);
        }

        queue.Push(this.CreateQueueNode(currentNode, neighbour.id));
      }

      state.SetVisited(currentNodeStateId);
    }

    let startNodeStateId = this.ComputeStateId(aStart);
    let endNodeStateId = this.ComputeStateId(aEnd);

    let goodPath = [];
    let next = endNodeStateId;
    while (1) {
      goodPath.unshift(next);

      if (next == startNodeStateId)
        break;
      next = path[next];
    }

    return { dist: state.GetDist(endNodeStateId), path: goodPath };
  }
}

module.exports = {
  NodeState,
  Graph,
  PriorityQueue,
  Dijkstra
}
