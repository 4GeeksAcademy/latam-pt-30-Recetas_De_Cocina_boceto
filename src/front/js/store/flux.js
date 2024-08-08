const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			// 
			creareceta: null,
			crearecetaIdToDelete: null,
			error: null,

			favorites: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},


			loadCrearecetas: async () => {
				let data = null;
				const store = getStore();
				setStore({...store, error:null});
				try{
					const res = await fetch('');

					if(!res.ok){
						if(res.status == 404){
							const actions = getActions();
							await actions.createReceta();
							setStore({...store, crearecetas:[]});
							return;
						}
						console.log("Error receta no obtenida");
						throw "Error obteniendo receta";
					}

					data = await res.json();
					if(!data.crearecetas){
						throw "Error en respuesta, receta no existe";
					}

					const crearecetas = data.crearecetas;
					setStore({ ...store, crearecetas:crearecetas });

				}catch(exception){
					console.log("Excepcion obteniendo receta", exception,data);
					setStore({...store, crearecetas:[]});
				}
			},

			createLista: async () => {
				try{
					const res = await fetch('', {
						method:'POST'
					});

					if(!res.ok){
						throw "Error creando receta";
					}
				}catch(exception){
					throw exception;
				}
			},

			creaRecetas: async (creareceta) =>{
				let store = getStore();
				setStore({...store, error:null});
				try{
					const res = await fetch('', {
						method:'POST',
						body: JSON.stringify(creareceta),
						headers: {'content-type': 'application/json'}
					});

					if(!res.ok){
						throw "Error creando receta";
					}

					const addedReceta = await res.json();

					store = getStore()
					setStore({...store, crearecetas:[...store.crearecetas, addedReceta]});
					
				}catch(exception){
					console.log("Excepcion obteniendo receta", exception);
					setStore({...store, error: exception});
				}
				
			},

			getCrearecetas:  (crearecetaId) =>{
				const store = getStore();
				const found =  store.crearecetas.find(creareceta=> creareceta.id == crearecetaId );
				return found;
			},

			updateCrearecetas: async (creareceta) => {
				let store = getStore();
				setStore({...store, error:null});
				try{
					const res = await fetch(``, {
						method:'PUT',
						body: JSON.stringify(creareceta),
						headers: {'content-type': 'application/json'}
					});

					if(!res.ok){
						throw "Error actualizando receta.";
					}

					const updatedCreareceta = await res.json();
				
					store = getStore();
					
					setStore({...store, crearecetas:[...store.crearecetas.filter(x=> x.id != creareceta.id), updatedCreareceta]});
				}catch(exception){
					console.log("Excepcion actualizando receta", exception);
					setStore({...store, error: exception});
				}
			
			},

			deleteCrearecetas: async (crearecetaId)=>{
				let store = getStore();
				setStore({...store, crearecetasIdToDelete:null, error:null});

				try{
					const res = await fetch(``, {
						method:'DELETE',
						headers: {'content-type': 'application/json'}
					});

					if(!res.ok){
						throw "Error actualizando receta.";
					}

					store = getStore()
					setStore({...store, crearecetas: store.crearecetas.filter(x=> x.id != crearecetaId)});
				}catch(exception){
					console.log("Excepcion actualizando receta", exception);
					setStore({...store, error: exception});
				}
			},

			setIdToDelete: (crearecetaId)=>{
				const store = getStore();
				setStore({...store, crearecetaIdToDelete: crearecetaId})
			},


			getFavorite: (favorite) => {
                let storeFavorites = getStore().favorites;
                setStore({ favorites: [...storeFavorites, favorite] });
            },

			removeFavorite: (index) => {
                let storeFavorites = getStore().favorites;
                storeFavorites.splice(index, 1);
                setStore({ favorites: storeFavorites });
            },

			signup: async (email, password) => {
				try {
					
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					})
					if (response.ok) {
						return true
					} else {
						console.error("Failed to sign up")
						return false
					  }

				} catch (error) {
					console.log("Error during sign up", error)
				  }
			},
			login: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });

					if (response.status !== 201) {
						console.error("There has been some error"); 
						
                        return false;
					}

					const data = response.json()
					sessionStorage.setItem("token", data.token);
                    setStore({ token: data.token });
                    return true;

				

				} catch(error) {
					console.log("ERROR CATCH:", error)
				}
			},
			logout: () => {
				sessionStorage.removeItem("token");
                setStore({ token: null });
			}

			
		}
	};
};

export default getState;
