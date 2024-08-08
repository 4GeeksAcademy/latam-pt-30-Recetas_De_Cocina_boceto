import React from "react";
import { Link } from "react-router-dom";
import cheff from "../../img/cheff.jpeg";


export const Navbar = () => {
	return (
		
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<Link to="/">
				<span className="navbar-brand mb-0 h1 ms-5">
					<img src={cheff} className="img-fluid rounded-circle" style={{maxWidth: "7rem", maxHeight: "7rem"}}/>
				</span>
				</Link>
				<form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
				<div className="ml-auto">
					<Link to={'/login'}>
						<button className="btn btn-secondary ">Iniciar Sesión</button>
					</Link>
				</div>
			</div>
		</nav>
		
	);
};
