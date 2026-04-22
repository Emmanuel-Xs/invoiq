import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/store/profile-store'

const AVATAR_STYLES = [
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'avataaars', label: 'Avataaars' },
  { id: 'big-ears', label: 'Big Ears' },
  { id: 'croodles', label: 'Croodles' },
  { id: 'fun-emoji', label: 'Fun Emoji' },
  { id: 'lorelei', label: 'Lorelei' },
]

interface ProfileDrawerProps {
  open: boolean
  onClose: () => void
}

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const { name, avatarStyle, setProfile } = useProfileStore()
  const [localName, setLocalName] = useState(name)
  const [localStyle, setLocalStyle] = useState(avatarStyle)

  const previewUrl = localName
    ? `https://api.dicebear.com/9.x/${localStyle}/svg?seed=${encodeURIComponent(localName)}&backgroundColor=b6e3f4`
    : null

  function handleSave() {
    if (!localName.trim()) return
    setProfile(localName.trim(), localStyle)
    onClose()
  }

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()} direction="left">
      <DrawerContent className="h-full w-full max-w-[480px] rounded-r-[20px] rounded-l-none border-0 bg-card px-8 py-10 flex flex-col gap-8">
        <DrawerHeader className="p-0">
          <DrawerTitle className="text-heading-s text-foreground">
            Your Profile
          </DrawerTitle>
        </DrawerHeader>

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-primary/20">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Enter name
              </div>
            )}
          </div>
          {localName && (
            <p className="text-heading-s text-foreground">{localName}</p>
          )}
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-name" className="text-body text-primary">
            Your Name
          </Label>
          <Input
            id="profile-name"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="e.g. Emmanuel"
            className="bg-card border-border text-foreground"
          />
        </div>

        {/* Style picker */}
        <div className="flex flex-col gap-3">
          <Label className="text-body text-primary">Avatar Style</Label>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_STYLES.map((style) => {
              const url = localName
                ? `https://api.dicebear.com/9.x/${style.id}/svg?seed=${encodeURIComponent(localName || 'preview')}&backgroundColor=b6e3f4`
                : `https://api.dicebear.com/9.x/${style.id}/svg?seed=preview&backgroundColor=b6e3f4`

              return (
                <button
                  key={style.id}
                  onClick={() => setLocalStyle(style.id)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                    localStyle === style.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img src={url} alt={style.label} className="w-12 h-12" />
                  <span className="text-body-s text-muted-foreground">
                    {style.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Save */}
        <div className="mt-auto">
          <Button
            onClick={handleSave}
            disabled={!localName.trim()}
            className="w-full bg-primary hover:bg-primary-hover text-white rounded-full h-12 text-body font-bold"
          >
            Save Profile
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
