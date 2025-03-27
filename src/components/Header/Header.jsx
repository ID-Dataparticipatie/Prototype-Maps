function Header() {
    return (
        <header className="bg-white ">
            <nav className="flex justify-between items-center p-2">
                <div className="flex pl-15 h-20">
                    <a className="" href="/">
                        <img src="logo-denhaag.jpg" alt="Den Haag Logo" className="h-full w-full object-cover"/>
                    </a>
                </div>
                <h1 className="title">Den Haag</h1>
                {/* <h2 className="subtitle">Kaart van Den Haag</h2>
                <p className="description">Dit is een interactieve kaart van Den Haag. Klik op de kaart om een marker toe te voegen.</p> */}
            </nav>
        </header>
    );
}

export default Header;