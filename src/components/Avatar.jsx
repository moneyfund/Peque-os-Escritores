const avatarMap = {
  fox: '🦊', bunny: '🐰', panda: '🐼', lion: '🦁', koala: '🐨', frog: '🐸', cat: '🐱', dog: '🐶', unicorn: '🦄', owl: '🦉',
}

export const avatarOptions = Object.keys(avatarMap)

export default function Avatar({ avatar, avatarType, size = 'md', className = '' }) {
  if ((avatarType === 'url' || avatarType === 'upload') && avatar) {
    return <img className={`avatar avatar-${size} ${className}`} src={avatar} alt="" referrerPolicy="no-referrer" />
  }
  return <span className={`avatar avatar-${size} avatar-emoji ${className}`} aria-hidden="true">{avatarMap[avatar] || '🦊'}</span>
}
