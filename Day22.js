const util = require('./Util.js');
const list = require('./LinkedList.js');
var bigInt = require("big-integer");

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

function DealNewStack(aCardsNumber, aCardPos) {
  return aCardsNumber - aCardPos - 1;
}

function CutN(aCardsNumber, aCardPos, aCardsToCut) {
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

function DealWithNIncrement(aCardsNumber, aCardPos, aIncrement) {
  let posWithIncrement = aCardPos * aIncrement;
  let newCardPos = posWithIncrement % aCardsNumber;
  return newCardPos;
}

function ModularDivide(aBase, aExponent, aModular) {
  let inv = bigInt(aExponent).modInv(aModular);
  let c = aBase.multiply(inv);
  return c.mod(aModular);
}

function DealCards(aOps, aCardsNumber, aCardPos) {

  let cardPos = aCardPos;
  for (let i = 0; i < aOps.length; i++)
  {
    let dealOp = ops[i];
    if (dealOp.op == OP_DEAL_NEW)
      cardPos = DealNewStack(aCardsNumber, cardPos);
    else if (dealOp.op == OP_CUTN)
      cardPos = CutN(aCardsNumber, cardPos, dealOp.val);
    else if (dealOp.op == OP_DEAL_INC) 
    {
      cardPos = DealWithNIncrement(aCardsNumber, cardPos, dealOp.val);
    }
    else 
      console.log("Invalid deal operation!");
  }

  return cardPos;
}

function DealBig(aOps, aCardsNumber, aCardPos, aDealTimes) {
  let firstCardPos = DealCards(aOps, aCardsNumber, 0);
  let secondCardPos = DealCards(aOps, aCardsNumber, 1);
  let thirdCardPos = DealCards(aOps, aCardsNumber, 2);

  let b = firstCardPos;
  let a = thirdCardPos - secondCardPos;

  let bigA = bigInt(a).modPow(aDealTimes, aCardsNumber);

  let bigB = bigInt(b).multiply(ModularDivide(bigA.subtract(1), a - 1, aCardsNumber)).mod(aCardsNumber);

  let tt = aCardPos - bigB;
  if (tt < 0)
    tt += aCardsNumber;

  let cardNumber = ModularDivide(bigInt(tt).mod(aCardsNumber), bigA, aCardsNumber).mod(aCardsNumber);

  return cardNumber;
}

var ops = util.MapInput('./Day22Input.txt', ParseLine, "\r\n");

console.log(DealCards(ops, 10007, 2019));

console.log(DealBig(ops, 119315717514047, 2020, 101741582076661).toString());
