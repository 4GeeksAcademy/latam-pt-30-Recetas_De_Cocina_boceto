import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import formulario from "../../img/crearecets.jpg";

export const AppGeneradorRecetas = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  const fetchRecipe = async () => {
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=8222d1b01baf495583f1fc075cbbbc25`);
    const data = await response.json();
    if (data.length > 0) {
      const recipeId = data[0].id;
      const recipeDetailsResponse = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=8222d1b01baf495583f1fc075cbbbc25`);
      const recipeDetails = await recipeDetailsResponse.json();
      const translatedIngredients = await translateIngredients(recipeDetails.extendedIngredients);
      setRecipe({ ...recipeDetails, extendedIngredients: translatedIngredients });
    } else {
      setRecipe(null);
    }
  };

  const translateIngredients = async (ingredients) => {
    const translatedIngredients = await Promise.all(ingredients.map(async (ingredient) => {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=8222d1b01baf495583f1fc075cbbbc25`, {
        method: 'POST',
        body: JSON.stringify({
          q: ingredient.original,
          target: 'es'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return { ...ingredient, original: data.data.translations[0].translatedText };
    }));
    return translatedIngredients;
  };

  return (
    <div className="text-center py-5">
      <header className="text-center py-5">
        <h1><strong>Generador de recetas</strong></h1>
        <img src={formulario} className="mx-auto" alt="Card image cap" style={{maxWidth: "15rem", maxHeight: "15rem"}} />
      </header>
      <h1>Generador de Recetas</h1>
      <div>
        <label htmlFor="ingredients">Introduce los ingredientes (separados por comas):</label>
        <input type="text" id="ingredients" value={ingredients} onChange={handleInputChange} />
        <button onClick={fetchRecipe}>Generar Receta</button>
      </div>
      {recipe ? (
        <div id="recipe">
          <h2>{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} style={{maxWidth: "100%"}} />
          <h3>Ingredientes:</h3>
          <ul>
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          <h3>Instrucciones:</h3>
          <p>{recipe.instructions}</p>
        </div>
      ) : (
        <p>No se encontró ninguna receta.</p>
      )}
    </div>
  );
};
