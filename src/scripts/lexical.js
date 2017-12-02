const regex = require('./regex');


function getLines(data) {
  var lines=[];
  var lineArray=[]
  data=data.split(",(?=([^']*'[^']*')*[^']*$)");
  data.forEach(
    function(segment) {
        lines = lines.concat(segment.split(/\r?\n/));
      });
    lines.forEach(function(line) {
        var fixedLine=[]
        var match=(line.match(/(?=\S)[^"\s]*(?:"[^\\"]*(?:\\[\s\S][^\\"]*)*"[^"\s]*)*/g))
        for (var i in match){
          fixedLine.push(match[i].trim());
        };
        lineArray.push(fixedLine)
    })
  return lineArray;
}

function addLexeme(word,description,lexemeline) {
  if (word !== "") {
    lexemeline.push([word,description]);
  }
}

function getLiteralType(word) {
  if (regex.NUMBR.test(word)) {
    return 'NUMBR'
  }
  else if (regex.NUMBAR.test(word)) {
    return 'NUMBAR'
  }
  else if (regex.YARN.test(word)) {
    return 'YARN'
  }
  else if (regex.TROOF.test(word)) {
    return 'TROOF'
  }
  else if (regex.NOOB.test(word)) {
    return 'NOOB'
  }
  else if (regex.VARIABLE.test(word)) {
    return 'Variable Identifier'
  }else{
    return 'UNKNOWN'
  }
}

function getBinary(word){
  if (regex.SUMOF.test(word)){
    return 'Sum Operator'
  }
  else if (regex.DIFFOF.test(word)) {
    return 'Difference Operator'
  }
  else if (regex.PRODUKTOF.test(word)) {
    return 'Product Operator'
  }
  else if (regex.QUOSHUNTOF.test(word)) {
    return 'Division Operator'
  }
  else if (regex.MODOF.test(word)) {
    return 'Modulo Operator'
  }
  else if (regex.BIGGROF.test(word)) {
    return 'Bigger Operator'
  }
  else if (regex.SMALLROF.test(word)) {
    return 'Smaller Operator'
  }
  else if (regex.BOTHOF.test(word)) {
    return 'AND Operator'
  }
  else if (regex.EITHEROF.test(word)) {
    return 'OR Operator'
  }
  else if (regex.WONOF.test(word)) {
    return 'XOR Operator'
  }
  else if (regex.BOTHSAEM.test(word)) {
    return 'Equality Operator'
  }
  else{
    return 'UNKNOWN'
  }
}

function getInfinity(word){
  if (regex.ALLOF.test(word)) {
    return 'Boolean Infinite Arity AND'
  }
  else if (regex.ANYOF.test(word)) {
    return 'Boolean Infinite Arity OR'
  }
  else if (regex.SMOOSH.test(word)) {
    return 'String Concatenation'
  }
  else if (regex.VISIBLE.test(word)){
    return 'Output Keyword'
  }
}

function addLexemeLater(word,description,lexemestack){
  lexemestack.push([word,description]);
}

