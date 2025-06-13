function Header() {
  return (
    <header className="bg-white ">
      <nav className="px-8 p-2 justify-center lg:justify-between items-center flex ml-[10%] mr-[10%]">
        <div className="hidden lg:flex pl-15 h-20">
          <a className="" href="/">
            <img
              src="logo-denhaag.jpg"
              alt="Den Haag Logo"
              className="h-full w-full object-cover"
            />
          </a>
        </div>
        <div className="flex gap-x-12 text-2xl justify-center">
          <h1 className="denhaag-text">PrototypeMaps</h1>
        </div>
        <div className="hidden lg:flex pr-15 h-20">
          <a className="" href="/">
            <img
              src="favicon.png"
              alt="Data & participatie logo"
              className="h-full w-full object-cover"
            />
          </a>
        </div>
        {/* <h2 className="subtitle">Kaart van Den Haag</h2>
                <p className="description">Dit is een interactieve kaart van Den Haag. Klik op de kaart om een marker toe te voegen.</p> */}
      </nav>
    </header>
  );
}

export default Header;
