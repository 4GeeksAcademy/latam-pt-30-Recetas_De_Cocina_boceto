import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";


import { Form } from "../component/form";

export const Addreceta = () => {
	const { store, actions } = useContext(Context);

	return (
		<>

			<h1 className="text-center mt-4"></h1>
			<Form />
			
		</>
	);
};