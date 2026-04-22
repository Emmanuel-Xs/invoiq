import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileStore {
  name: string
  avatarStyle: string
  setProfile: (name: string, avatarStyle: string) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      name: '',
      avatarStyle: 'adventurer',
      setProfile: (name, avatarStyle) => set({ name, avatarStyle }),
    }),
    { name: 'invoiq-profile' },
  ),
)
