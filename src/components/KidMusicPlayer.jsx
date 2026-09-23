import { useEffect, useRef, useState } from 'react'
import { Music2, Pause, Play, SkipForward, Upload, Volume2, X } from 'lucide-react'

const melodies = [
  {
    title:'Aventura ABC',
    subtitle:'Melodía original para aprender',
    tempo:1,
    notes:[261.63,329.63,392,523.25,392,329.63,293.66,349.23,440,587.33,440,349.23],
  },
  {
    title:'Pasitos 1 · 2 · 3',
    subtitle:'Ritmo alegre de números',
    tempo:.86,
    notes:[293.66,293.66,369.99,440,369.99,329.63,293.66,440,493.88,587.33,493.88,440],
  },
  {
    title:'Arcoíris en movimiento',
    subtitle:'Melodía suave de colores',
    tempo:1.12,
    notes:[329.63,392,493.88,659.25,587.33,493.88,392,440,523.25,659.25,523.25,440],
  },
]

export default function KidMusicPlayer({ compact=false }) {
  const [trackIndex,setTrackIndex]=useState(0)
  const [playing,setPlaying]=useState(false)
  const [customSong,setCustomSong]=useState(null)
  const audioRef=useRef(null)
  const contextRef=useRef(null)
  const finishTimerRef=useRef(null)

  const stopGenerated=() => {
    window.clearTimeout(finishTimerRef.current)
    finishTimerRef.current=null
    if (contextRef.current) {
      contextRef.current.close().catch(() => {})
      contextRef.current=null
    }
  }

  const stop=() => {
    stopGenerated()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime=0
    }
    setPlaying(false)
  }

  useEffect(() => () => {
    stopGenerated()
    if (customSong?.url) URL.revokeObjectURL(customSong.url)
  }, [customSong?.url])

  const playGenerated=() => {
    stopGenerated()
    const AudioContext=window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const context=new AudioContext()
    contextRef.current=context
    const track=melodies[trackIndex]
    const noteLength=.28 * track.tempo
    let cursor=context.currentTime+.04

    track.notes.forEach((frequency,index) => {
      const osc=context.createOscillator()
      const gain=context.createGain()
      osc.type=index%3===0 ? 'triangle' : 'sine'
      osc.frequency.value=frequency
      gain.gain.setValueAtTime(0.0001,cursor)
      gain.gain.exponentialRampToValueAtTime(.12,cursor+.03)
      gain.gain.exponentialRampToValueAtTime(.0001,cursor+noteLength-.03)
      osc.connect(gain)
      gain.connect(context.destination)
      osc.start(cursor)
      osc.stop(cursor+noteLength)
      cursor+=noteLength
    })

    setPlaying(true)
    finishTimerRef.current=window.setTimeout(() => setPlaying(false), Math.max(100,(cursor-context.currentTime)*1000))
  }

  const toggle=async() => {
    if (playing) {
      stop()
      return
    }
    if (customSong && audioRef.current) {
      try {
        await audioRef.current.play()
        setPlaying(true)
      } catch {}
      return
    }
    playGenerated()
  }

  const next=() => {
    stop()
    setCustomSong(null)
    setTrackIndex((value)=>(value+1)%melodies.length)
  }

  const addSong=(event) => {
    const file=event.target.files?.[0]
    if (!file) return
    stop()
    if (customSong?.url) URL.revokeObjectURL(customSong.url)
    setCustomSong({ title:file.name.replace(/\.[^.]+$/,''), subtitle:'Audio agregado desde este dispositivo', url:URL.createObjectURL(file) })
    event.target.value=''
  }

  const removeCustom=() => {
    stop()
    if (customSong?.url) URL.revokeObjectURL(customSong.url)
    setCustomSong(null)
  }

  const track=customSong || melodies[trackIndex]

  return (
    <div className={`kid-music-player ${compact ? 'is-compact' : ''}`}>
      <span className="kid-music-icon"><Music2 size={20}/></span>
      <div className="kid-music-copy">
        <small>{customSong ? 'Tu canción' : 'Música para aprender'}</small>
        <strong>{track.title}</strong>
        {!compact && <span>{track.subtitle}</span>}
      </div>
      <div className="kid-music-actions">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
          {playing ? <Pause size={16}/> : <Play size={16}/>}
        </button>
        {!customSong && <button type="button" onClick={next} aria-label="Siguiente melodía"><SkipForward size={16}/></button>}
        {customSong && <button type="button" onClick={removeCustom} aria-label="Quitar canción"><X size={16}/></button>}
        <label className="kid-music-upload" title="Agregar audio">
          <Upload size={15}/>
          <input type="file" accept="audio/*" onChange={addSong}/>
        </label>
      </div>
      <span className="kid-music-wave" aria-hidden="true"><i/><i/><i/><i/><i/></span>
      {customSong && <audio ref={audioRef} src={customSong.url} onEnded={() => setPlaying(false)} preload="metadata"/>}
      {!customSong && <Volume2 className="kid-music-speaker" size={15}/>}
    </div>
  )
}
