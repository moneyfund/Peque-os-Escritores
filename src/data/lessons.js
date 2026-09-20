export const categories = [
  { id: 'vowels', icon: '🔤', title: { es: 'Vocales y letras', en: 'Vowels & letters' }, subtitle: { es: 'Traza, escucha y reconoce', en: 'Trace, listen and recognize' }, color: 'violet' },
  { id: 'numbers', icon: '🔢', title: { es: 'Números', en: 'Numbers' }, subtitle: { es: 'Cuenta, ordena y compara', en: 'Count, order and compare' }, color: 'blue' },
  { id: 'colors', icon: '🎨', title: { es: 'Colores', en: 'Colors' }, subtitle: { es: 'Mira, escucha y elige', en: 'Look, listen and choose' }, color: 'pink' },
  { id: 'shapes', icon: '🔺', title: { es: 'Formas y patrones', en: 'Shapes & patterns' }, subtitle: { es: 'Encuentra formas y secuencias', en: 'Find shapes and sequences' }, color: 'orange' },
  { id: 'words', icon: '🦁', title: { es: 'Palabras y sonidos', en: 'Words & sounds' }, subtitle: { es: 'Escucha y descubre vocabulario', en: 'Listen and discover words' }, color: 'green' },
]


const vowelTraceTargets = [
  {
    label: 'A',
    name: { es: 'la vocal A', en: 'letter A' },
    paths: ['M72 180 L160 40 L248 180', 'M110 122 L210 122'],
    tolerance: 18,
  },
  {
    label: 'E',
    name: { es: 'la vocal E', en: 'letter E' },
    paths: ['M225 45 L95 45 L95 178 L225 178', 'M95 110 L200 110'],
    tolerance: 18,
  },
  {
    label: 'I',
    name: { es: 'la vocal I', en: 'letter I' },
    paths: ['M160 42 L160 180'],
    tolerance: 17,
  },
  {
    label: 'O',
    name: { es: 'la vocal O', en: 'letter O' },
    paths: ['M160 43 C95 43 80 177 160 177 C240 177 225 43 160 43'],
    tolerance: 18,
  },
  {
    label: 'U',
    name: { es: 'la vocal U', en: 'letter U' },
    paths: ['M88 43 L88 132 C88 192 232 192 232 132 L232 43'],
    tolerance: 18,
  },
]

const numberTraceTargets = [
  {
    label: '1',
    name: { es: 'el número 1', en: 'number 1' },
    paths: ['M128 73 L164 43 L164 180'],
    tolerance: 17,
  },
  {
    label: '2',
    name: { es: 'el número 2', en: 'number 2' },
    paths: ['M96 76 C108 34 218 31 225 83 C230 121 177 142 96 178 L232 178'],
    tolerance: 18,
  },
  {
    label: '3',
    name: { es: 'el número 3', en: 'number 3' },
    paths: ['M103 55 C146 31 224 45 220 92 C217 119 190 125 160 125 C195 125 226 137 220 171 C214 208 137 207 100 181'],
    tolerance: 19,
  },
  {
    label: '4',
    name: { es: 'el número 4', en: 'number 4' },
    paths: ['M205 180 L205 43 L88 148 L238 148'],
    tolerance: 18,
  },
  {
    label: '5',
    name: { es: 'el número 5', en: 'number 5' },
    paths: ['M226 45 L112 45 L104 111 C139 98 220 104 224 153 C229 207 137 211 96 178'],
    tolerance: 19,
  },
]

