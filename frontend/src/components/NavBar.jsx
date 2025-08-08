import { Link } from "react-router-dom";
import "../css/NavBar.css"

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand" >
                <Link to="/">FAVFLIX</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favourites" className="nav-link">Favourites</Link>
            </div>
            <div className="fav-icon">
            <Link to="/favourites"><i className="fas fa-heart" /></Link>
            </div>
        </nav>
    )
}

export default NavBar