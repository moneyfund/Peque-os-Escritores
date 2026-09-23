export const syllableFamilies = [
  { id:'m', grapheme:'M', tone:'magenta', syllables:['ma','me','mi','mo','mu'], example:{ word:'mamá', syllables:['ma','má'], emoji:'👩' } },
  { id:'p', grapheme:'P', tone:'blue', syllables:['pa','pe','pi','po','pu'], example:{ word:'papá', syllables:['pa','pá'], emoji:'👨' } },
  { id:'l', grapheme:'L', tone:'yellow', syllables:['la','le','li','lo','lu'], example:{ word:'luna', syllables:['lu','na'], emoji:'🌙' } },
  { id:'s', grapheme:'S', tone:'green', syllables:['sa','se','si','so','su'], example:{ word:'sapo', syllables:['sa','po'], emoji:'🐸' } },
  { id:'t', grapheme:'T', tone:'orange', syllables:['ta','te','ti','to','tu'], example:{ word:'taza', syllables:['ta','za'], emoji:'☕' } },
  { id:'n', grapheme:'N', tone:'purple', syllables:['na','ne','ni','no','nu'], example:{ word:'nube', syllables:['nu','be'], emoji:'☁️' } },
  { id:'d', grapheme:'D', tone:'cyan', syllables:['da','de','di','do','du'], example:{ word:'dado', syllables:['da','do'], emoji:'🎲' } },
  { id:'f', grapheme:'F', tone:'pink', syllables:['fa','fe','fi','fo','fu'], example:{ word:'foca', syllables:['fo','ca'], emoji:'🦭' } },
  { id:'b', grapheme:'B', tone:'indigo', syllables:['ba','be','bi','bo','bu'], example:{ word:'bota', syllables:['bo','ta'], emoji:'🥾' } },
  { id:'c', grapheme:'C', tone:'lime', syllables:['ca','ce','ci','co','cu'], example:{ word:'casa', syllables:['ca','sa'], emoji:'🏠' } },
  { id:'g', grapheme:'G', tone:'amber', syllables:['ga','ge','gi','go','gu'], example:{ word:'gato', syllables:['ga','to'], emoji:'🐱' } },
  { id:'r', grapheme:'R', tone:'red', syllables:['ra','re','ri','ro','ru'], example:{ word:'rana', syllables:['ra','na'], emoji:'🐸' } },
  { id:'j', grapheme:'J', tone:'violet', syllables:['ja','je','ji','jo','ju'], example:{ word:'jugo', syllables:['ju','go'], emoji:'🧃' } },
  { id:'v', grapheme:'V', tone:'sky', syllables:['va','ve','vi','vo','vu'], example:{ word:'vaca', syllables:['va','ca'], emoji:'🐄' } },
  { id:'ñ', grapheme:'Ñ', tone:'mint', syllables:['ña','ñe','ñi','ño','ñu'], example:{ word:'niño', syllables:['ni','ño'], emoji:'🧒' } },
  { id:'ch', grapheme:'CH', tone:'peach', syllables:['cha','che','chi','cho','chu'], example:{ word:'chico', syllables:['chi','co'], emoji:'🧒' } },
  { id:'ll', grapheme:'LL', tone:'teal', syllables:['lla','lle','lli','llo','llu'], example:{ word:'llave', syllables:['lla','ve'], emoji:'🔑' } },
  { id:'y', grapheme:'Y', tone:'gold', syllables:['ya','ye','yi','yo','yu'], example:{ word:'yoyo', syllables:['yo','yo'], emoji:'🪀' } },
  { id:'z', grapheme:'Z', tone:'rose', syllables:['za','ze','zi','zo','zu'], example:{ word:'zorro', syllables:['zo','rro'], emoji:'🦊' } },
]

export const specialSyllablePatterns = [
  { title:'QU', subtitle:'Sonido fuerte de C antes de E e I', syllables:['que','qui'], examples:['queso','quinto'] },
  { title:'GU', subtitle:'G suave antes de E e I', syllables:['gue','gui'], examples:['guerra','guitarra'] },
  { title:'GÜ', subtitle:'La U sí se pronuncia', syllables:['güe','güi'], examples:['pingüino','vergüenza'] },
  { title:'RR', subtitle:'Sonido fuerte entre vocales', syllables:['rra','rre','rri','rro','rru'], examples:['perro','carro'] },
]

export const phonicsWords = [
  { word:'mamá', syllables:['ma','má'], emoji:'👩' },
  { word:'papá', syllables:['pa','pá'], emoji:'👨' },
  { word:'mesa', syllables:['me','sa'], emoji:'🪑' },
  { word:'luna', syllables:['lu','na'], emoji:'🌙' },
  { word:'sopa', syllables:['so','pa'], emoji:'🥣' },
  { word:'nube', syllables:['nu','be'], emoji:'☁️' },
  { word:'gato', syllables:['ga','to'], emoji:'🐱' },
  { word:'casa', syllables:['ca','sa'], emoji:'🏠' },
  { word:'foca', syllables:['fo','ca'], emoji:'🦭' },
  { word:'vaca', syllables:['va','ca'], emoji:'🐄' },
  { word:'rana', syllables:['ra','na'], emoji:'🐸' },
  { word:'jugo', syllables:['ju','go'], emoji:'🧃' },
]
