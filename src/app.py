"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from urllib import response
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from fpdf import FPDF
from PIL import Image
import requests
from io import BytesIO



from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import Paso, db, User, Plato, Categoria,Ingrediente,InformacionNutritiva
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands 
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

#JWT CONFIG
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object

load_dotenv(find_dotenv(), override=True)
client = OpenAI
def generate_recipe(ingredientes):
    system_prompt  = '''
        Eres un chef de primera clase
        '''
    user_prompt  = f'''
        Crea una receta detallada basada unicamente en los siguientes ingredientes { ', '.join(ingredientes)}
        Por Favor formatea la receta de la siguiente manera :

        Titulo de la receta:

        Ingredientes de la receta con tamaño y porción:

        Lista de instrucciones para esta receta:
        '''
    response = client.chat.completions.create(
        model='gpt-4o',
        messages=[
            { 'role': 'system', 'content': system_prompt},
            { 'role': 'user', 'content': user_prompt}
        ],
        max_tokens=1020,
        temperature=0.9
    )
    return response.choices[0].message.content

def obtener_nombre_receta(texto):
    lines = texto.splitlines()

    return lines[1]

def generar_imagen(titulo_receta):
    prompt  = f'''
    Crea una imagen fotorrealista del plano final titulado "{titulo_receta}".
    El plato debe de estar bellamente representado en un plato de ceramica con un enfoque cercano en las 
    texturas y colores de los ingredientes.
    La ambientación debe de ser una sobremesa de madera con iluminación natural para resaltar las 
    caracteristicas apetitosas de la comida. Asegurate de que la imagen capture los colores ricos
    y vibrantes y los detalles intrincados de la comida, haciendola parcer recien preparada y lista
    para comer. 
    '''
    response = client.images.generate(
        model='dall-e-3',
        prompt=prompt,
        style='vivid',
        size='1024x1024',
        quality='standard',
        n=1

    )
    return response.data[0].url

def save_to_pdf(titulo_receta, receta, imagen_url):
    pdf= FPDF()
    pdf.add_page()
    pdf.set_font(family="Arial", size=12)

    pdf.set_font(family="Arial",style='B', size=16)
    pdf.cell(w=0, h=10, txt=titulo_receta, ln=True, align='C')

    response = requests.get(imagen_url)
    img = Image.open(BytesIO(response.content)).convert("RGB")
    img_path = f"{titulo_receta.replace(' ', '_')}.jpg"
    img.save(img_path, format="JPEG")

    pdf.ln(10)
    img_width = 190
    pdf.image(img_path, x=(pdf.w - img_width) / 2, w=img_width, type='JPEG')
    pdf.ln(10)

    pdf.set_font(family="Arial", size=12)
    for line in receta.split('/n'):
        pdf.multi_cell(line, w=0, h=10,)

        pdf_file = "receta.pdf"
        pdf.output(pdf_file)

        return pdf_file
    
    st.title("Generador de Recetas")
    st.write("Ingrese los ingredientes para generar una receta personalizada:")
    ingredientes  = st.text_input("ingredientes(separados por comas)")

    if st.button("Generar receta"):
        ingredientes_list = [ing.strip() for ing in ingredientes.split(",")]
        receta = generate_recipe(ingredientes_list)
        st.session_state.receta = receta
        titulo_receta  = obtener_nombre_receta(receta)
        st.session_state.titulo_receta = titulo_receta
        imagen_receta  = generar_imagen(titulo_receta)
        st.session_state.imagen_receta = imagen_receta 

    if 'receta' in st.session_state:
        st.write(st.session_state.receta)
        st.write(f"{st.session_state.titulo_receta}")
        st.image(st.session_state.imagen_receta, caption=st.session_state.titulo_receta)

    if st.button("Descargar receta en pdf"):
        pdf_file = save_to_pdf(st.session_state.titulo_receta,
                               st.session_state.receta,
                               st.session_state.imagen_receta)  
        with open(pdf_file,"rb") as f:
            st.download_button(label="Descargar PDF",
                               data=f, file_name=pdf_file,
                               mime="aplication/pdf")



    






@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@app.route("/signup", methods=["POST", 'GET'])
def registro():
    return 

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
    
 




# Verificar que los datos necesarios están presentes
    """required_fields = ["nombre", "categoria", "ingredientes", "pasos", "informacion_nutritiva"]
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400"""


# this only runs if `$ python src/main.py` is executed
