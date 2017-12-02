var deepcopy = require("deepcopy");
const regex = require('./regex');

export function syntax(symbolTable,Olines){
  var value
  for (var key in symbolTable) delete symbolTable[key];
  symbolTable['IT'] = [undefined, 'NOOB']
  var progstart = false
  var progend = false
  var temp
  var lines = deepcopy(Olines)
  var result
  var output = ''
  removeComment(lines)
  for(var i = 0;i < lines.length; i += 1){
    var line = lines[i]
    if (line.length === 0) {
      continue
    }
    else if (regex.HAI.test(line[0][0]) && progstart === true) {
      return output+='SYNTAX ERROR: Duplicate HAI detected\n'
    }
    else if(regex.HAI.test(line[0][0])){
      progstart = true
    }
    else if (progstart === false) {
      return output+='SYNTAX ERROR: Program Not Yet Started\n'
    }
    else if (progend === true) {
      return output+='SYNTAX ERROR: Program Already Ended\n'
    }
    else if (regex.KTHXBYE.test(line[0][0]) && progstart === true) {
      progend = true
    }
    else if (regex.ARITHMETICEXPR.test(line[0][0])||regex.BOOLEANEXPR.test(line[0][0])||regex.INFINITYTWO.test(line[0][0])){
      temp = line.slice()
      temp = operationTranslate(temp,symbolTable)
      if (typeof(temp)==='string') {
        return output+=temp+'\n'
      }
      result = solveOperations(symbolTable,temp)
      if (typeof(result[0]) === 'number'||regex.TROOF.test(result[0])){
        symbolTable['IT'] = result
      }
      else {
        console.log(result);
        return output+=result+'\n'
      }
    }
    else if (regex.SMOOSH.test(line[0][0])) {
      temp=line.slice()
      temp = operationTranslate(temp,symbolTable)
      if (typeof(temp)==='string') {
        return output+=temp+'\n'
      }
      result = solveOperations(symbolTable, temp)
      if (result[0].startsWith('ERROR')!==true){
        symbolTable['IT'] = result
      }
      else {
        console.log(result);
        return output+=result+'\n'
      }
    }
    else if (regex.IHASA.test(line[0][0])) {
      if (line[1] === undefined) {
        return output+='SYNTAX ERROR: Expected Parameter after I HAS A\n'
      }
      else{
        if (regex.RESERVED.test(line[1][0])){
          return output+='SYNTAX ERROR: Reserved Word\n'
        }
        if (regex.VARIABLE.test(line[1][0])===false) {
          return output+='SYNTAX ERROR: Invalid VARIABLE Name\n'
        }
        symbolTable[line[1][0]]=[undefined,'NOOB']
        if (line[2] !== undefined){
          if (line[3] === undefined && line[2][0]==='ITZ'){
            return output+='SYNTAX ERROR: Expected Parameter after ITZ\n'
          }
          else if(regex.ITZ.test(line[2][0])){
            console.log(line[3][0]);
            if (regex.ARITHMETICEXPR.test(line[3][0])||regex.BOOLEANEXPR.test(line[3][0])||regex.INFINITYTWO.test(line[3][0])) {
              temp = line.slice(3,line.length)
              console.log(temp);
              temp = operationTranslate(temp,symbolTable)
              if (typeof(temp)==='string') {
                return output+=temp+'\n'
              }
              result = solveOperations(symbolTable,temp)
              if (typeof(result[0]) === 'number'||regex.TROOF.test(result[0])){
                symbolTable[line[1][0]] = result
              }
              else {
                return output+=result+'\n'
              }
            }
            else if (regex.LITERAL.test(line[3][0])&&line[4]===undefined) {
              if (regex.NUMBR.test(line[3][0])) {
                symbolTable[line[1][0]] = [parseInt(line[3][0],10),'NUMBR']
              }
              else if (regex.NUMBAR.test(line[3][0])) {
                symbolTable[line[1][0]] = [parseFloat(line[3][0],10),'NUMBAR']
              }
              else if (regex.TROOF.test(line[3][0])) {
                symbolTable[line[1][0]] = [line[3][0],'TROOF']
              }
              else if (regex.YARN.test(line[3][0])) {
                symbolTable[line[1][0]] = [line[3][0],'YARN']
              }
              else if (regex.VARIABLE.test(line[3][0])) {
                console.log('LITERAL',line[3][0]);
                if (line[3][0] in symbolTable) {
                    value = symbolTable[line[3][0]]
                    symbolTable[line[1][0]] = value
                }
                else {
                  return output+='Variable not found in Symbol Table\n'
                }
              }
            }
            else if (regex.SMOOSH.test(line[3][0])) {
              temp = line.slice(3,line.length)
              console.log(temp);
              temp = operationTranslate(temp,symbolTable)
              if (typeof(temp)==='string') {
                return output+=temp+'\n'
              }
              result = solveOperations(symbolTable,temp)
              if (result[0].startsWith('ERROR')===false){
                symbolTable[line[1][0]] = result
              }
              else {
                return output+=result+'\n'
              }
            }
            else {
              return output+='Invalid Parameter in ITZ detected\n'
            }
          }
          else {
            return output+='Extra Parameter in I HAS A\n'
          }
        }
      }
    }
    else if (regex.GIMMEH.test(line[0][0])) {
      if (line.length!==2){
        return output+='ERROR: Expected end of line'
      }
      if (regex.RESERVED.test(line[1][0])) {
        return output+='ERROR Reserved Word\n'
      }
      if (symbolTable[line[1][0]]===undefined&&line[1][0] in symbolTable === false) {
        return output+='Variable not found in Symbol Table\n'
      }
      do{
        temp = prompt("Give input");
      }while(temp == null);
       symbolTable[line[1][0]] = ['"'+temp+'"','YARN'];
    }
    else if (regex.VISIBLE.test(line[0][0])) {
      temp=line.slice(1,line.length)
      temp = operationTranslate(temp,symbolTable)
      console.log(temp);
      if (typeof(temp)==='string') {
        return output+=temp+'\n'
      }
      temp = visibleEvaluator(temp,symbolTable)
      if (temp.startsWith('ERROR')) {
        return output+=temp+'\n'
      }
      output+=temp
    }
    else if (regex.VARIABLE.test(line[0][0])) {
      if (regex.RESERVED.test(line[0][0])) {
        return output+='ERROR Reserved Word\n'
      }
      if (symbolTable[line[0][0]]===undefined) {
        if (line[0][0] in symbolTable) {
          return output+='Cannot Parse NOOB to INT\n'
        }
        else {
          return output+='Variable not found in Symbol Table\n'
        }
      }
      if (line[1]===undefined) {
        return output+='Missing R Statement\n'
      }
      else if (line[1][0]!=='R') {
        return output+='Invalid Statement Expected R\n'
      }
      else {
        if (regex.ARITHMETICEXPR.test(line[2][0])||regex.BOOLEANEXPR.test(line[2][0])||regex.INFINITYTWO.test(line[2][0])) {
          temp = line.slice(2,line.length)
          console.log(temp);
          temp = operationTranslate(temp,symbolTable)
          if (typeof(temp)==='string') {
            return output+=temp+'\n'
          }
          result = solveOperations(symbolTable,temp)
          if (typeof(result[0]) === 'number'||regex.TROOF.test(result[0])){
            symbolTable[line[0][0]] = result
          }
          else {
            return output+=result+'\n'
          }
        }
        else if (regex.SMOOSH.test(line[2][0])) {
          temp = line.slice(2,line.length)
          console.log(temp);
          temp = operationTranslate(temp,symbolTable)
          if (typeof(temp)==='string') {
            return output+=temp+'\n'
          }
          result = solveOperations(symbolTable,temp)
          if (result[0].startsWith('ERROR')===false){
            symbolTable[line[0][0]] = result
          }
          else {
            return output+=result+'\n'
          }
        }
        else if (regex.LITERAL.test(line[2][0])) {
          if (regex.NUMBR.test(line[2][0])) {
            symbolTable[line[0][0]] = [parseInt(line[2][0],10),'NUMBR']
          }
          else if (regex.NUMBAR.test(line[2][0])) {
            symbolTable[line[0][0]] = [parseFloat(line[2][0],10),'NUMBAR']
          }
          else if (regex.TROOF.test(line[2][0])) {
            symbolTable[line[0][0]] = [line[2][0],'TROOF']
          }
          else if (regex.YARN.test(line[2][0])) {
            symbolTable[line[0][0]] = [line[2][0],'YARN']
          }
          else if (regex.VARIABLE.test(line[2][0])) {
            if (line[2][0] in symbolTable) {
                value = symbolTable[line[2][0]]
                symbolTable[line[0][0]] = value
            }
            else {
              return output+='Variable not found in Symbol Table\n'
            }
          }
        }
        else {
          return output+='Missing Parameter after R\n'
        }
      }
    }
  }
  if (progend === false) {
    return output+='SYNTAX ERROR: Expected KTHXBYE'
  }
  else{
    return output
  }
}

