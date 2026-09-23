import { motion } from 'motion/react'

const sceneMap = {
  vowels: {
    eyebrow: { es:'Sonidos que abren palabras', en:'Sounds that open words' },
    title: { es:'A · E · I · O · U', en:'A · E · I · O · U' },
    tokens:['A','E','I','O','U'],
  },
  alphabet: {
    eyebrow: { es:'Explora las 27 letras', en:'Explore the alphabet' },
    title: { es:'A B C ··· X Y Z', en:'A B C ··· X Y Z' },
    tokens:['A','B','C','Ñ','Z'],
  },
  numbers: {
    eyebrow: { es:'Cuenta, ordena y descubre', en:'Count, order and discover' },
    title: { es:'1 · 2 · 3 · 4 · 5', en:'1 · 2 · 3 · 4 · 5' },
    tokens:['1','2','3','4','5'],
  },
  colors: {
    eyebrow: { es:'Un mundo lleno de color', en:'A world full of color' },
    title: { es:'Mira · escucha · combina', en:'Look · listen · combine' },
    tokens:['#ff315c','#ffb800','#23c875','#258cff','#8c52ff'],
    circles:true,
  },
  shapes: {
    eyebrow: { es:'Construye con figuras', en:'Build with shapes' },
    title: { es:'Formas y patrones', en:'Shapes and patterns' },
    tokens:['●','▲','■','◆','★'],
  },
  words: {
    eyebrow: { es:'Escucha y descubre vocabulario', en:'Listen and discover vocabulary' },
    title: { es:'SOL · CASA · LUNA', en:'SUN · HOUSE · MOON' },
    tokens:['SOL','CASA','LUNA','FLOR','PAN'],
  },
}

const localized = (value, language) => value?.[language] ?? value?.es ?? value

export default function CategoryHero({ category, language='es' }) {
  const scene = sceneMap[category?.id] || sceneMap.vowels
  const color = category?.color || 'violet'

  return (
    <section className={`v12-category-hero v12-hero-${category?.id || 'vowels'} tone-${color}`}>
      <div className="v12-category-hero-copy">
        <span>{localized(scene.eyebrow, language)}</span>
        <strong>{localized(scene.title, language)}</strong>
        <small>{language === 'es' ? 'Toca, escucha, mueve y aprende a tu ritmo.' : 'Tap, listen, move and learn at your own pace.'}</small>
      </div>

      <div className="v12-category-hero-stage" aria-hidden="true">
        <motion.div className="v12-hero-orbit orbit-a" animate={{ rotate:360 }} transition={{ duration:28, repeat:Infinity, ease:'linear' }}/>
        <motion.div className="v12-hero-orbit orbit-b" animate={{ rotate:-360 }} transition={{ duration:36, repeat:Infinity, ease:'linear' }}/>
        <div className="v12-hero-core">
          <span>{category?.id === 'alphabet' ? 'ABC' : category?.id === 'numbers' ? '123' : category?.id === 'colors' ? '🎨' : category?.id === 'shapes' ? '△○□' : category?.id === 'words' ? 'Aa' : 'AEIOU'}</span>
        </div>
        {scene.tokens.map((token,index) => (
          <motion.span
            key={`${token}-${index}`}
            className={`v12-hero-token token-${index+1} ${scene.circles ? 'color-token' : ''}`}
            style={scene.circles ? { background:token } : undefined}
            drag
            dragElastic={0.18}
            dragConstraints={{ left:-60, right:60, top:-50, bottom:50 }}
            animate={{ y:[0,index%2 ? 10 : -12,0], rotate:[-4,index%2 ? -7 : 7,-4] }}
            transition={{ duration:3.4 + index*.35, repeat:Infinity, ease:'easeInOut' }}
          >
            {scene.circles ? '' : token}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
