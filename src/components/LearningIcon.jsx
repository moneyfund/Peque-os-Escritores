import {
  Bell,
  BookOpen,
  Calculator,
  Hash,
  Image,
  ListOrdered,
  MessageCircle,
  Palette,
  PawPrint,
  Pencil,
  Play,
  Puzzle,
  Shapes,
  Type,
  UserRound,
  UsersRound,
  Volume2,
} from 'lucide-react'
import { motion } from 'motion/react'

const iconMap = {
  vowels: Type,
  alphabet: Type,
  numbers: Hash,
  colors: Palette,
  shapes: Shapes,
  words: Volume2,
  'trace-vowels': Pencil,
  'listen-vowels': Volume2,
  'vowel-pictures': Image,
  'vowel-hunt': Image,
  'vowel-master': Type,
  'alphabet-listen': Volume2,
  'alphabet-recognize': Type,
  'alphabet-trace': Pencil,
  'alphabet-order': ListOrdered,
  'alphabet-beginnings': Image,
  'count-objects': Calculator,
  'number-order': ListOrdered,
  'trace-numbers': Pencil,
  'compare-numbers': Calculator,
  'missing-number': Hash,
  'trace-lines-basic': Pencil,
  'trace-geometric-shapes': Shapes,
  'find-color': Palette,
  'listen-colors': Volume2,
  'color-objects': Palette,
  'listen-more-colors': Volume2,
  'color-challenge': Palette,
  'identify-shapes': Shapes,
  patterns: Puzzle,
  'shapes-around-us': Shapes,
  'animal-sounds': PawPrint,
  'first-words': MessageCircle,
  'initial-sounds': Type,
  'match-words': Image,
  'listen-words-advanced': Volume2,
  learn: BookOpen,
  groups: UsersRound,
  invitations: Bell,
  profile: UserRound,
  play: Play,
}

const motionMap = {
  vowels: { rotate: [-4, 4, -4], y: [0, -3, 0] },
  numbers: { rotate: [0, 6, 0], y: [0, -4, 0] },
  colors: { rotate: [-7, 7, -7], scale: [1, 1.04, 1] },
  shapes: { rotate: [0, 9, 0], y: [0, -3, 0] },
  words: { scale: [1, 1.06, 1], y: [0, -2, 0] },
}

export default function LearningIcon({ name, size = 28, animated = true, className = '' }) {
  const Icon = iconMap[name] || BookOpen
  const animation = motionMap[name] || { y: [0, -3, 0], rotate: [-2, 2, -2] }

  return (
    <motion.span
      className={`learning-icon ${className}`}
      animate={animated ? animation : undefined}
      transition={animated ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={2.25} />
    </motion.span>
  )
}
