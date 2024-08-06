import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import formulario from "../../img/crearecets.jpg";


import { Context } from "../store/appContext";

export const CreaReceta = () => {
    const [data, setData] = useState({Platillo:'', Ingredientes:'', Pasos:'', InfoNutri:'', ImportarImagen:''});
    const { actions, store } = useContext(Context);
    const { crearecetaId } = useParams();
    const navigate = useNavigate();
    

    useEffect(()=>{
        if(crearecetaId != undefined && store.creareceta.length > 0){
            const creareceta =  actions.getContact(crearecetaId);
            setData(creareceta);
        }
    }, [store.creareceta])

    const setValue = (event)=>{
        setData({...data, [event.target.name]: event.target.value })
    }

    const onSubmit = async (event)=>{
        event.preventDefault();
        
        if(crearecetaId != undefined ){
            await actions.updateCrearecetas(data);
        }else{
            await actions.creaRecetas(data);
        }
        if(store.error){
            alert("Error: "+ store.error);
            return;
        }
        navigate('/addnewrecet');
    }


	return (
		<React.Fragment>
		<div className="container">
			<div className="text-center mt-5">
			 <header className="text-center py-5">
             <h1><strong>Crea tu receta</strong></h1>
			 <img src={formulario} class="mx-auto" alt="Card image cap" style={{maxWidth: "15rem", maxHeight: "15rem"}} />
             </header>

			 <div class="card border-success bg-dark text-white">
             <div class="card-body ">
             <form onSubmit={onSubmit}>
				
			 <div className= "mb-3">
                    <label htmlFor="inputPlatillo" className="form-label"><h5><strong>Platillo</strong></h5></label>
                    <input required type="text" name="Platillo" className="form-control form-control-lg border-success" id="inputPlatillo" 
                        placeholder="Agrega nombre de Platillo" value={data.Platillo} onChange={setValue}/>
                </div>

				<div className="mb-3">
                    <label htmlFor="inputIngredientes" className="form-label"><h5><strong>Ingredientes</strong></h5></label>
                    <textarea required type="text" name="Ingredientes" className="form-control form-control-lg border-success" id="inputIngredientes"
                        placeholder="Agrega Ingredientes"  value={data.Ingredientes} onChange={setValue}/>
                </div>

				<div className="mb-3">
                    <label htmlFor="inputPasos" className="form-label"><h5><strong>Pasos</strong></h5></label>
                    <textarea required type="text" name="Pasos" className="form-control form-control-lg border-success" id="inputPasos"
                        placeholder="Agrega Pasos de preparación" value={data.Pasos} onChange={setValue}/>
                </div>

				<div className="mb-3">
                    <label htmlFor="inputInfoNutri" className="form-label"><h5><strong>información nutricional</strong></h5></label>
                    <textarea required type="text" name="InfoNutri" className="form-control form-control-lg border-success" id="inputInfoNutri"
                        placeholder="Agrega la información nutricional" value={data.InfoNutri} onChange={setValue}/>
                </div>

				<div className="mb-3">
                    <label htmlFor="inputImage" className="form-label"><h5><strong>Importar imagen</strong></h5></label>
                    <input type="file" name="ImportarImagen" className="form-control form-control-lg border-success" id="inputImage"
                        placeholder="" value={data.Image} onChange={setValue}/>
                </div>

				

                <div className="d-grid">
                        <button type="submit" className="btn btn-success w-100">Save</button>
                    </div>
                 </form>
				 </div>
				 </div>
		</div>
		
		
			<br />
			<Link to="/addnewrecet">
				<button className="btn btn-secondary bg-dark">Regresar</button>
			</Link>
		</div>

		</React.Fragment>
        
	);
};
