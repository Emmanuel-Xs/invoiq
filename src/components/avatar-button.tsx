import { useProfileStore } from '@/store/profile-store'

interface AvatarButtonProps {
  onProfileClick: () => void
}

export default function AvatarButton({ onProfileClick }: AvatarButtonProps) {
  const { name, avatarStyle } = useProfileStore()

  const avatarUrl = name
    ? `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`
    : null
  return (
    <button
      onClick={onProfileClick}
      aria-label="Edit profile"
      className="size-8 md:size-10 rounded-full overflow-hidden border border-transparent hover:border-primary transition-colors"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[hsl(233,30%,21%)] flex items-center justify-center text-primary-foreground text-sm font-bold">
          ?
        </div>
      )}
    </button>
  )
}
