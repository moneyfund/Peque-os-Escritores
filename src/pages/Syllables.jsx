import { useMemo, useState } from 'react'
import { Check, Ear, Eraser, PenLine, Play, Sparkles, Volume2, WandSparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import { phonicsWords, specialSyllablePatterns, syllableFamilies } from '../data/syllables.js'

const vowels=['a','e','i','o','u']

const normalize=(value='') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()

const speak=(text) => {
  if (!text || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance=new SpeechSynthesisUtterance(text)
  utterance.lang='es-NI'
  utterance.rate=.72
  utterance.pitch=1.04
  window.speechSynthesis.speak(utterance)
}

export default function Syllables() {
  const { language }=useAuth()
  const [activeFamily,setActiveFamily]=useState('m')
  const [builderConsonant,setBuilderConsonant]=useState('m')
  const [builderVowel,setBuilderVowel]=useState('a')
  const [wordParts,setWordParts]=useState([])
  const [dictationIndex,setDictationIndex]=useState(0)
  const [dictationInput,setDictationInput]=useState('')
  const [dictationResult,setDictationResult]=useState(null)

  const family=syllableFamilies.find((item)=>item.id===activeFamily) || syllableFamilies[0]
  const built=`${builderConsonant}${builderVowel}`
  const builtWord=wordParts.join('')
  const dictation=phonicsWords[dictationIndex % phonicsWords.length]

  const consonants=useMemo(()=>syllableFamilies.map((item)=>({ id:item.id, label:item.grapheme })),[])

  const addBuilt=() => {
    setWordParts((parts)=>[...parts,built])
    speak(built)
  }

  const clearBuilt=() => setWordParts([])

  const checkDictation=() => {
    setDictationResult(normalize(dictationInput)===normalize(dictation.word))
  }

  const nextDictation=() => {
    setDictationIndex((value)=>(value+1)%phonicsWords.length)
    setDictationInput('')
    setDictationResult(null)
  }

  return (
    <section className="syllables-page">
      <div className="syllables-bg-orb orb-one"/><div className="syllables-bg-orb orb-two"/><div className="syllables-bg-grid"/>

      <div className="container">
        <section className="syllables-hero">
          <div className="syllables-hero-copy">
            <span><Sparkles size={16}/> {language==='es' ? 'Laboratorio de escritura fonética' : 'Spanish phonics lab'}</span>
            <h1>{language==='es' ? 'Descubre cómo se construyen las ' : 'Discover how '}<strong>{language==='es' ? 'sílabas' : 'syllables work'}</strong></h1>
            <p>{language==='es'
              ? 'Escucha cada sonido, combina consonantes con vocales y arma palabras paso a paso. Todo está disponible desde el inicio.'
              : 'Listen to each sound, combine consonants and vowels, and build Spanish words step by step. Everything is unlocked.'}</p>
            <div className="syllables-hero-chips">
              <span><Ear size={15}/> Escuchar</span><span><WandSparkles size={15}/> Combinar</span><span><PenLine size={15}/> Escribir</span>
            </div>
          </div>
          <div className="syllables-hero-stage" aria-hidden="true">
            {['MA','ME','MI','MO','MU'].map((item,index)=>(
              <motion.span key={item} className={`syllable-float float-${index+1}`} drag dragConstraints={{left:-45,right:45,top:-40,bottom:40}}
                animate={{y:[0,index%2 ? 12 : -11,0],rotate:[-5,index%2 ? -8 : 8,-5]}}
                transition={{duration:3.2+index*.35,repeat:Infinity,ease:'easeInOut'}}>{item}</motion.span>
            ))}
            <div className="syllables-core"><strong>MA</strong><span>m + a</span></div>
          </div>
        </section>

        <section className="syllables-section">
          <div className="syllables-section-head">
            <div><span>01 · EXPLORAR</span><h2>{language==='es' ? 'Familias silábicas' : 'Syllable families'}</h2></div>
            <p>{language==='es' ? 'Todas están desbloqueadas. Toca cualquier sílaba para escucharla.' : 'Everything is unlocked. Tap any syllable to hear it.'}</p>
          </div>

          <div className="syllable-family-selector">
            {syllableFamilies.map((item)=>(
              <button key={item.id} className={activeFamily===item.id ? 'active' : ''} onClick={()=>setActiveFamily(item.id)}>{item.grapheme}</button>
            ))}
          </div>

          <div className={`syllable-family-focus tone-${family.tone}`}>
            <div className="syllable-family-letter">{family.grapheme}</div>
            <div className="syllable-family-main">
              <small>{language==='es' ? 'Consonante + vocal' : 'Consonant + vowel'}</small>
              <h3>{family.grapheme} + A E I O U</h3>
              <div className="syllable-row">
                {family.syllables.map((syllable)=>(
                  <motion.button key={syllable} whileTap={{scale:.9}} onClick={()=>speak(syllable)}>
                    <Volume2 size={16}/><strong>{syllable}</strong>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="syllable-example">
              <span>{family.example.emoji}</span>
              <small>{language==='es' ? 'Ejemplo' : 'Example'}</small>
              <strong>{family.example.word}</strong>
              <div>{family.example.syllables.map((part)=><b key={part} onClick={()=>speak(part)}>{part}</b>)}</div>
            </div>
          </div>

          <div className="syllable-family-grid">
            {syllableFamilies.map((item)=>(
              <article key={item.id} className={`syllable-family-card tone-${item.tone}`}>
                <div><strong>{item.grapheme}</strong><small>{item.example.word}</small></div>
                <div>{item.syllables.map((part)=><button key={part} onClick={()=>speak(part)}>{part}</button>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="syllables-builder">
          <div className="syllables-section-head">
            <div><span>02 · CONSTRUIR</span><h2>{language==='es' ? 'Armador de sílabas' : 'Syllable builder'}</h2></div>
            <p>{language==='es' ? 'El niño ve cómo dos sonidos se unen para crear una sílaba.' : 'See how two sounds join to create one syllable.'}</p>
          </div>

          <div className="builder-board">
            <div className="builder-picker">
              <small>1 · {language==='es' ? 'Elige consonante' : 'Choose consonant'}</small>
              <div className="builder-consonants">
                {consonants.map((item)=><button className={builderConsonant===item.id ? 'active' : ''} key={item.id} onClick={()=>setBuilderConsonant(item.id)}>{item.label}</button>)}
              </div>
            </div>
            <div className="builder-plus">+</div>
            <div className="builder-picker">
              <small>2 · {language==='es' ? 'Elige vocal' : 'Choose vowel'}</small>
              <div className="builder-vowels">
                {vowels.map((item)=><button className={builderVowel===item ? 'active' : ''} key={item} onClick={()=>setBuilderVowel(item)}>{item.toUpperCase()}</button>)}
              </div>
            </div>
            <div className="builder-equals">=</div>
            <motion.button key={built} className="builder-result" initial={{scale:.85,rotate:-4}} animate={{scale:1,rotate:0}} onClick={()=>speak(built)}>
              <Volume2/><strong>{built}</strong>
            </motion.button>
          </div>

          <div className="word-builder">
            <div>
              <small>{language==='es' ? 'Tren de sílabas' : 'Syllable train'}</small>
              <strong>{builtWord || (language==='es' ? 'Agrega sílabas para formar una palabra' : 'Add syllables to build a word')}</strong>
            </div>
            <div className="word-builder-track">
              {wordParts.length ? wordParts.map((part,index)=><span key={`${part}-${index}`} onClick={()=>speak(part)}>{part}</span>) : <i>· · ·</i>}
            </div>
            <div className="word-builder-actions">
              <button onClick={addBuilt}><Play size={16}/>{language==='es' ? 'Agregar' : 'Add'}</button>
              <button disabled={!builtWord} onClick={()=>speak(builtWord)}><Volume2 size={16}/>{language==='es' ? 'Escuchar' : 'Listen'}</button>
              <button disabled={!wordParts.length} onClick={clearBuilt}><Eraser size={16}/>{language==='es' ? 'Limpiar' : 'Clear'}</button>
            </div>
          </div>
        </section>

        <section className="syllables-section">
          <div className="syllables-section-head">
            <div><span>03 · PATRONES</span><h2>{language==='es' ? 'Sonidos especiales' : 'Special patterns'}</h2></div>
            <p>{language==='es' ? 'Una introducción visual a combinaciones frecuentes del español.' : 'A visual introduction to common Spanish spelling patterns.'}</p>
          </div>
          <div className="special-pattern-grid">
            {specialSyllablePatterns.map((pattern)=>(
              <article key={pattern.title}>
                <strong>{pattern.title}</strong><p>{pattern.subtitle}</p>
                <div>{pattern.syllables.map((part)=><button key={part} onClick={()=>speak(part)}>{part}</button>)}</div>
                <small>{pattern.examples.join(' · ')}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="phonics-dictation">
          <div className="dictation-copy">
            <span>04 · ESCRITURA FONÉTICA</span>
            <h2>{language==='es' ? 'Escucha y escribe' : 'Listen and write'}</h2>
            <p>{language==='es' ? 'Escucha la palabra, identifica sus sonidos y escríbela. Los acentos no bloquean la respuesta en esta etapa inicial.' : 'Listen to the Spanish word, identify its sounds and type it.'}</p>
          </div>
          <div className="dictation-card">
            <span className="dictation-emoji">{dictation.emoji}</span>
            <button className="dictation-listen" onClick={()=>speak(dictation.word)}><Volume2/>{language==='es' ? 'Escuchar palabra' : 'Hear word'}</button>
            <div className="dictation-slots">{dictation.syllables.map((_,index)=><span key={index}>?</span>)}</div>
            <input value={dictationInput} onChange={(event)=>{setDictationInput(event.target.value);setDictationResult(null)}} placeholder={language==='es' ? 'Escribe aquí…' : 'Type here…'} />
            {dictationResult !== null && <div className={`dictation-result ${dictationResult ? 'good' : 'retry'}`}>{dictationResult ? <><Check/> ¡Muy bien! {dictation.word}</> : <><Sparkles/> Escucha otra vez y prueba despacio.</>}</div>}
            <div className="dictation-actions">
              <button onClick={checkDictation} disabled={!dictationInput.trim()}>{language==='es' ? 'Comprobar' : 'Check'}</button>
              <button onClick={nextDictation}>{language==='es' ? 'Otra palabra' : 'Next word'}</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
