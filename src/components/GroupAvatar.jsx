import { UsersRound } from 'lucide-react'

export default function GroupAvatar({ avatar, avatarType, size = 'md', className = '' }) {
  if ((avatarType === 'url' || avatarType === 'upload') && avatar) {
    return <img className={`group-avatar group-avatar-${size} ${className}`} src={avatar} alt="" referrerPolicy="no-referrer" />
  }

  return (
    <span className={`group-avatar group-avatar-${size} group-avatar-default ${className}`} aria-hidden="true">
      <i className="group-avatar-bubble bubble-a" />
      <i className="group-avatar-bubble bubble-b" />
      <i className="group-avatar-bubble bubble-c" />
      <UsersRound size={size === 'xl' ? 44 : size === 'lg' ? 35 : size === 'md' ? 28 : 22} strokeWidth={2.3} />
    </span>
  )
}
