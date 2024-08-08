import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import formulario from "../../img/crearecets.jpg";

import cubiertosplato from "../../img/Cubiertos-en-plato.jpg";

import { Link } from "react-router-dom";

export const Addnewrecet = () => {
	const { store, actions } = useContext(Context);

	const deleteCrearecetas = ()=>{
			actions.deleteCrearecetas(store.crearecetasIdToDelete);
	}

	return (<>
	<div className="container">
	<header className="text-center py-5">
             <h1><strong>Crea tu receta</strong></h1>
			 <img src={formulario} class="mx-auto" alt="Card image cap" style={{maxWidth: "15rem", maxHeight: "15rem"}} />
             </header>
		<div className="row">
			<div className="col">
				<div className="my-3 text-center ">
					<Link  className="btn btn-success" to="/addreceta"> Crea tu propia receta</Link>
				</div>
				<div>
					{ store.crearecetas && store.crearecetas.length > 0 && store.crearecetas.map(creareceta => (<div key={creareceta.id} className="card">
						<div className="row g-0">
							<div className="col-md-2 ms-5 text-center">
								<img src={cubiertosplato} className="my-2 contact__img" alt="Profile picture"/>
							</div>
							<div className="col-md-5">
							<div className="card-body lh-lg">
								<h5 className="card-title fw-normal">{creareceta.name}</h5>
								<p className="card-text text-black-50"><i className="fa fa-map-marker-alt me-2"></i> {creareceta.address}</p>
								<p className="card-text text-black-50"><i className="fa fa-phone me-2"></i> {creareceta.phone}</p>
								<p className="card-text text-black-50"><i className="fa fa-envelope me-2"></i> {creareceta.email}</p>
							</div>
							</div>
							<div className="col-md-4 my-2 text-end">
								<Link className="text-dark me-5" to={'/editreceta/'+creareceta.id} ><i className="fa fa-edit"></i></Link>
								<a className="text-dark" onClick={()=>{actions.setIdToDelete(creareceta.id)}} href="#deleteModal" data-bs-toggle="modal"><i className="fa fa-trash"></i></a>
							</div>
						</div>
					</div>))}
					{store.crearecetas && store.crearecetas.length == 0 && <>
						<div className="alert alert-warning" role="alert">
							No tienes recetas, agrega una!
						</div>
					</>}
				</div>

			</div>
		</div>
	</div>

	<div className="modal" id="deleteModal">
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title">Estas seguro?</h5>
					<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<p>If you delete this thing the entire universe will go down!</p>
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Oh no!</button>
					<button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={deleteCrearecetas} >Yes baby</button>
				</div>
			</div>
		</div>
	</div>
	</>)
};