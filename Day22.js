const util = require('./Util.js');
const list = require('./LinkedList.js');

const OP_CUTN = 0;
const OP_DEAL_NEW = 1;
const OP_DEAL_INC = 2;

function ParseLine(aLine) {
  if (aLine.startsWith("cut"))
  {
    let words = aLine.split(' ');
    return { op: OP_CUTN, val: parseInt(words[1])};
  }
  else if (aLine.startsWith("deal with increment"))
  {
    let words = aLine.split(' ');
    return { op: OP_DEAL_INC, val: parseInt(words[3])};
  }
  else if (aLine.startsWith("deal into new stack"))
  {
    let words = aLine.split(' ');
    return { op: OP_DEAL_NEW, val: 0 };
  }
  else 
    console.log("Parse Error!");
}

function CreateCardStack(aCardsNumber) {
  let cardStack = new list.LinkedList();

  for (let i = 0; i < aCardsNumber; i++)
    cardStack.AddTail(i);

  return { stack: cardStack, dir: 0 };
}

function DealNewStack(aCardStack) {
  if (aCardStack.dir == 0)
    aCardStack.dir = 1;
  else 
    aCardStack.dir = 0;
}

function CutN(aCardStack, aCardsToCut) {

  if (aCardsToCut == 0)
    return;

  if (aCardsToCut < 0)
    aCardsToCut = aCardStack.stack.GetSize() - Math.abs(aCardsToCut);

  if (aCardStack.dir == 0) {
    let list = aCardStack.stack.SplitListAt(aCardsToCut);
    aCardStack.stack.AppendList(list);
  }
  else 
  {
    let nodeIndex = aCardStack.stack.GetSize() - aCardsToCut;
    let list = aCardStack.stack.SplitListAt(nodeIndex);
    aCardStack.stack.AppendList(list);
  }
}

function DealWithNIncrement(aCardStack, aIncrement) {
  aCardStack.stack.RandomizeNth(aIncrement, aCardStack.dir == 1);
  if (aCardStack.dir == 1)
    aCardStack.dir = 0;
}

function PrintCardStack(aCardStack) {
  console.log(aCardStack.dir ? aCardStack.stack.ToStringReverse() : aCardStack.stack.ToString());
}

function VisitCard(aContext, aValue, aIndex) {
  if (aValue == aContext.targetValue)
    aContext.cardIndex = aIndex;
}

function DealCards(aOps, aCardStack, aCardNumber) {

  //PrintCardStack(aCardStack);

  for (let i = 0; i < aOps.length; i++)
  {
    let dealOp = ops[i];
    if (dealOp.op == OP_DEAL_NEW)
      DealNewStack(aCardStack);
    else if (dealOp.op == OP_CUTN)
      CutN(aCardStack, dealOp.val);
    else if (dealOp.op == OP_DEAL_INC) 
    {
      DealWithNIncrement(aCardStack, dealOp.val);
    }
    else 
      console.log("Invalid deal operation!");

    //PrintCardStack(aCardStack);
  }

  let context = { targetValue: aCardNumber, cardIndex: 0 };
  if (aCardNumber >= 0)
  {
    aCardStack.stack.VisitList2(VisitCard.bind(null, context));
    console.log(context.cardIndex);
  }
}

function DealNewStack2(aCardsNumber, aCardPos) {
  return aCardsNumber - aCardPos - 1;
}

function CutN2(aCardsNumber, aCardPos, aCardsToCut) {
  let newCardPos = 0;
  if (aCardsToCut > 0) 
  {
    if (aCardPos > aCardsToCut)
      newCardPos = aCardPos - aCardsToCut;
    else 
      newCardPos = aCardPos + (aCardsNumber - aCardsToCut);
  }
  else
  {
    let cardsToCut = Math.abs(aCardsToCut);
    if (aCardPos > cardsToCut)
      newCardPos = aCardPos - (aCardsNumber - cardsToCut);
    else
      newCardPos = aCardPos + cardsToCut;
  }

  return newCardPos;
}

function DealWithNIncrement2(aCardsNumber, aCardPos, aIncrement) {
  let posWithIncrement = aCardPos * aIncrement;
  let newCardPos = posWithIncrement % aCardsNumber;
  return newCardPos;
}

function DealCards2(aOps, aCardsNumber, aCardPos) {

  let cardPos = aCardPos;
  for (let i = 0; i < aOps.length; i++)
  {
    let dealOp = ops[i];
    if (dealOp.op == OP_DEAL_NEW)
      cardPos = DealNewStack2(aCardsNumber, cardPos);
    else if (dealOp.op == OP_CUTN)
      cardPos = CutN2(aCardsNumber, cardPos, dealOp.val);
    else if (dealOp.op == OP_DEAL_INC) 
    {
      cardPos = DealWithNIncrement2(aCardsNumber, cardPos, dealOp.val);
    }
    else 
      console.log("Invalid deal operation!");
  }

  console.log(cardPos);

  return cardPos;
}

function DealBig(aOps, aCardsNumber, aCardPos, aDealTimes) {
  let cardPos = aCardPos;
  for (let i = 0; i < aDealTimes; i++) 
  {
    let a = DealCards2(aOps, aCardsNumber, 2020);
    let b = DealCards2(aOps, aCardsNumber, 2021);
    let c = DealCards2(aOps, aCardsNumber, 2022);
    let d = DealCards2(aOps, aCardsNumber, 2023);
    let e = DealCards2(aOps, aCardsNumber, 2024);
    let f = DealCards2(aOps, aCardsNumber, 2025);

    console.log("-------");
    console.log(b - a);
    console.log(c - b);
    console.log(d - c);
    console.log(e - d);
    console.log(f - e);
    console.log("-------");

    cardPos = DealCards2(aOps, aCardsNumber, cardPos);
  }

  //console.log(cardPos);
}

var ops = util.MapInput('./Day22Input.txt', ParseLine, "\r\n");

console.log(ops);

//var cardStack = CreateCardStack(10);

//PrintCardStack(cardStack);

//DealNewStack(cardStack);

//PrintCardStack(cardStack);

//CutN(cardStack, -4);

//PrintCardStack(cardStack);

//DealWithNIncrement(cardStack, 3);

//PrintCardStack(cardStack);

//let cardStack = CreateCardStack(10007);

//DealCards(ops, cardStack, 2019);

//DealCards2(ops, 119315717514047, 2020);

DealBig(ops, 10007/*19315717514047*/, 2020, 100/*101741582076661*/);
