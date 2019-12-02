class ListNode {
  constructor(aValue) 
  {
    this.mValue = aValue;
    this.mNext = null;
    this.mPrev = null;
  }
}

class LinkedList {
  constructor() 
  {
    this.mHead = null;
    this.mTail = null;
    this.mSize = 0;
  }

  GetTail() 
  {
    return this.mTail;
  }

  GetHead() 
  {
    return this.mHead;
  }

  GetSize() 
  {
    return this.mSize;
  }

  AddTail(aValue) 
  {
    let listNode = new ListNode(aValue);

    if (this.mTail == null) {
      this.mTail = listNode;
      this.mHead = listNode;
    }
    else
    {
      this.mTail.mNext = listNode;
      listNode.mPrev = this.mTail;
      this.mTail = listNode;
    }

    this.mSize ++;

    return listNode;
  }

  AddHead(aValue) 
  {
    let listNode = new ListNode(aValue);
   
    if (this.mTail == null) {
      this.mTail = listNode;
      this.mHead = listNode;
    }
    else 
    {
      listNode.mNext = this.mHead;
      this.mHead.mPrev = listNode;
      this.mHead = listNode;
    }

    this.mSize ++;

    return listNode;
  }

  AddAfter(aNode, aValue) 
  {
    let listNode = new ListNode(aValue);

    if (aNode)
    {
      let next = aNode.mNext;
      if (next) 
        next.mPrev = listNode;

      aNode.mNext = listNode;
      listNode.mNext = next;
      listNode.mPrev = aNode;
    }

    if (aNode == this.mTail)
      this.mTail = listNode;

    this.mSize ++;

    return listNode;
  }

  GetValueAt(aIndex) 
  {
    let node = this.GetNodeAt(aIndex)
    if (node)
      return node.mValue;
    return null;
  }

  GetNodeAt(aIndex) 
  {
    let i = 0;
    let node = this.mHead;
    while (node)
    {
      if (aIndex == i)
        return node;
      node = node.mNext;
      i++;
    }

    return null;
  }

  GetNodeNthPosBackFromNode(aNode, aPosNumber) 
  {
    let node = aNode;
    let count = aPosNumber;
    while (count > 0)
    {
      node = node.mPrev;
      if (node == null)
        node = this.mTail;
      count --;
    }
    
    return node;
  }

  RemoveNode(aNode) 
  {
    if (aNode == this.mHead)
    {
      let next = aNode.mNext;
      if (next)
        next.mPrev = null;
      aNode.mNext = null;
      this.mHead = next;
    }
    else if (aNode == this.mTail)  
    {
      let prev = aNode.mPrev;
      if (prev)
        prev.mNext = null;
      aNode.mPrev = null;
      this.mTail = prev;   
    }
    else 
    {
      let prev = aNode.mPrev;
      prev.mNext = aNode.mNext;
      aNode.mNext.mPrev = prev;
      aNode.mNext = null;
      aNode.mPrev = null;
    }

    this.mSize --;
  }

  RemoveNodeAt(aIndex) 
  {
    let node = this.GetNodeAt(aIndex);
    if (node)
      this.RemoveNode(node);
    return node;
  }

  PrintList() 
  {
    console.log();
    let node = this.mHead;
    while (node)
    {
      console.log(JSON.stringify(node.mValue));
      node = node.mNext;
    }
  }

  VisitList(aFunction, aTotal) 
  {
    let node = this.mHead;
    while (node)
    {
      aTotal += aFunction(node, aTotal);
      node = node.mNext;
    }
  }
}

module.exports = {
  ListNode,
  LinkedList
}