function smooshEvaluator(lines,symbolTable){
  var arithmeticOperators = ['+', '-', '/', '*', '<', '>','%']
  var booleanOperators = ['&&', '||', '^', '!', '!=', '==']
  var infiniteOperators = ['@&', '@|']
  var booleanIntOperators = ['==', '!=']

  var mkay=-1
  var i, temp
  i = lines.length - 1
  while(i>=-1){
    console.log(lines);
    if (i===-1&&mkay!==-1) {
      return 'ERROR: Detected MKAY but no Infinite Expression found'
    }
    else if (mkay===-1&&infiniteOperators.indexOf(lines[i])>-1) {
      return 'ERROR: invalid Infinity operation missing MKAY'
    }
    else if (mkay!==-1&&infiniteOperators.indexOf(lines[i])>-1) {
      temp=lines.slice(i,mkay+1)
      temp=infiniteEvaluator(symbolTable, temp)
      if (regex.TROOF.test(temp)) {
        lines[i]=temp
        lines.splice(i+1,mkay-i)
      }
      else {
        console.log(temp);
        return temp
      }
      mkay=-1
      i = lines.length - 1
      console.log(lines);
      continue
    }
    else if (mkay!==-1) {
      i-=1
      continue
    }
    else if (lines[i]==='MKAY') {
      mkay=i
    }
    else if (arithmeticOperators.indexOf(lines[i])>-1) {
      if (lines[i+1]===undefined||lines[i+3]===undefined||lines[i+2]!=='AN'){
        return 'ERROR: Missing Parameters'
      }
      else{
        lines[i+1]=arithmeticConverter(lines[i+1])
        lines[i+3]=arithmeticConverter(lines[i+3])
        if (typeof(lines[i+1])==='string') {
          return lines[i+1]
        }
        else if (typeof(lines[i+3])==='string') {
          return lines[i+3]
        }
        else{
          lines[i]=getEvaluator(lines[i],lines[i+1],lines[i+3])
          lines.splice(i+1,3)
          console.log(lines);
          console.log("ARITH")
          i = lines.length - 1
        }
      }
    }
    else if (booleanOperators.indexOf(lines[i])>-1) {
      console.log('IN');
      if (lines[0]!=='!'&&(lines[i+1]===undefined||lines[i+3]===undefined||lines[i+2]!=='AN')){
        return 'ERROR: Missing Parameters'
      }
      else if (lines[0]==='!'&&lines[i+1]===undefined) {
        return 'ERROR: Missing Parameters'
      }
      else if (lines[0]!=='!'){
        console.log(lines);

        if (booleanIntOperators.indexOf(lines[0])===-1) {
          console.log("BOOLEAN");

          lines[i+1]=booleanConverter(lines[i+1])
          lines[i+3]=booleanConverter(lines[i+3])
        }else {
          lines[i+1]=booleanIntConverter(lines[i+1])
          lines[i+3]=booleanIntConverter(lines[i+3])
        }
        temp = getEvaluator(lines[i],lines[i+1],lines[i+3])
        console.log(temp);
        if (temp===1) {
          lines[i]='WIN'
        }else {
          lines[i]='FAIL'
        }
        lines.splice(i+1,3)
        console.log(lines);
        i = lines.length - 1
      }
      else {
        lines[i+1]=booleanConverter(lines[i+1])
        console.log(lines[i+1]);

        lines[i] = getEvaluator(lines[i],lines[i+1],null)
        lines.splice(i+1,2)
        i = lines.length - 1
      }
    }

    i-=1
  }
  console.log(lines);
  temp=''
  if (lines.length===1&&regex.SMOOSH.test(lines[i])) {

    return temp
  }
  i = 0
  while(i<lines.length){
    console.log(lines,temp);

    if (lines.length>2) {
      console.log(lines[i]);
      if (regex.SMOOSH.test(lines[i])) {
        if (lines[i+1]===undefined) {
          return 'ERROR undefined value'
        }
        else {
          if (lines[i+2]==='AN'&&lines[i+3]!==undefined) {
            console.log(lines[i+1])
            if (regex.YARN.test(lines[i+1])) {
               lines[i+1]=lines[i+1].replace(/["]+/g, '')
            }
            temp+=lines[i+1]
            lines.splice(i+1,2)
          }
          else {
            return 'ERROR'
          }
          i=0
          continue
        }
      }
    }
    else{
      if (regex.YARN.test(lines[i+1])) {
        lines[i+1]=lines[i+1].replace(/["]+/g, '')
      }
      temp+=lines[i+1]
      lines.splice(i+1,2)
    }
    i+=1
  }
  console.log(temp);
  return '"'+temp+'"'
}

function visibleEvaluator(lines,symbolTable){
  var arithmeticOperators = ['+', '-', '/', '*', '<', '>','%']
  var booleanOperators = ['&&', '||', '^', '!', '!=', '==']
  var infiniteOperators = ['@&', '@|']
  var booleanIntOperators = ['==', '!=']

  var mkay=-1
  var i, temp
  i = lines.length - 1
  while(i>=-1){
    if (i===-1&&mkay!==-1) {
      return 'ERROR: Detected MKAY but no Infinite Expression found'
    }
    else if (mkay===-1&&infiniteOperators.indexOf(lines[i])>-1) {
      return 'Invalid Infinity operation missing MKAY'
    }
    else if (mkay!==-1&&infiniteOperators.indexOf(lines[i])>-1) {
      temp=lines.slice(i,mkay+1)
      temp=infiniteEvaluator(symbolTable, temp)
      if (regex.TROOF.test(temp)) {
        lines[i]=temp
        lines.splice(i+1,mkay-i)
      }
      else {
        console.log(temp);
        return temp
      }
      mkay=-1
      i = lines.length - 1
      console.log(lines);
      continue
    }
    else if (mkay!==-1) {
      i-=1
      continue
    }
    else if (lines[i]==='MKAY') {
      mkay=i
    }
    else if (arithmeticOperators.indexOf(lines[i])>-1) {
      if (lines[i+1]===undefined||lines[i+3]===undefined||lines[i+2]!=='AN'){
        return 'SYNTAX ERROR: Missing Parameters'
      }
      else{
        lines[i+1]=arithmeticConverter(lines[i+1])
        lines[i+3]=arithmeticConverter(lines[i+3])
        if (typeof(lines[i+1])==='string') {
          return lines[i+1]
        }
        else if (typeof(lines[i+3])==='string') {
          return lines[i+3]
        }
        else{
          lines[i]=getEvaluator(lines[i],lines[i+1],lines[i+3])
          lines.splice(i+1,3)
          console.log(lines);
          i = lines.length - 1
        }
      }
    }
    else if (booleanOperators.indexOf(lines[i])>-1) {
      console.log('IN');
      if (lines[0]!=='!'&&(lines[i+1]===undefined||lines[i+3]===undefined||lines[i+2]!=='AN')){
        return 'SYNTAX ERROR: Missing Parameters'
      }
      else if (lines[0]==='!'&&lines[i+1]===undefined) {
        return 'SYNTAX ERROR: Missing Parameters'
      }
      else if (lines[0]!=='!'){
        console.log(lines);
        if (booleanIntOperators.indexOf(lines[0])===-1) {
          lines[i+1]=booleanConverter(lines[i+1])
          lines[i+3]=booleanConverter(lines[i+3])
        }else {
          lines[i+1]=booleanIntConverter(lines[i+1])
          lines[i+3]=booleanIntConverter(lines[i+3])
        }
        temp = getEvaluator(lines[i],lines[i+1],lines[i+3])
        if (temp===1) {
          lines[i]='WIN'
        }else {
          lines[i]='FAIL'
        }
        lines.splice(i+1,3)
        console.log(lines);
        i = lines.length - 1
      }
      else {
        lines[i+1]=booleanConverter(lines[i+1])
        console.log(lines[i+1]);
        lines[i] = getEvaluator(lines[i],lines[i+1],null)
        lines.splice(i+1,2)
        i = lines.length - 1
      }
    }
    else if (regex.SMOOSH.test(lines[i])) {
      temp=lines.slice(i,lines.length)
      lines[i]=smooshEvaluator(temp,symbolTable)
      console.log(lines);
      if (lines[i].startsWith('ERROR')===true){
        return lines[i]
      }
      lines.splice(i+1,lines.length)
      console.log(lines);
      i = lines.length - 1
    }

    i-=1
  }

  temp=''
  for (i = 0; i < lines.length; i++) {
    if (regex.RESERVED.test(lines[i])) {
      return 'ERROR: Reserved Character'
    }
    else if (lines[i]===undefined) {
      return 'ERROR: Cannot implicitly cast NOOB to YARN'
    }
    else if (regex.YARN.test(lines[i])) {
      lines[i]=lines[i].replace(/["]+/g, '')
    }
    temp+=lines[i]
    console.log(lines[i])
  }
  return temp+='\n'

}

function operationTranslate(line,symbolTable){
  var oStack=[]
  var i
  for (i in line) {
    if (regex.ARITHMETICEXPR.test(line[i][0])||regex.BOOLEANEXPR.test(line[i][0])||regex.INFINITYTWO.test(line[i][0])) {
      oStack.push(getOperator(line[i][0]))
    }
    else if (regex.RESERVED.test(line[i][0])) {
      oStack.push(line[i][0])
    }
    else if (regex.TROOF.test(line[i][0])) {
      oStack.push(line[i][0])
    }
    else if (regex.VARIABLE.test(line[i][0])) {
      console.log(line[i][0]);
      if (symbolTable[line[i][0]]===undefined) {
        if (line[i][0] in symbolTable) {
          return 'Cannot Parse NOOB to INT'
        }
        else {
          return 'Variable not found in Symbol Table'
        }
      }
      oStack.push(symbolTable[line[i][0]][0])
    }
    else if (line[i][1]==='Unknown Token') {
      return 'ERROR Unknown Token'
    }
    else {
      oStack.push(line[i][0])
    }
  }
  console.log(oStack);
  return oStack
}

function solveOperations(symbolTable, oStack){
  var i,temp
  var operators = ['+', '-', '/', '*', '<', '>', '%', '&&', '||', '^', '!', '!=', '==', '!', '@&', '@|', 'SMOOSH']
  var arithmeticOperators = ['+', '-', '/', '*', '<', '>','%']
  var booleanIntOperators = ['==', '!=']
  var booleanOperators = ['&&', '||', '^', '!', '!=', '==']
  var infiniteOperators = ['@&', '@|']
  var mkay=-1
  console.log(oStack);

  i = oStack.length - 1
  while(i>=-1){
    console.log(oStack[i]);
    if (i===-1&&mkay!==-1) {
      return 'ERROR: Detected MKAY but no Infinite Expression found'
    }
    else if (mkay!==-1&&infiniteOperators.indexOf(oStack[i])>-1) {
      temp=oStack.slice(i,mkay+1)
      temp=infiniteEvaluator(symbolTable, temp)
      if (regex.TROOF.test(temp)) {
        oStack[i]=temp
        oStack.splice(i+1,mkay-i)
      }
      else {
        return temp
      }
      mkay=-1
      i = oStack.length - 1
      continue
    }
    else if (mkay===-1&&infiniteOperators.indexOf(oStack[i])>-1) {
      return 'Invalid Infinity operation missing MKAY'
    }
    else if (mkay!==-1) {
      i-=1
      continue
    }
    else if (operators.indexOf(oStack[0]) === -1 && oStack.length!==1) {
      return 'SYNTAX ERROR: Invalid Operation'
    }
    else if (oStack.length === 1) {
      console.log(oStack);

      if (Number.isInteger(oStack[0])) {
        oStack[1]='NUMBR'
      }
      else if (Number.isInteger(parseInt(oStack[0],10))) { //check if its a number
        oStack[1]='NUMBAR'
      }
      else if (regex.TROOF.test(oStack[0])) {
        oStack[1]='TROOF'
      }
      else if (regex.YARN.test(oStack[0])) {
        oStack[1]='YARN'
      }
      console.log(oStack);
      return oStack
    }
    else if (arithmeticOperators.indexOf(oStack[i])>-1) {
      if (oStack[i+1]===undefined||oStack[i+3]===undefined||oStack[i+2]!=='AN'){
        return 'SYNTAX ERROR: Missing Parameters'
      }
      else{
        oStack[i+1]=arithmeticConverter(oStack[i+1])
        oStack[i+3]=arithmeticConverter(oStack[i+3])
        if (typeof(oStack[i+1])==='string') {
          return oStack[i+1]
        }
        else if (typeof(oStack[i+3])==='string') {
          return oStack[i+3]
        }
        else{
          oStack[i]=getEvaluator(oStack[i],oStack[i+1],oStack[i+3])
          oStack.splice(i+1,3)
          console.log(oStack);
          i = oStack.length - 1
        }
      }
    }
    else if (booleanOperators.indexOf(oStack[i])>-1) {
      console.log('IN');
      if (oStack[0]!=='!'&&(oStack[i+1]===undefined||oStack[i+3]===undefined||oStack[i+2]!=='AN')){
        return 'SYNTAX ERROR: Missing Parameters'
      }
      else if (oStack[0]==='!'&&oStack[i+1]===undefined) {
        return 'SYNTAX ERROR: Missing Parameters'
      }
      else if (oStack[0]!=='!'){
        console.log(oStack);
        if (booleanIntOperators.indexOf(oStack[0])===-1) {
          oStack[i+1]=booleanConverter(oStack[i+1])
          oStack[i+3]=booleanConverter(oStack[i+3])
        }else {
          oStack[i+1]=booleanIntConverter(oStack[i+1])
          oStack[i+3]=booleanIntConverter(oStack[i+3])
        }
        temp = getEvaluator(oStack[i],oStack[i+1],oStack[i+3])
        if (temp===1) {
          oStack[i]='WIN'
        }else {
          oStack[i]='FAIL'
        }
        oStack.splice(i+1,3)
        console.log(oStack);
        i = oStack.length - 1
      }
      else {
        oStack[i+1]=booleanConverter(oStack[i+1])
        console.log(oStack[i+1]);
        oStack[i] = getEvaluator(oStack[i],oStack[i+1],null)
        oStack.splice(i+1,2)
        i = oStack.length - 1
      }
    }
    else if (regex.SMOOSH.test(oStack[i])) {
      temp=oStack.slice(i,oStack.length)
      oStack[i]=smooshEvaluator(temp,symbolTable)
      console.log(oStack);
      if (oStack[i].startsWith('ERROR')===true){
        return oStack[i]
      }
      oStack.splice(i+1,oStack.length)
      console.log(oStack);
      i = oStack.length - 1
    }
    else if (oStack[i]==='MKAY') {
      mkay=i
    }
    else {
      // test
    }
    i-=1
  }
}

function booleanIntConverter(input){
  if (regex.NUMBR.test(input)) {
    return parseInt(input,10)
  }
  else if (regex.NUMBAR.test(input)) {
    return parseFloat(input)
  }
  else {
    return input
  }
}

function infiniteEvaluator(symbolTable, lines){
  var arithmeticOperators = ['+', '-', '/', '*', '<', '>','%']
  var booleanOperators = ['&&', '||', '^', '!', '!=', '==']
  var i, temp
  i = lines.length - 1
  // CONVERT EVERYTHING TO BASE FOR

  if (lines.slice(-2)[0] === 'AN'&&lines.length===0){
    return 'ERROR: Invalid Infinite expression'
  }
  else if (lines.length===2&&lines[1]==='MKAY') {
    return 'WIN'
  }
  while(i>=-1){
    if (lines[i]==='MKAY'&&i!==lines.length - 1) {
      return 'ERROR: Nested loops'
    }
    else if (arithmeticOperators.indexOf(lines[i])>-1){
      temp=lines.slice(i,i+4)
      if(temp.slice(2)[0]!=='AN'){
        return 'ERROR: Invalid Arithmetic Expression'
      }
      temp=solveOperations(symbolTable,temp)
      if (typeof(temp[0]) === 'number'){
        lines[i]=temp[0]
        lines.splice(i+1,3)
        i = lines.length - 1
      }
      else {
        return temp
      }
    }
    else if (booleanOperators.indexOf(lines[i])>-1) {
      if (lines[i]==='!') {
        temp=lines.slice(i,i+2)
      }else {
        temp=lines.slice(i,i+4)
        if(temp.slice(2)[0]!=='AN'){
          return 'ERROR: Invalid Boolean Expression'
        }
      }
      temp=solveOperations(symbolTable,temp)
      if (regex.TROOF.test(temp[0])){
        if(lines[i]==='!'){
          lines[i]=temp[0]
          lines.splice(i+1,3)
        }else {
          lines[i]=temp[0]
          lines.splice(i+1,1)
        }
        i = lines.length - 1
      }
      else {
        console.log(temp);
        return temp
      }
    }
    i-=1
  }
  lines.splice(-1) //remove mkay
  if (lines[0]==='@&') {
    lines[0]='&&'
  }else {
    lines[0]='||'
  }
  i=0
  while(i<lines.length){
    if (lines.length!==2) {
      if (lines[i+2]!=='AN') {
        return 'ERROR: Invalid Infinite Expression'
      }
      lines[i+1]=booleanConverter(lines[i+1])
      lines[i+3]=booleanConverter(lines[i+3])
      lines[1]=getEvaluator(lines[0],lines[i+1],lines[i+3])
      lines.splice(i+2,2)
      i=0
      continue
    }
    if (lines.length===2) {
        console.log(lines[1]);
        lines[1]=booleanConverter(lines[1])
        return lines[1]
    }
    i+=1
  }
}

function arithmeticConverter(input){
  var temp
  if (regex.TROOF.test(input)) {
    if (input==='WIN') {
      return 1
    }
    else if (input==='FAIL') {
      return 0
    }
  }
  else if (regex.YARN.test(input)) {
    temp=deepcopy(input).slice().replace(/["]+/g, '')
    if (regex.NUMBR.test(temp)) {
      return parseInt(temp,10)
    }
    else if (regex.NUMBAR.test(temp)) {
      return parseFloat(temp)
    }
    else{
      return 'ERROR: Cannot parse YARN to INT'
    }
  }
  else if (regex.NUMBR.test(input)) {
    return parseInt(input,10)
  }
  else if (regex.NUMBAR.test(input)) {
    return parseFloat(input)
  }
  else {
    console.log(input);
    return 'Cannot Parse'
  }
}

function getOperator(arithmeticexpr){
  switch (arithmeticexpr) {
    case 'SUM OF':
      return '+'
    case 'DIFF OF':
      return '-'
    case 'PRODUKT OF':
      return '*'
    case 'QUOSHUNT OF':
      return '/'
    case 'MOD OF':
      return '%'
    case 'BIGGR OF':
      return '>'
    case 'SMALLR OF':
      return '<'
    case 'BOTH OF':
      return '&&'
    case 'EITHER OF':
      return '||'
    case 'WON OF':
      return '^'
    case 'NOT':
      return '!'
    case 'DIFFRINT':
      return '!='
    case 'BOTH SAEM':
      return '=='
    case 'ALL OF':
      return '@&'
    case 'ANY OF':
      return '@|'
    default:
      return 'errorOperator'
  }
}

function getEvaluator(sign,num1,num2){
  switch (sign) {
    case '+':
      return num1+num2
    case '-':
      return num1-num2
    case '*':
      return num1*num2
    case '/':
      return num1/num2
    case '%':
      return num1%num2
    case '<':
      if (num1<num2) {
        return num1
      }
      else{
        return num2
      }
    case '>':
      if (num1>num2) {
        return num1
      }
      else{
        return num2
      }
    case '&&':
      if(num1 === 'WIN' && num2 === 'WIN') {
          return 1
      }
      else{
          return 0
        }
    case '||':
      if (num1 === 'WIN' || num2 === 'WIN') {
        return 1
      }
      else{
        return 0
      }
    case '^':
      if(num1 !== num2){
        return 1
      }
      else{
        return 0
      }
    case '!=':
      if(num1 !== num2){
        return 1
      }
      else{
        return 0
      }
    case '==':
      if(num1 === num2){
        return 1
      }
      else{
        return 0
      }
    case '!':
      if(num1==='WIN'){
        return 'FAIL'
      }else{
        return 'WIN'
      }
    default:
      return 'errorEval'
  }
}

function booleanConverter(input){
  console.log(input);
  if(Number.isInteger(parseFloat(input))){
    input=parseFloat(input)
  }
  if(regex.YARN.test(input)|| (input !== 0 && input!== 'FAIL' && input!==undefined)||input==='WIN'){
      return 'WIN'
  }
  else{
      console.log('test');
      return 'FAIL'
  }

}

function removeComment(lines){
  for (var line = 0; line < lines.length; line+=1){
    for (var token = 0; token < lines[line].length; token+=1){
      if(lines[line][token][1] === 'Comment' || lines[line][token][1] === 'Comment Delimiter'){
        if (regex.BTW.test(lines[line][token][0]) || regex.OBTW.test(lines[line][token][0])){
          lines[line].splice(token+1,token+2)
        }
        lines[line].splice(token,token+1)
        token = 0
      }
    }
  }
}
