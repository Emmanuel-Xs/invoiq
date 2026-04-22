import logo from '@/assets/site-icon.svg?url'

export const SiteLogo = () => {
  return (
    <div className="w-full">
      <div className="size-[72px] md:size-20 lg:size-24 bg-primary rounded-r-[20px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary-hover rounded-tl-[20px] z-10" />
        <img
          src={logo}
          alt="logo"
          className="w-7 h-6 md:w-[31px] md:h-[29px] lg:w-10 lg:h-[37.71px] z-20"
        />
      </div>
    </div>
  )
}
