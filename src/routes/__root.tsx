import { Outlet, createRootRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Sidebar } from '@/components/layouts/sidebar'
import { ProfileDrawer } from '@/components/layouts/profile-drawer'
import { GooeyToaster } from 'goey-toast'
import 'goey-toast/styles.css'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onProfileClick={() => setProfileOpen(true)} />
      <main className="pt-[104px] md:pt-[141px] lg:pt-[77px] w-[min(100%-1.5rem,730px)] md:w-[min(100%-3rem,730px)] mx-auto">
        <Outlet />
      </main>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      <GooeyToaster position="top-center" />
    </div>
  )
}
