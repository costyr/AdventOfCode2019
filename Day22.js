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

  console.log(cardPos);

  return cardPos;
}

function DealBig(aOps, aCardsNumber, aCardPos, aDealTimes) {
  let cardPos = aCardPos;
  for (let i = 0; i < aDealTimes; i++) 
  {
    let a = DealCards(aOps, aCardsNumber, 2020);
    let b = DealCards(aOps, aCardsNumber, 2021);
    let c = DealCards(aOps, aCardsNumber, 2022);
    let d = DealCards(aOps, aCardsNumber, 2023);
    let e = DealCards(aOps, aCardsNumber, 2024);
    let f = DealCards(aOps, aCardsNumber, 2025);

    console.log("-------");
    console.log(b - a);
    console.log(c - b);
    console.log(d - c);
    console.log(e - d);
    console.log(f - e);
    console.log("-------");

    cardPos = DealCards(aOps, aCardsNumber, cardPos);
  }

  //console.log(cardPos);
}

function ModularDivide(a, b, n) {
  let inv = bigInt(b).modInv(n);
  let c = a.multiply(inv);
  return c.mod(n);
}

var ops = util.MapInput('./Day22Input.txt', ParseLine, "\r\n");

console.log(ops);

let x = DealCards(ops, 119315717514047, 0);
let y = DealCards(ops, 119315717514047, 1);
let z = DealCards(ops, 119315717514047, 2);
let t = DealCards(ops, 119315717514047, 100);

let u = (2019 * 2183 + 2129) % 10007;
console.log(u);

let ty = (100 * 40286879916729 + 37260864847148) % 119315717514047;

console.log(ty);

//DealCards(ops, 119315717514047, 2020);

//DealBig(ops, 10007/*19315717514047*/, 2020, 100/*101741582076661*/);

let ff = bigInt(40286879916729).modPow(101741582076661, 119315717514047);

let gg = bigInt(37260864847148).multiply(modularDivide(bigInt(40286879916729).modPow(101741582076661, 119315717514047).subtract(1), 40286879916728, 119315717514047)).mod(119315717514047);

let tt = 2020 - gg;
tt += 119315717514047;

let rr = bigInt(tt).mod(119315717514047);

let xx = modularDivide(rr, ff, 119315717514047).mod(119315717514047);

console.log(ff.toString());
console.log(gg.toString());
console.log(xx.toString());