const basicLineTraceTargets = [
  {
    label: 'horizontal',
    name: { es: 'una línea horizontal', en: 'a horizontal line' },
    paths: ['M48 110 L272 110'],
    tolerance: 15,
  },
  {
    label: 'vertical',
    name: { es: 'una línea vertical', en: 'a vertical line' },
    paths: ['M160 35 L160 185'],
    tolerance: 15,
  },
  {
    label: 'diagonal',
    name: { es: 'una línea diagonal', en: 'a diagonal line' },
    paths: ['M65 175 L255 45'],
    tolerance: 15,
  },
  {
    label: 'curve',
    name: { es: 'una curva', en: 'a curve' },
    paths: ['M45 155 C95 45 225 45 275 155'],
    tolerance: 16,
  },
  {
    label: 'wave',
    name: { es: 'una línea ondulada', en: 'a wavy line' },
    paths: ['M35 112 C70 55 105 55 140 112 C175 169 210 169 285 105'],
    tolerance: 17,
  },
]

const geometryTraceTargets = [
  {
    label: 'circle',
    name: { es: 'un círculo', en: 'a circle' },
    paths: ['M160 38 C94 38 70 182 160 182 C250 182 226 38 160 38'],
    tolerance: 17,
  },
  {
    label: 'triangle',
    name: { es: 'un triángulo', en: 'a triangle' },
    paths: ['M160 36 L65 178 L255 178 L160 36'],
    tolerance: 17,
  },
  {
    label: 'square',
    name: { es: 'un cuadrado', en: 'a square' },
    paths: ['M82 42 L238 42 L238 178 L82 178 L82 42'],
    tolerance: 17,
  },
  {
    label: 'rectangle',
    name: { es: 'un rectángulo', en: 'a rectangle' },
    paths: ['M48 62 L272 62 L272 158 L48 158 L48 62'],
    tolerance: 17,
  },
  {
    label: 'diamond',
    name: { es: 'un rombo', en: 'a diamond' },
    paths: ['M160 32 L258 110 L160 188 L62 110 L160 32'],
    tolerance: 17,
  },
]

