const util = require('./Util.js');

function ParseReactions(aElem) 
{
  let reaction = aElem.split(' => ');

  let rawInputs =  reaction[0].split(', ');

  let inputs = rawInputs.map(ParseChemical);
  
  let output = ParseChemical(reaction[1]);

  return { input: inputs, output: output };
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

function IsORE(aReactionPot) 
{
  for (let i = 0; i < aReactionPot.length; i++)
    if (aReactionPot[i].r != 'ORE')
      return false;
  return true;
}

function CountORE(aReactionPot)
{
  let count = 0;
  for (let i = 0; i < aReactionPot.length; i++)
    if (aReactionPot[i].r == 'ORE')
      count += Math.ceil(aReactionPot[i].c);
  
  return count;
}

function GetInputs(aOutput, aReactions) 
{
  for (let i = 0; i < aReactions.length; i++) 
  {
    let output = aReactions[i].output;
    let input = util.CopyObject(aReactions[i].input);
    if (aOutput.r == output.r)
    {
      if (aOutput.c > output.c) 
      {
        let factor = Math.ceil(aOutput.c / output.c);
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
  let count = 0;
  for (let i = 0; i < aReactionPot.length; i++)
    if (aReactionPot[i].r != 'ORE')
    {
      let input = GetInputs(aReactionPot[i], aReactions);

      if (!aReduceORE && input[0].r == 'ORE') 
      {
        AddToReactionPot(reactionPot, [aReactionPot[i]]);
        //reactionPot.push(aReactionPot[i]);
        continue;
      }

      count++;

      AddToReactionPot(reactionPot, input);
      //for (let j = 0; j < input.length; j++)
      //  reactionPot.push(input[j]);
    }
    else
      reactionPot.push(aReactionPot[i]);

  return { pot: reactionPot, count: count };
}

var reactions = util.MapInput("./Day14TestInput4.txt", ParseReactions, "\r\n");

PrintReactions(reactions);

var fuel = FindFuel(reactions);

//PrintReactions([fuel]);

var reactionPot = util.CopyObject(fuel.input);

console.log();
while (true)
{
  console.log();
  console.log(PrintChemicals(reactionPot));

  let ret = MakeReaction(reactionPot, reactions, false);

  if (ret.count == 0)
  {
    //let noDupPot = [];
    //AddToReactionPot(noDupPot, reactionPot);
    //console.log();
    //console.log(PrintChemicals(noDupPot));
    reactionPot = MakeReaction(reactionPot, reactions, true).pot;
    break;
  }
  else
    reactionPot = ret.pot;
}

console.log(CountORE(reactionPot));
