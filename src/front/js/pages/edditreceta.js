import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";


import { Form } from "../component/form";

export const Editreceta = () => {
	const { store, actions } = useContext(Context);

	return (
		<>
			<h1 className="text-center mt-4">Edita receta</h1>
			<Form />
			
		</>
	);
};