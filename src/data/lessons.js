export const categories = [
  { id: 'vowels', icon: '🔤', title: { es: 'Vocales y letras', en: 'Vowels & letters' }, subtitle: { es: 'Traza, escucha y reconoce', en: 'Trace, listen and recognize' }, color: 'violet' },
  { id: 'numbers', icon: '🔢', title: { es: 'Números', en: 'Numbers' }, subtitle: { es: 'Cuenta, ordena y compara', en: 'Count, order and compare' }, color: 'blue' },
  { id: 'colors', icon: '🎨', title: { es: 'Colores', en: 'Colors' }, subtitle: { es: 'Mira, escucha y elige', en: 'Look, listen and choose' }, color: 'pink' },
  { id: 'shapes', icon: '🔺', title: { es: 'Formas y patrones', en: 'Shapes & patterns' }, subtitle: { es: 'Encuentra formas y secuencias', en: 'Find shapes and sequences' }, color: 'orange' },
  { id: 'words', icon: '🦁', title: { es: 'Palabras y sonidos', en: 'Words & sounds' }, subtitle: { es: 'Escucha y descubre vocabulario', en: 'Listen and discover words' }, color: 'green' },
]

export const lessons = [
  {
    id: 'trace-vowels', category: 'vowels', icon: '✏️', difficulty: 1,
    title: { es: 'Traza las vocales', en: 'Trace the vowels' },
    description: { es: 'Sigue la forma de A, E, I, O y U con tu dedo o mouse.', en: 'Follow A, E, I, O and U with your finger or mouse.' },
    type: 'trace', targets: ['A', 'E', 'I', 'O', 'U'],
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
    type: 'trace', targets: ['1','2','3','4','5'],
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
