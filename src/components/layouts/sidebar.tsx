import AvatarButton from '../avatar-button'
import { SiteLogo } from '../site-logo'
import { ThemeButton } from '../theme-button'
import { Separator } from '../ui/separator'

interface SidebarProps {
  onProfileClick: () => void
}

export function Sidebar({ onProfileClick }: SidebarProps) {
  return (
    <>
      {/* ── Desktop: left sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-24 flex-col justify-between bg-sidebar rounded-r-[20px] z-50 overflow-hidden">
        <SiteLogo />
        <div className="flex flex-col items-center gap-6 pb-6">
          <ThemeButton />
          <Separator className="w-full h-px bg-divider" />
          <AvatarButton onProfileClick={onProfileClick} />
        </div>
      </aside>

      {/* ── Mobile and Tablet: top navbar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-[72px] md:h-20 bg-sidebar flex items-center justify-between z-50">
        <SiteLogo />
        <div className="flex items-center gap-6 pr-6">
          <ThemeButton />
          <Separator
            className="w-px h-[72px] bg-divider"
            orientation="vertical"
          />
          <AvatarButton onProfileClick={onProfileClick} />
        </div>
      </header>
    </>
  )
}