export function parser(data) {
  var lines=getLines(data);
  var lexemes=[];
  var lexemeline=[]
  var lexemestack=[]
  var comment=false;
  for (var i = 0; i < lines.length ; i+=1) {
    var line = lines[i]
    var infinity = false
    var btwIndex=line.indexOf('BTW')
    // if (line.join(' ')==='') {
    //   continue
    // }
    // Comments START
    if (btwIndex!==-1) {
      var lsplice=line.splice(line.indexOf('BTW'));
      addLexemeLater(lsplice.splice(0,1).join(),'Comment Delimiter',lexemestack);
      if (lsplice.length!==0){
        addLexemeLater(lsplice.splice(0,lsplice.length).join(' '),'Comment',lexemestack);
        i-=1
        continue
      }
    }
    else if (regex.OBTW.test(line.slice(0,1).join())) {
      addLexeme(line.splice(0,1).join(),'Comment Delimiter',lexemeline);
      if(line.length !== 0){
        addLexeme(line.splice(0,line.length).join( ),'Comment',lexemeline);
      }
      comment=true
    }
    else if (regex.TLDR.test(line.slice(0,1).join())) {
      addLexeme(line.splice(0,1).join(),'Comment Delimiter',lexemeline);
      comment=false
    }
    else if (comment) {
      addLexeme(line.splice(0,line.length).join( ),'Comment',lexemeline);
    }
    // Comments END
    // Code Delimiter START
    else if (regex.HAI.test(line.slice(0,1).join())) {
      addLexeme(line.splice(0,1).join(),'Code Delimiter',lexemeline);
    }
    else if (regex.KTHXBYE.test(line.slice(0,1).join())) {
      addLexeme(line.splice(0,1).join(),'Code Delimiter',lexemeline);
    }
    // Code Delimiter END
    else if (regex.IHASA.test(line.slice(0,3).join(' '))) {
      addLexeme(line.slice(0,3).join(' '),'Variable Declaration',lexemeline);
      addLexeme(line.slice(3,4).join(),'Variable Identifier',lexemeline);
      line.splice(0,4)
      if(regex.ITZ.test(line.slice(0,1).join())){
        addLexeme(line.slice(0,1).join(),'Variable Assignment',lexemeline);
        line.splice(0,1).join();
      }
    }
    // SINGLE
    else if (regex.GIMMEH.test(line.slice(0,1).join())) {
      addLexeme(line.splice(0,1).join(),'Input Identifier',lexemeline)
    }

    // SINGLE END
    // IF THEN
    else if (regex.ORLY.test(line.slice(0,2).join(' '))){
      addLexeme(line.splice(0,2).join(' '),'If-then Delimiter',lexemeline)
    }
    else if (regex.YARLY.test(line.slice(0,2).join(' '))){
      addLexeme(line.splice(0,2).join(' '),'If Clause',lexemeline)
    }
    else if (regex.NOWAI.test(line.slice(0,2).join(' '))){
      addLexeme(line.splice(0,2).join(' '),'Else Clause',lexemeline)
    }
    // IF THEN END
    // SWITCH-CASE START
    else if (regex.WTF.test(line.slice(0,1).join())){
      addLexeme(line.splice(0,1).join(),'Switch-case Delimiter',lexemeline)
    }
    else if (regex.OMG.test(line.slice(0,1).join())){
      addLexeme(line.splice(0,1).join(),'Switch-case Case',lexemeline)
    }
    else if (regex.OMGWTF.test(line.slice(0,1).join())){
      addLexeme(line.splice(0,1).join(),'Switch-case Default Case',lexemeline)
    }
    else if (regex.GTFO.test(line.slice(0,1).join())){
      addLexeme(line.splice(0,1).join(),'Break Statement',lexemeline)
    }
    // SWITCH-CASE END
    // IF / SWITCH-CASE DELIMITER
    else if (regex.OIC.test(line.slice(0,1).join())){
      addLexeme(line.splice(0,1).join(),'If-then/Switch-case Delimiter',lexemeline)
    }
    // IF / SWITCH-CASE DELIMITER END
    // R
    else if (regex.R.test(line.join(' '))) {
      addLexeme(line.splice(0,1).join(),'Variable Identifier',lexemeline)
      addLexeme(line.splice(0,1).join(),'Assignment Statement',lexemeline)
    }
    // R END
    // INFINITYTWO

    // INFINITYTWOEND
    // INFINITYONE
    else if (regex.INFINITYONE.test(line.slice(0,1).join())){
      addLexeme(line.slice(0,1).join(),getInfinity(line.slice(0,1).join()),lexemeline)
      line.splice(0,1).join()
      infinity = true
    }
    // INFINITYONEEND
    // loop other
    for (var j = 0; j<line.length+1; j += 1){

      if (regex.BINARY.test(line.slice(0,2).join(' '))) {
        addLexeme(line.slice(0,2).join(' '),getBinary(line.slice(0,2).join(' ')),lexemeline);
        line.splice(0,2).join();
        j=0;
      }
      else if (regex.INFINITYTWO.test(line.slice(0,2).join(' '))) {
        console.log('sasa')
        addLexeme(line.slice(0,2).join(' '),getInfinity(line.slice(0,2).join(' ')),lexemeline)
        line.splice(0,2).join()
        j = 0
      }
      else if (regex.DIFFRINT.test(line.slice(0,1).join())) {
          addLexeme(line.slice(0,1).join(),'Inequality Operator',lexemeline);
          line.splice(0,1)
          j=0
      }
      else if (regex.AN.test(line.slice(0,1).join())) {
        addLexeme(line.splice(0,1).join(),'Combiner',lexemeline);
        j=0
      }
      else if (regex.MKAY.test(line.slice(0,1).join())) {
        addLexeme(line.splice(0,1).join(),'Infinity Delimiter',lexemeline);
        infinity = false
        j=0
      }
      else if (regex.NOT.test(line.slice(0,1).join())) {
        addLexeme(line.splice(0,1).join(),'Negate Operator',lexemeline)
        j=0
      }
      else if (regex.LITERAL.test(line.slice(0,1).join())) {
        addLexeme(line.slice(0,1).join(),getLiteralType(line.slice(0,1).join()),lexemeline);
        line.splice(0,1).join()
        j=0
      }
      else if (line[0]!==undefined){
        addLexeme(line.join(' '),'Unknown Token',lexemeline)
      }
    }
    if(lexemestack.length){
      lexemeline=lexemeline.concat(lexemestack)
      lexemestack=[]
    }
    lexemes=lexemes.concat([lexemeline])
    lexemeline=[]
  }
  return (lexemes)
}
