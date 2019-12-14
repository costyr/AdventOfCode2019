const util = require('./Util.js');

function ParseReactions(aElem) 
{
  let reaction = aElem.split(' => ');

  let rawInputs =  reaction[0].split(', ');

  let inputs = rawInputs.map(ParseChemical);
  
  let output = ParseChemical(reaction[1]);

  return { input: inputs, output: output, u: false };
}

function ParseChemical(aElem) 
{
  let chemical = aElem.split(' ');

  return { c: parseInt(chemical[0]), r: chemical[1]}
}

function PrintChemicals(aChemical) 
{
  let line = "";
  for (let i = 0; i < aChemical.length; i++) 
  {
    let chemical = aChemical[i];
    if (line.length > 0)
      line += ", ";
    line += chemical.c.toString() + " " + chemical.r;
  }

  return line;
}

function PrintReactions(aReactions) 
{
  for (let i = 0; i < aReactions.length; i++)
    console.log(PrintChemicals(aReactions[i].input) + " => " + PrintChemicals([aReactions[i].output]));
}

function FindFuel(aReactions) 
{
  for (let i = 0; i < aReactions.length; i++)
    if (aReactions[i].output.r == 'FUEL')
      return aReactions[i];
}

function CountORE(aReactionPot)
{
  let count = 0;
  for (let i = 0; i < aReactionPot.length; i++)
    if (aReactionPot[i].r == 'ORE')
      count += Math.ceil(aReactionPot[i].c);
  
  return count;
}

function FindInInput(aChemical, aReactions)
{
  for (let i = 0; i < aReactions.length; i++) 
  {
    if (aReactions[i].u)
      continue;
    let input = aReactions[i].input;

    for (let j = 0; j < input.length; j++)
      if (input[j].r == aChemical.r)
        return true;
  }

  return false;
}

function GetInputs(aChemical, aReactions) 
{
  for (let i = 0; i < aReactions.length; i++) 
  {
    let output = aReactions[i].output;
    let input = util.CopyObject(aReactions[i].input);
    if (aChemical.r == output.r)
    {
      aReactions[i].u = true;

      if (FindInInput(aChemical, aReactions))
      {
        aReactions[i].u = false;
        return null;
      }

      if (aChemical.c > output.c) 
      {
        let factor = Math.ceil(aChemical.c / output.c);
        //console.log(factor);
        for (let j = 0; j < input.length; j++)
          input[j].c *= factor;
      }
      
      return input;
    }
  }
  return null;
}

function AddToReactionPot(aReactionPot, aChemicals) 
{
  for (let i = 0; i < aChemicals.length; i++)
  {
    let found = false;
    for (let j = 0; j < aReactionPot.length; j++)
      if (aChemicals[i].r == aReactionPot[j].r) 
      {
        aReactionPot[j].c += aChemicals[i].c;
        found = true;
        break;
      }

    if (!found)
      aReactionPot.push(aChemicals[i]);
  }
}

function MakeReaction(aReactionPot, aReactions, aReduceORE) 
{
  let reactionPot = [];
  for (let i = 0; i < aReactionPot.length; i++)
  {
    let input = GetInputs(aReactionPot[i], aReactions);

    if (input == null) 
    {
      AddToReactionPot(reactionPot, [aReactionPot[i]]);
      continue;
    }

    AddToReactionPot(reactionPot, input);
  }

  return reactionPot;
}

var reactions = util.MapInput("./Day14TestInput4.txt", ParseReactions, "\r\n");

PrintReactions(reactions);

var fuel = FindFuel(reactions);
fuel.u = true;

//PrintReactions([fuel]);

var reactionPot = util.CopyObject(fuel.input);

console.log();
while (true)
{
  console.log();
  console.log(PrintChemicals(reactionPot));

  reactionPot = MakeReaction(reactionPot, reactions);

  if (reactionPot.length == 1)
    break;
}

console.log(CountORE(reactionPot));
