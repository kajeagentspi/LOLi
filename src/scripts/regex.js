module.exports = {
  'HAI': /^HAI$/,
  'KTHXBYE': /^KTHXBYE$/,

  'BTW': /^BTW$/,
  'TLDR': /^TLDR$/,
  'OBTW': /^OBTW$/,

  'NOOB': /^NOOB$/,
  'TROOF': /^(WIN|FAIL)$/,
  'NUMBR': /^-?\d+$/,
  'NUMBAR': /^-?\d+\.\d+$/,
  'YARN': /^".*"$/,
  'VARIABLE': /^[A-Za-z][A-Za-z0-9_]*$/,
  'LITERAL': /^(NOOB|WIN|FAIL|-?\d+|-?\d+\.\d+|".*"|[A-Za-z][A-Za-z0-9_]*|")$/,
  'EXPRESSION': /^(SUM OF .+ AN .+|DIFF OF .+ AN .+|PRODUKT OF .+ AN .+|QUOSHUNT OF .+ AN .+|MOD OF .+ AN .+|BIGGR OF .+ AN .+|SMALLR OF .+ AN .+|BOTH OF .+ AN .+|EITHER OF .+ AN .+|WON OF .+ AN .+|NOT .+|ALL OF .+ AN .+ MKAY|EITHER OF .+ AN .+ MKAY|BOTH SAEM .+ AN .+|DIFFRINT .+ AN .+|ALL OF .+|ANY OF .+|SMOOSH .+|VISIBLE .+)$/,

  'IHASA': /^I HAS A$/,
  'ITZ': /^ITZ$/,
  'GIMMEH': /^GIMMEH$/,

  'NOT': /^NOT$/,
  'BINARY': /^(SUM OF|DIFF OF|PRODUKT OF|QUOSHUNT OF|MOD OF|BIGGR OF|SMALLR OF|BOTH OF|EITHER OF|WON OF|BOTH SAEM|DIFFRINT)$/,
    'SUMOF': /^SUM OF$/,
    'DIFFOF': /^DIFF OF$/,
    'PRODUKTOF': /^PRODUKT OF$/,
    'QUOSHUNTOF': /^QUOSHUNT OF$/,
    'MODOF': /^MOD OF$/,
    'BIGGROF': /^BIGGR OF$/,
    'SMALLROF': /^SMALLR OF$/,
    'BOTHOF': /^BOTH OF$/,
    'EITHEROF': /^EITHER OF$/,
    'WONOF': /^WON OF$/,
    'BOTHSAEM': /^BOTH SAEM$/,
    'DIFFRINT': /^DIFFRINT$/,

  'INFINITYTWO': /^(ALL OF|ANY OF)$/,
    'ALLOF': /^ALL OF$/,
    'ANYOF': /^ANY OF$/,
  'INFINITYONE': /^(SMOOSH|VISIBLE)$/,
    'SMOOSH': /^SMOOSH$/,
    'VISIBLE': /^VISIBLE$/,
  'MKAY' : /^MKAY$/,

  'AN' : /^AN$/,

  'EXPRESSIONTOKEN': /^(SUM OF|DIFF OF|PRODUKT OF|QUOSHUNT OF|MOD OF|BIGGR OF|SMALLR OF|BOTH OF|EITHER OF|WON OF|NOT|ALL OF|ANY OF|BOTH SAEM|DIFFRINT|SMOOSH|VISIBLE)$/,

  'R': /^\s*[A-Za-z][A-Za-z0-9_]*\s+R\s+.+\s*$/,

  'ORLY': /^\s*O RLY\?\s*$/,

  'YARLY': /^\s*YA RLY\s*$/,

  'NOWAI': /^\s*NO WAI\s*$/,

  'OIC': /^\s*OIC\s*$/,

  'WTF': /^\s*WTF\?\s*$/,

  'OMG': /^\s*OMG\s*/,

  'GTFO': /^\s*GTFO\s*$/,

  'OMGWTF': /^\s*OMGWTF\s*$/,


  'ARITHMETICEXPR': /^(SUM OF|DIFF OF|PRODUKT OF|QUOSHUNT OF|MOD OF|BIGGR OF|SMALLR OF)$/,

  'BOOLEANEXPR': /^(BOTH OF|EITHER OF|WON OF|NOT|DIFFRINT|BOTH SAEM)$/,

  'RESERVED' : /^(HAI|KTHXBYE|NOT|ITZ|GIMMEH|NOOB|TROOF|NUMBR|NUMBAR|YARN|VISIBLE|R|SMOOSH|BTW|OBTW|TLDR|OIC|BUKKIT|AN|MKAY)*$/
};