export const lessons = [
  {
    id: 'trace-vowels', category: 'vowels', icon: '✏️', difficulty: 1,
    title: { es: 'Traza las vocales', en: 'Trace the vowels' },
    description: { es: 'Sigue la forma de A, E, I, O y U con tu dedo o mouse.', en: 'Follow A, E, I, O and U with your finger or mouse.' },
    type: 'trace', targets: vowelTraceTargets,
  },
  {
    id: 'listen-vowels', category: 'vowels', icon: '👂', difficulty: 1,
    title: { es: '¿Qué vocal escuchas?', en: 'Which vowel do you hear?' },
    description: { es: 'Escucha una vocal y toca la respuesta correcta.', en: 'Listen to a vowel and tap the correct answer.' },
    type: 'listen', items: [
      { speak: { es: 'A', en: 'A' }, options: ['A','E','I'], answer: 'A' },
      { speak: { es: 'E', en: 'E' }, options: ['O','E','U'], answer: 'E' },
      { speak: { es: 'I', en: 'I' }, options: ['I','A','O'], answer: 'I' },
      { speak: { es: 'O', en: 'O' }, options: ['U','O','E'], answer: 'O' },
      { speak: { es: 'U', en: 'U' }, options: ['A','I','U'], answer: 'U' },
    ],
  },
  {
    id: 'vowel-pictures', category: 'vowels', icon: '🍎', difficulty: 2,
    title: { es: 'Vocal y dibujo', en: 'Vowel and picture' },
    description: { es: 'Elige la vocal con la que empieza cada palabra.', en: 'Choose the vowel each word starts with.' },
    type: 'quiz', items: [
      { prompt: { es: 'Árbol', en: 'Apple' }, emoji: '🌳', options: ['A','E','I'], answer: 'A' },
      { prompt: { es: 'Elefante', en: 'Elephant' }, emoji: '🐘', options: ['A','E','O'], answer: 'E' },
      { prompt: { es: 'Isla', en: 'Igloo' }, emoji: '🏝️', options: ['U','I','E'], answer: 'I' },
      { prompt: { es: 'Oso', en: 'Octopus' }, emoji: '🐻', options: ['O','A','U'], answer: 'O' },
      { prompt: { es: 'Uvas', en: 'Umbrella' }, emoji: '🍇', options: ['E','U','I'], answer: 'U' },
    ],
  },
  {
    id: 'count-objects', category: 'numbers', icon: '🍓', difficulty: 1,
    title: { es: 'Cuenta los objetos', en: 'Count the objects' },
    description: { es: 'Cuenta uno por uno y elige el número correcto.', en: 'Count one by one and choose the right number.' },
    type: 'count', items: [
      { emoji: '⭐', count: 3, options: [2,3,4] },
      { emoji: '🍓', count: 5, options: [4,5,6] },
      { emoji: '🐠', count: 7, options: [6,7,8] },
      { emoji: '🎈', count: 9, options: [8,9,10] },
    ],
  },
  {
    id: 'number-order', category: 'numbers', icon: '🚂', difficulty: 1,
    title: { es: 'Ponlos en orden', en: 'Put them in order' },
    description: { es: 'Toca los números del menor al mayor.', en: 'Tap the numbers from smallest to biggest.' },
    type: 'sequence', target: [1,2,3,4,5,6,7,8],
  },
  {
    id: 'trace-numbers', category: 'numbers', icon: '🖍️', difficulty: 2,
    title: { es: 'Traza los números', en: 'Trace the numbers' },
    description: { es: 'Practica los números del 1 al 5.', en: 'Practice numbers 1 through 5.' },
    type: 'trace', targets: numberTraceTargets,
  },
  {
    id: 'find-color', category: 'colors', icon: '🌈', difficulty: 1,
    title: { es: 'Encuentra el color', en: 'Find the color' },
    description: { es: 'Mira el nombre y elige el color correcto.', en: 'Read the name and choose the right color.' },
    type: 'color', items: [
      { prompt: { es: 'Rojo', en: 'Red' }, answer: '#ef4444', options: ['#ef4444','#3b82f6','#22c55e'] },
      { prompt: { es: 'Azul', en: 'Blue' }, answer: '#3b82f6', options: ['#facc15','#3b82f6','#f97316'] },
      { prompt: { es: 'Amarillo', en: 'Yellow' }, answer: '#facc15', options: ['#a855f7','#facc15','#22c55e'] },
      { prompt: { es: 'Verde', en: 'Green' }, answer: '#22c55e', options: ['#22c55e','#ec4899','#3b82f6'] },
      { prompt: { es: 'Morado', en: 'Purple' }, answer: '#a855f7', options: ['#f97316','#a855f7','#ef4444'] },
    ],
  },
  {
    id: 'listen-colors', category: 'colors', icon: '🔊', difficulty: 2,
    title: { es: 'Escucha el color', en: 'Listen to the color' },
    description: { es: 'Escucha y toca el círculo correcto.', en: 'Listen and tap the correct circle.' },
    type: 'listen-color', items: [
      { speak: { es: 'rojo', en: 'red' }, answer: '#ef4444', options: ['#3b82f6','#ef4444','#22c55e'] },
      { speak: { es: 'azul', en: 'blue' }, answer: '#3b82f6', options: ['#facc15','#a855f7','#3b82f6'] },
      { speak: { es: 'verde', en: 'green' }, answer: '#22c55e', options: ['#22c55e','#f97316','#ec4899'] },
    ],
  },
  {
    id: 'trace-lines-basic', category: 'shapes', icon: '✍️', difficulty: 1,
    title: { es: 'Traza líneas y caminos', en: 'Trace lines and paths' },
    description: { es: 'Practica líneas rectas, diagonales, curvas y ondas siguiendo la manito.', en: 'Practice straight, diagonal, curved and wavy paths by following the hand.' },
    type: 'trace', targets: basicLineTraceTargets,
  },
  {
    id: 'trace-geometric-shapes', category: 'shapes', icon: '📐', difficulty: 2,
    title: { es: 'Traza figuras geométricas', en: 'Trace geometric shapes' },
    description: { es: 'Sigue la guía para dibujar círculo, triángulo, cuadrado, rectángulo y rombo.', en: 'Follow the guide to draw a circle, triangle, square, rectangle and diamond.' },
    type: 'trace', targets: geometryTraceTargets,
  },
  {
    id: 'identify-shapes', category: 'shapes', icon: '🟦', difficulty: 1,
    title: { es: '¿Qué forma es?', en: 'What shape is it?' },
    description: { es: 'Observa la figura y elige su nombre.', en: 'Look at the shape and choose its name.' },
    type: 'shape', items: [
      { shape: 'circle', answer: 'circle', labels: { es: { circle:'Círculo', square:'Cuadrado', triangle:'Triángulo' }, en: { circle:'Circle', square:'Square', triangle:'Triangle' } }, options: ['circle','square','triangle'] },
      { shape: 'square', answer: 'square', labels: { es: { circle:'Círculo', square:'Cuadrado', triangle:'Triángulo' }, en: { circle:'Circle', square:'Square', triangle:'Triangle' } }, options: ['triangle','square','circle'] },
      { shape: 'triangle', answer: 'triangle', labels: { es: { circle:'Círculo', square:'Cuadrado', triangle:'Triángulo' }, en: { circle:'Circle', square:'Square', triangle:'Triangle' } }, options: ['square','circle','triangle'] },
    ],
  },
  {
    id: 'patterns', category: 'shapes', icon: '🧩', difficulty: 2,
    title: { es: 'Completa el patrón', en: 'Complete the pattern' },
    description: { es: 'Descubre qué elemento sigue en la secuencia.', en: 'Discover what comes next in the sequence.' },
    type: 'pattern', items: [
      { pattern: ['🔵','🟡','🔵','🟡'], options: ['🟡','🔵','🟢'], answer: '🔵' },
      { pattern: ['⭐','⭐','🌙','⭐','⭐','🌙'], options: ['🌙','⭐','☀️'], answer: '⭐' },
      { pattern: ['🔺','🟦','🟢','🔺','🟦'], options: ['🟢','🔺','🟦'], answer: '🟢' },
    ],
  },
  {
    id: 'animal-sounds', category: 'words', icon: '🐶', difficulty: 1,
    title: { es: 'Escucha y encuentra', en: 'Listen and find' },
    description: { es: 'Escucha el nombre del animal y toca su dibujo.', en: 'Listen to the animal name and tap its picture.' },
    type: 'listen-emoji', items: [
      { speak: { es: 'perro', en: 'dog' }, answer: '🐶', options: ['🐱','🐶','🐰'] },
      { speak: { es: 'gato', en: 'cat' }, answer: '🐱', options: ['🐸','🐱','🐵'] },
      { speak: { es: 'león', en: 'lion' }, answer: '🦁', options: ['🐯','🦁','🐻'] },
      { speak: { es: 'pez', en: 'fish' }, answer: '🐟', options: ['🐟','🐦','🐢'] },
    ],
  },
  {
    id: 'first-words', category: 'words', icon: '🗣️', difficulty: 2,
    title: { es: 'Palabras del día', en: 'Words of the day' },
    description: { es: 'Mira el dibujo, escucha la palabra y encuentra la opción correcta.', en: 'Look, listen and choose the matching word.' },
    type: 'word', items: [
      { emoji: '☀️', speak: { es:'sol', en:'sun' }, answer: { es:'Sol', en:'Sun' }, options: { es:['Sol','Luna','Casa'], en:['Sun','Moon','House'] } },
      { emoji: '🏠', speak: { es:'casa', en:'house' }, answer: { es:'Casa', en:'House' }, options: { es:['Flor','Casa','Mesa'], en:['Flower','House','Table'] } },
      { emoji: '🌸', speak: { es:'flor', en:'flower' }, answer: { es:'Flor', en:'Flower' }, options: { es:['Flor','Pan','Tren'], en:['Flower','Bread','Train'] } },
    ],
  },
]

export const getLesson = (id) => lessons.find((lesson) => lesson.id === id)
export const localized = (value, lang = 'es') => value?.[lang] ?? value?.es ?? value
