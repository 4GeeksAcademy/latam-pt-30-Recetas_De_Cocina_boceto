import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import recetasImageUrl from "../../img/recetas.jpeg";
import recetasImageUr2 from "../../img/recetas 2.jpeg";
import recetasImageUr3 from "../../img/recetas 3.jpg";
import recetasPostres from "../../img/postres.jpg";
import recetasDesayunos from "../../img/Desayunos.jpeg";
import recetasAlmuerzos from "../../img/almuerzos.jpg";
import recetasKeto from "../../img/Keto.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (

		<div className="text-center mt-5">
			 <header className="text-center py-5">
             <h1><strong>Recetas de cocina</strong></h1>
             </header>
			 <div class="row align-items-center">
			 <div className="col">
								<img src={recetasImageUr2} className="img-fluid rounded-circle" style={{maxWidth: "20rem", maxHeight: "20rem"}}/>
                <h3><strong>Deliciosas</strong></h3>
							</div>
			<div className="col">
			
				<img src={recetasImageUrl} className="img-fluid rounded-circle" style={{maxWidth: "20rem", maxHeight: "20rem"}} />
        <h3><strong>Recetas</strong></h3>
		
			</div>
			<div className="col">
			
				<img src={recetasImageUr3} className="img-fluid rounded-circle" style={{maxWidth: "20rem", maxHeight: "20rem"}} />
        <h3><strong>Culinarias</strong></h3>
			
			</div>
			</div>
			<div className="container my-5">
    <div className="row">
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"><strong>Postres</strong></h5>
            <p>
				<img src={recetasPostres} className="img-fluid rounded-circle" style={{maxWidth: "17rem", maxHeight: "17rem"}} />
			</p>
            <p className="card-text">Deliciosos postres para cada ocasión.</p>
            <a href="#" className="btn btn-secondary bg-dark">Ver recetas</a>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
          <h5 className="card-title"><strong>Desayunos</strong></h5>
            <p>
				<img src={recetasDesayunos} className="img-fluid rounded-circle" style={{maxWidth: "10rem", maxHeight: "10rem"}} />
			</p>
            <p className="card-text">Comienza tu día con energía.</p>
            <a href="#" className="btn btn-secondary bg-dark ">Ver recetas</a>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
          <h5 className="card-title"><strong>Almuerzos</strong></h5>
            <p>
				<img src={recetasAlmuerzos} className="img-fluid rounded-circle" style={{maxWidth: "13rem", maxHeight: "13rem"}} />
			</p>
            <p className="card-text">Recetas para una comida completa.</p>
            <a href="#" className="btn btn-secondary bg-dark ">Ver recetas</a>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
          <h5 className="card-title"><strong>Keto</strong></h5>
            <p>
				<img src={recetasKeto} className="img-fluid rounded-circle" style={{maxWidth: "10rem", maxHeight: "10rem"}} />
			</p>
            <p className="card-text">Recetas bajas en carbohidratos.</p>
            <a href="#" className="btn btn-secondary bg-dark">Ver recetas</a>
          </div>
        </div>
      </div>
    </div>
  </div>
			
  <Link to="/demo">
				<button className="btn btn-secondary bg-dark">Ver mas</button>
			</Link>
			
		</div>
	);
};
